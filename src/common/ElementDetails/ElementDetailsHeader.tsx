import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useElementMetadata } from "common/hooks/useElementMetadata";
import { formatPortal } from "common/utility";
import { GenomicElementType } from "types/globalTypes";
import Image from "next/image";
import Grid2 from "@mui/material/Grid2";
import { useGeneDescription } from "common/hooks/useGeneDescription";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";

export type ElementDetailsHeaderProps = {
  elementType: GenomicElementType;
  elementID: string;
};

const ElementDetailsHeader = ({ elementType, elementID }: ElementDetailsHeaderProps) => {
  const { data: elementMetadata, loading, error } = useElementMetadata({ elementType, elementID });

  const c = elementMetadata?.coordinates;
  const coordinatesDisplay = c && `${c.chromosome}:${c.start.toLocaleString()}-${c.end.toLocaleString()}`;

  const description = useGeneDescription(elementID, elementType).description;
  const SnpAlleleFrequencies = useSnpFrequencies([elementID], elementType);

  //All data used in the subtitle of the element header based on the element type
  const geneID = elementMetadata?.__typename === "Gene" ? elementMetadata?.id : "";
  const icreClass = elementMetadata?.__typename === "ICRE" ? elementMetadata?.group : "";
  const ref =
    elementMetadata?.__typename === "SNP" && SnpAlleleFrequencies.data ? SnpAlleleFrequencies.data[elementID]?.ref : "";
  const alt =
    elementMetadata?.__typename === "SNP" && SnpAlleleFrequencies.data ? SnpAlleleFrequencies.data[elementID]?.alt : "";

  //map descriptions to the class
  const icreClassDescriptions: Record<string, string> = {
    PLS: "(Promoter-like Signature)",
    pELS: "(Proximal Enhancer)",
    dELS: "(Distal Enhancer)",
    "CA-H3K4me3": "(Chromatin Accessibility + H3K4me3)",
    "CA-CTCF": "(Chromatin Accessibility + CTCF)",
    "CA-TF": "(Chromatin Accessibility + Transcription Factor)",
    CA: "(Chromatin Accessibility)",
    TF: "(Transcription Factor)",
  };

  const subtitle =
    elementType === "gene" ? (
      geneID
    ) : elementType === "icre" ? (
      <>
        {icreClass} {icreClassDescriptions[icreClass] ?? ""}
      </>
    ) : elementType === "variant" ? (
      !ref ? (
          <Skeleton width={215} />
      ) : (
        <>
          <strong>Reference Allele:</strong> {ref} <strong>Alternate Allele:</strong> {alt}
        </>
      )
    ) : (
      ""
    );

  return (
    <Grid2
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      container
    >
      <Grid2 size={{ xs: 12, sm: 9 }}>
        <Stack>
          <Typography variant="subtitle1">{formatPortal(elementType)} Details</Typography>
          <Typography variant="h4">
            {elementType === "gene" ? <i>{elementID}</i> : elementID}
            {/* Loading skeleton for gene description */}
            {loading && elementType === "gene" ? (
              <Skeleton width={215} sx={{ display: "inline-block", ml: 2 }} />
            ) : elementType === "gene" && description !== null ? (
              ` (${description})`
            ) : (
              ""
            )}
          </Typography>
          <Typography>{loading ? <Skeleton width={215} /> : subtitle}</Typography>
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 3 }}>
        <Grid2 container direction="column" spacing={1} sx={{ height: "100%" }} textAlign={"right"}>
          <Grid2 container spacing={1} sx={{ flexGrow: 1 }} order={{ xs: 2, sm: 1 }} justifyContent={"flex-end"}>
            <Grid2
              size={{ xs: elementType === "icre" ? 12 : 6 }}
              sx={{ display: "flex" }}
              height={{ xs: 65, sm: "auto" }}
            >
              <Button
                variant="contained"
                href={elementID ? `http://screen.wenglab.org/search/?q=${elementID}&uuid=0&assembly=GRCh38` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ width: "100%", height: "100%", backgroundColor: "white" }}
              >
                <Image
                  style={{ objectFit: "contain", padding: 4 }}
                  src="/SCREEN-on-light@16x.png"
                  fill
                  alt="screen-card-button"
                />
              </Button>
            </Grid2>
            <Grid2 size={6} display={elementType === "icre" ? "none" : "flex"} height={{ xs: 65, sm: "auto" }}>
              <Button
                variant="contained"
                href={
                  elementID
                    ? elementType === "gene"
                      ? "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + elementID
                      : `https://www.ncbi.nlm.nih.gov/snp/${elementID}`
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                sx={{ width: "100%", height: "100%", backgroundColor: "white" }}
              >
                <Image
                  style={{ objectFit: "contain" }}
                  src={
                    elementType === "gene"
                      ? "https://geneanalytics.genecards.org/media/81632/gc.png"
                      : "https://www.ncbi.nlm.nih.gov/core/assets/style-guide/img/NLM-square-logo.png"
                  }
                  fill
                  alt="genecard-snpcard-button"
                />
              </Button>
            </Grid2>
          </Grid2>
          <Grid2 display={"flex"} justifyContent={{ xs: "flex-starrt", sm: "flex-end" }} order={{ xs: 1, sm: 2 }}>
            <Typography>{loading ? <Skeleton width={215} /> : coordinatesDisplay}</Typography>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default ElementDetailsHeader;
