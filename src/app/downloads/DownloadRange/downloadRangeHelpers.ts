import { ApolloClient } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { Assembly, CcreClass } from "common/types/globalTypes";
import { CcreDownloadRow, fetchCcreDownloadData } from "app/downloads/DownloadRange/fetchCcreDownloadData";
import { trackDownload } from "../analytics";

export type Assays = { atac: boolean; ctcf: boolean; dnase: boolean; h3k27ac: boolean; h3k4me3: boolean };
export type Conservation = { primate: boolean; mammal: boolean; vertebrate: boolean };

/**
 *
 * @param input A user-entered string representing a genomic region; chr_:start-end or tab separated format supported
 * @returns an object containing chromosome, start, and end (strings)
 */
export function parseGenomicRegion(input: string): { chromosome: string; start: string; end: string } {
  let inputArr: string[];
  let chromosome: string;
  let coordinates: string[];
  let start: string;
  let end: string;
  //This is the tab character. If input contains tab character...
  if (input.includes("	")) {
    inputArr = input.split("	");
    chromosome = inputArr[0];
    start = inputArr[1].replace(new RegExp(",", "g"), "");
    end = inputArr[2].replace(new RegExp(",", "g"), "");
  }
  //Else assume it's the chr:start-end format
  else {
    inputArr = input.split(":");
    chromosome = inputArr[0];
    coordinates = inputArr[1].split("-");
    start = coordinates[0].replace(new RegExp(",", "g"), "");
    end = coordinates[1].replace(new RegExp(",", "g"), "");
  }

  return { chromosome, start, end };
}

/**
 * @param rows download-ready cCRE rows from {@link fetchCcreDownloadData}
 * @param assays which assay z-score columns to include (user selection)
 * @param conservation which conservation columns to include (user selection)
 * @returns BED file contents, sorted by start coordinate
 */
const convertToBED = (rows: CcreDownloadRow[], assays: Assays, conservation: Conservation): string => {
  //Create header comment for the file
  const header = [
    "# chr\tstart\tend\taccession\tclassification",
    `${assays.dnase ? "\tDNase_z-score" : ""}`,
    `${assays.atac ? "\tATAC_z-score" : ""}`,
    `${assays.ctcf ? "\tCTCF_z-score" : ""}`,
    `${assays.h3k27ac ? "\tH3K27ac_z-score" : ""}`,
    `${assays.h3k4me3 ? "\tH3K4me3_z-score" : ""}`,
    `${conservation.primate ? "\tprimate_conservation" : ""}`,
    `${conservation.mammal ? "\tmammal_conservation" : ""}`,
    `${conservation.vertebrate ? "\tvertebrate_conservation" : ""}`,
    "\tnearest_gene",
    "\tnearest_gene_distance",
    "\n",
  ].join("");

  const body = rows
    .slice()
    .sort((a, b) => a.start - b.start)
    .map((row) =>
      // Construct tab separated row, ends with newline
      [
        `${row.chromosome}`,
        `\t${row.start}`,
        `\t${row.end}`,
        `\t${row.accession}`,
        `\t${row.group}`,
        `${assays.dnase ? "\t" + row.dnase : ""}`,
        `${assays.atac ? "\t" + row.atac : ""}`,
        `${assays.ctcf ? "\t" + row.ctcf : ""}`,
        `${assays.h3k27ac ? "\t" + row.h3k27ac : ""}`,
        `${assays.h3k4me3 ? "\t" + row.h3k4me3 : ""}`,
        `${conservation.primate ? "\t" + row.primates : ""}`,
        `${conservation.mammal ? "\t" + row.mammals : ""}`,
        `${conservation.vertebrate ? "\t" + row.vertebrates : ""}`,
        `\t${row.nearestGene}`,
        `\t${row.nearestGeneDistance}`,
        "\n",
      ].join("")
    )
    .join("");

  return header + body;
};

export type DownloadBEDParams = {
  client: ApolloClient;
  assembly: Assembly;
  chromosome: string;
  start: number;
  end: number;
  biosampleName?: string;
  assays: Assays;
  conservation: Conservation;
  classes: CcreClass[];
  setBedLoadingPercent: Dispatch<SetStateAction<number>>;
};

export const downloadBED = async ({
  client,
  assembly,
  chromosome,
  start,
  end,
  biosampleName,
  assays,
  conservation,
  classes,
  setBedLoadingPercent,
}: DownloadBEDParams) => {
  setBedLoadingPercent(0);

  const ranges: { start: number; end: number }[] = [];
  const maxRange = 10000000;
  //Divide range into sub ranges no bigger than maxRange to keep each request small
  for (let i = start; i <= end; i += maxRange) {
    const rangeEnd = Math.min(i + maxRange - 1, end);
    ranges.push({ start: i, end: rangeEnd });
  }

  //For each range, fetch and accumulate rows
  const allRows: CcreDownloadRow[] = [];
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    try {
      const rows = await fetchCcreDownloadData(client, {
        assembly,
        coordinates: [{ chromosome, start: range.start, end: range.end }],
        biosample: biosampleName,
        classes,
      });
      allRows.push(...rows);
      setBedLoadingPercent(((i + 1) / ranges.length) * 100);
      //Wait one second before sending the next query to reduce load on service
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      window.alert(
        "There was an error fetching cCRE data, please try again soon. If this error persists, please report it via our 'Contact Us' form on the About page and include this info:\n\n" +
          `Downloading:\n${assembly}\n${chromosome}\n${start}\n${end}\n${biosampleName ?? "none"}\n` +
          error
      );
      setBedLoadingPercent(null);
      return;
    }
  }

  //A cCRE can appear in two adjacent chunks; dedupe by accession
  const deduplicatedRows = Array.from(new Map(allRows.map((row) => [row.accession, row])).values());

  //generate BED string
  const bedContents = convertToBED(deduplicatedRows, assays, conservation);

  const blob = new Blob([bedContents], { type: "text/plain" });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.href = url;
  const filename = `${assembly}-${chromosome}-${start}-${end}${biosampleName ? "-" + biosampleName : ""}.bed`;
  link.download = filename; // File name for download
  document.body.appendChild(link);

  // Track the download
  trackDownload(url, filename, "download-range", assembly);

  // Simulate a click on the link to initiate download
  link.click();

  // Clean up by removing the link and revoking the URL object
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  setBedLoadingPercent(null);
};
