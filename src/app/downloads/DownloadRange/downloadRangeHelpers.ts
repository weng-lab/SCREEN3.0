import { MainQuery } from "app/downloads/DownloadRange/queries"
import { MainQueryData, SCREENSearchResult } from "./types"

/**
 * 
 * @param input A user-entered string representing a genomic region; chr_:start-end or tab separated format supported
 * @returns an object containing chromosome, start, and end (strings)
 */
export function parseGenomicRegion(input: string): { chromosome: string, start: string, end: string } {
    let inputArr: string[]
    let chromosome: string
    let coordinates: string[]
    let start: string
    let end: string
    //This is the tab character. If input contains tab character...
    if (input.includes("	")) {
        inputArr = input.split("	")
        chromosome = inputArr[0]
        start = inputArr[1].replace(new RegExp(',', 'g'), "")
        end = inputArr[2].replace(new RegExp(',', 'g'), "")
    }
    //Else assume it's the chr:start-end format
    else {
        inputArr = input.split(":")
        chromosome = inputArr[0]
        coordinates = inputArr[1].split("-")
        start = coordinates[0].replace(new RegExp(',', 'g'), "")
        end = coordinates[1].replace(new RegExp(',', 'g'), "")
    }

    return { chromosome, start, end }
}

/**
 * 
 * @param assembly "GRCh38" | "mm10"
 * @param chromosome string
 * @param start number
 * @param end number
 * @param biosample string
 * @param nearbygenesdistancethreshold number, 1,000,000 is default if undefined
 * @param nearbygeneslimit number, 3 is default if undefined
 * @param intersectedAccessions string[], optional, for intersected accessions from bed upload
 * @param noLimit boolean, set to true to eliminate 25K limit on results (defined in queries.ts). Only remove limit if region is ~ <20M bp to avoid crashing cCRE service
 * @returns Main cCRE search results (of type MainQueryData) (mostly) raw data. If biosample passed, 
 * the ctspecific zscores in mainQueryData are used to replace normal zscores to avoid passing biosample
 * to specify where to select scores from later in generateFilteredRows
 */
export async function fetchcCREData(
    assembly: "GRCh38" | "mm10",
    chromosome: string,
    start: number,
    end: number,
    biosample: string,
    nearbygenesdistancethreshold: number,
    nearbygeneslimit: number,
    intersectedAccessions?: string[],
    noLimit?: boolean
): Promise<MainQueryData> {

    //cCRESearchQuery
    const mainQueryData: MainQueryData = await MainQuery(
        assembly,
        chromosome,
        start,
        end,
        biosample,
        nearbygenesdistancethreshold,
        nearbygeneslimit,
        intersectedAccessions,
        noLimit
    )
    //If biosample-specific data returned, sync z-scores with ctspecific to avoid having to select ctspecific later
    if (biosample) {
        mainQueryData.data.cCRESCREENSearch = mainQueryData.data.cCRESCREENSearch.map(cCRE => {
            cCRE.dnase_zscore = cCRE.ctspecific.dnase_zscore;
            cCRE.atac_zscore = cCRE.ctspecific.atac_zscore;
            cCRE.enhancer_zscore = cCRE.ctspecific.h3k27ac_zscore;
            cCRE.promoter_zscore = cCRE.ctspecific.h3k4me3_zscore;
            cCRE.ctcf_zscore = cCRE.ctspecific.ctcf_zscore;
            return cCRE
        })
    }

    return (mainQueryData)
}

/**
 * @todo download linked genes data in bed file
 * @param mainQueryData 
 * @param assays 
 * @param conservation 
 * @param linkedGenes 
 * @returns BED file
 */
const convertToBED = (
    mainQueryData: MainQueryData,
    assays: { atac: boolean, ctcf: boolean, dnase: boolean, h3k27ac: boolean, h3k4me3: boolean },
    conservation: { primate: boolean, mammal: boolean, vertebrate: boolean },
): string => {
    //Create header comment for the file
    const header = [
        "# chr\tstart\tend\tacccession\tclassification",
        `${assays.dnase ? '\tDNase_z-score' : ''}`,
        `${assays.atac ? '\tATAC_z-score' : ''}`,
        `${assays.ctcf ? '\tCTCF_z-score' : ''}`,
        `${assays.h3k27ac ? '\tH3K27ac_z-score' : ''}`,
        `${assays.h3k4me3 ? '\tH3K4me3_z-score' : ''}`,
        `${conservation.primate ? '\tprimate_conservation' : ''}`,
        `${conservation.mammal ? '\tmammal_conservation' : ''}`,
        `${conservation.vertebrate ? '\tvertebrate_conservation' : ''}`,
        '\tnearest_gene',
        '\tnearest_gene_distance',
        '\n'
    ].join('')
    const bedContent: string[] = [header];

    mainQueryData.data.cCRESCREENSearch.forEach((item) => {
        const chromosome = item.chrom;
        const start = item.start;
        const end = start + item.len;
        const name = item.info.accession;
        const classification = item.pct;
        const dnase = item.ctspecific.ct ? item.ctspecific.dnase_zscore : item.dnase_zscore;
        const atac = item.ctspecific.ct ? item.ctspecific.atac_zscore : item.atac_zscore;
        const ctcf = item.ctspecific.ct ? item.ctspecific.ctcf_zscore : item.ctcf_zscore;
        const h3k27ac = item.ctspecific.ct ? item.ctspecific.h3k27ac_zscore : item.enhancer_zscore;
        const h3k4me3 = item.ctspecific.ct ? item.ctspecific.h3k4me3_zscore : item.promoter_zscore;
        const primate = item.primates;
        const mammal = item.mammals;
        const vertebrate = item.vertebrates;
        const nearestGene = item.nearestgenes[0].gene
        const nearestGeneDistance = item.nearestgenes[0].distance

        // Construct tab separated row, ends with newline
        const bedRow = [
            `${chromosome}`,
            `\t${start}`,
            `\t${end}`,
            `\t${name}`,
            `\t${classification}`,
            `${assays.dnase ? '\t' + dnase : ''}`,
            `${assays.atac ? '\t' + atac : ''}`,
            `${assays.ctcf ? '\t' + ctcf : ''}`,
            `${assays.h3k27ac ? '\t' + h3k27ac : ''}`,
            `${assays.h3k4me3 ? '\t' + h3k4me3 : ''}`,
            `${conservation.primate ? '\t' + primate : ''}`,
            `${conservation.mammal ? '\t' + mammal : ''}`,
            `${conservation.vertebrate ? '\t' + vertebrate : ''}`,
            `\t${nearestGene}`,
            `\t${nearestGeneDistance}`,
            '\n'
        ].join('')
        // Append to the content string
        bedContent.push(bedRow);
    });

    //sort contents
    return bedContent.sort((a, b) => {
        const startA = parseInt(a.split('\t')[1]);
        const startB = parseInt(b.split('\t')[1]);

        // Compare the start values
        return startA - startB;
    }).join('');
};

export const downloadBED = async (
    assembly: "GRCh38" | "mm10",
    chromosome: string,
    start: number,
    end: number,
    biosampleName: string | undefined,
    bedIntersect: boolean = false,
    TSSranges: { start: number, end: number }[] = null,
    assays: { atac: boolean, ctcf: boolean, dnase: boolean, h3k27ac: boolean, h3k4me3: boolean },
    conservation: { primate: boolean, mammal: boolean, vertebrate: boolean },
    setBedLoadingPercent?: React.Dispatch<React.SetStateAction<number>>
) => {

    setBedLoadingPercent(0)

    const ranges: { start: number, end: number }[] = []
    const maxRange = 10000000
    //Divide range into sub ranges no bigger than maxRange
    for (let i = start; i <= end; i += maxRange) {
        const rangeEnd = Math.min(i + maxRange - 1, end)
        ranges.push({ start: i, end: rangeEnd })
    }
    //For each range, send query and populate dataArray
    const dataArray: MainQueryData[] = []

    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        try {
            const data = await fetchcCREData(
                assembly,
                chromosome,
                range.start,
                range.end,
                biosampleName ?? undefined,
                1000000,
                null,
                bedIntersect ? sessionStorage.getItem("bed intersect")?.split(' ') : undefined,
                true
            )
            dataArray.push(data)
            setBedLoadingPercent(dataArray.length / ranges.length * 100)
            //Wait one second before sending the next query to reduce load on service
            await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
            window.alert(
                "There was an error fetching cCRE data, please try again soon. If this error persists, please report it via our 'Contact Us' form on the About page and include this info:\n\n" +
                `Downloading:\n${assembly}\n${chromosome}\n${start}\n${end}\n${biosampleName ?? undefined}\n` +
                error
            );
            setBedLoadingPercent(null)
            return;
        }
    }


    //Check every second to see if the queries have resolved
    while (dataArray.length < ranges.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        // setBedLoadingPercent(dataArray.length / ranges.length * 100)
    }
    //Combine and deduplicate results, as a cCRE might be included in two searches
    let combinedResults: SCREENSearchResult[] = []
    dataArray.forEach((queryResult) => { queryResult.data.cCRESCREENSearch.forEach((cCRE) => { combinedResults.push(cCRE) }) })
    //If it is a near gene TSS search, make sure each cCRE is within one of the ranges
    if (TSSranges) {
        combinedResults = combinedResults.filter((cCRE) => TSSranges.find((TSSrange) => cCRE.start <= TSSrange.end && TSSrange.start <= (cCRE.start + cCRE.len)))
    }

    const deduplicatedResults: MainQueryData = {
        data: {
            cCRESCREENSearch: Array.from(new Set(combinedResults.map((x) => JSON.stringify(x))), (x) => JSON.parse(x)),
        },
    };

    //generate BED string
    const bedContents = convertToBED(deduplicatedResults, assays, conservation)

    const blob = new Blob([bedContents], { type: 'text/plain' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${assembly}-${chromosome}-${start}-${end}${biosampleName ? '-' + biosampleName : ''}.bed`; // File name for download
    document.body.appendChild(link);

    // Simulate a click on the link to initiate download
    link.click();

    // Clean up by removing the link and revoking the URL object
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBedLoadingPercent(null)
}