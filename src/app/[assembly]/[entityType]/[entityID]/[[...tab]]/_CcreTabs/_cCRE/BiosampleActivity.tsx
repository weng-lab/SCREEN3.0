"use client";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import ClassProportionsBar from "./ClassProportionsBar";
import { Box, LinearProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
import { gql } from "types/generated";
import { GridColDef, GridRenderCellParams, Table } from "@weng-lab/ui-components";
import { CcreClass, GenomicRange } from "types/globalTypes";
import { GROUP_COLOR_MAP } from "common/lib/colors";
import { AnyOpenEntity } from "common/EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";
import { useCcreData } from "common/hooks/useCcreData";
import { calcDistCcreToTSS, capitalizeFirstLetter, ccreOverlapsTSS } from "common/utility";
import AssayView from "./AssayView";
import { AssayWheel } from "common/components/AssayWheel";

export type BiosampleRow = {
  name?: string;
  displayname: string;
  sampleType?: string;
  lifeStage?: string;
  ontology?: string;
  class?: CcreClass;
  collection: "core" | "partial" | "ancillary"
  dnase?: number;
  dnaseAccession?: string
  atac?: number;
  atacAccession?: string
  h3k4me3?: number;
  h3k4me3Accession?: string;
  h3k27ac?: number;
  h3k27acAccession?: string;
  ctcf?: number;
  ctcfAccession?: string;
  tf?: string;
};

const classifyCcre = (
  scores: { dnase: number; atac: number; h3k4me3: number; h3k27ac: number; ctcf: number; tf: string },
  distanceToTSS: number,
  overlapsTSS: boolean
) => {
  let ccreClass: CcreClass;
  if (scores.dnase != -11.0) {
    if (scores.dnase > 1.64) {
      if (scores.h3k4me3 > 1.64) {
        if (distanceToTSS <= 200 || overlapsTSS) {
          ccreClass = "PLS"; //Promoter-like signatures (promoter) must fall within 200 bp of a TSS and have high chromatin accessibility and H3K4me3 signals.
        } else if (scores.h3k27ac <= 1.64 && distanceToTSS > 200) {
          ccreClass = "CA-H3K4me3"; //Chromatin accessibility + H3K4me3 (CA-H3K4me3) have high chromatin accessibility and H3K4me3 signals but low H3K27ac signals and do not fall within 200 bp of a TSS.
        } else if (distanceToTSS <= 2000 && scores.h3k27ac > 1.64) {
          ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        } else if (distanceToTSS > 2000 && scores.h3k27ac > 1.64) {
          ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        }
      } else if (scores.h3k27ac > 1.64) {
        if (distanceToTSS <= 2000) {
          ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        } else if (distanceToTSS > 2000) {
          ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        }
      } else if (scores.ctcf > 1.64) {
        ccreClass = "CA-CTCF"; //Chromatin accessibility + CTCF (CA-CTCF) have high chromatin accessibility and CTCF signals but low H3K4me3 and H3K27ac signals.
      } else if (scores.tf === "1") {
        ccreClass = "CA-TF"; //Chromatin accessibility + transcription factor (CA-TF) have high chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
      } else {
        ccreClass = "CA"; //Chromatin accessibility (CA) have high chromatin accessibility, and low H3K4me3, H3K27ac, and CTCF signals.
      }
    } else {
      if (scores.tf === "1") {
        ccreClass = "TF"; //Transcription factor (TF) have low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
      } else {
        ccreClass = "InActive"; //low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are NOT bound by a transcription factor.
      }
    }
  } else {
    ccreClass = "noclass"; //If not active in DNase, No class assigned
  }
  return ccreClass;
};

/**
 * used for internal setting of the z-score to "NA" or .toFixed(2) for file download
 */
const z_score_download_format = (d: number) => (d === -11.0 ? "NA" : d.toFixed(2));
/**
 * used for rendering the value in the table cell as "--" instead of "NA"
 */
const z_score_display_format = (d: string): string => (d === "NA" ? "--" : d);

const zScoreFormatting: Partial<GridColDef> = {
  valueGetter: z_score_download_format,
  renderCell: (params: GridRenderCellParams) => {
    return z_score_display_format(params.value);
  },
  sortComparator: (v1, v2) => (v1 === "NA" ? -1 : v2 === "NA" ? 1 : v1 - v2),
  type: "number"
};

const classificationFormatting: Partial<GridColDef> = {
  renderCell: (params: GridRenderCellParams) => {
    const group = params.value;
    // console.log(params)
    const colormap = GROUP_COLOR_MAP.get(group);
    const color = colormap ? (group === "InActive" ? "gray" : colormap.split(":")[1]) : "#06da93";
    const classification = colormap ? colormap.split(":")[0] : "DNase only";
    return (
      <span style={{ color }}>
        <strong>{classification}</strong>
      </span>
    );
  },
};

const ctAgnosticCols: GridColDef[] = [  
  {
    headerName: "DNase max-Z",
    field: "dnase",
    ...zScoreFormatting,
  },
  {
    headerName: "ATAC max-Z",
    field: "atac",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K4me3 max-Z",
    field: "h3k4me3",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K27ac max-Z",
    field: "h3k27ac",
    ...zScoreFormatting,
  },
  {
    headerName: "CTCF max-Z",
    field: "ctcf",
    ...zScoreFormatting,
  },
  {
    headerName: "Classification",
    field: "group",
    ...classificationFormatting,
  },
];

const coreAndPartialCols: GridColDef[] = [
  {
    headerName: "Cell Type",
    field: "displayname",
    maxWidth: 400,
    valueFormatter: capitalizeFirstLetter
  },
  {
    headerName: "Organ/Tissue",
    field: "ontology",
    valueFormatter: capitalizeFirstLetter
  },
  {
    headerName: "Sample Type",
    field: "sampleType",
    valueFormatter: capitalizeFirstLetter
  },
  {
    headerName: "Life Stage",
    field: "lifeStage"
  },
  {
    headerName: "DNase",
    field: "dnase",
    ...zScoreFormatting,
  },
  {
    headerName: "ATAC",
    field: "atac",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K4me3",
    field: "h3k4me3",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K27ac",
    field: "h3k27ac",
    ...zScoreFormatting,
  },
  {
    headerName: "CTCF",
    field: "ctcf",
    ...zScoreFormatting,
  },
  {
    headerName: "TF",
    field: "tf",
    //Need to transform the internal value
    valueGetter: (value) => (value === undefined ? "--" : value === "1" ? "Yes" : "No"),
  },
  {
    headerName: "Classification",
    field: "class",
    ...classificationFormatting,
  },
  {
    headerName: "Assays",
    field: " ",
    type: "number",
    valueGetter: (_, row) => Object.values(assayInfo(row)).filter(x => x).length,
    renderCell: (params) => <AssayWheel row={assayInfo((params.row as BiosampleRow))} />
  }
];

const assayInfo = (row: BiosampleRow) => {
  return {
    dnase: row.dnaseAccession,
    atac: row.atacAccession,
    h3k4me3: row.h3k4me3Accession,
    h3k27ac: row.h3k27acAccession,
    ctcf: row.ctcfAccession,
  };
}

const ancillaryCols = coreAndPartialCols.filter((col) => col.field !== "dnase" && col.field !== "group");

export const GET_CCRE_CT_TF = gql(`
  query cCRETF($accession: String!, $assembly: String!) {
    getcCRETFQuery(accession: $accession, assembly: $assembly) {
      celltype
      tf
    }
  }
`);

export const BIOSAMPLE_Zs = gql(`
  query biosampleZScores($accession: [String!], $assembly: String!) {
    ccREBiosampleQuery(assembly: $assembly) {
      biosamples {
        id: name  # Add a unique identifier for each biosample
        sampleType
        displayname
        lifeStage
        cCREZScores(accession: $accession) @nonreactive {  # Mark this field as non-reactive to prevent unnecessary re-renders
          score
          assay
          experiment_accession
        }
        name
        ontology
      }
    }
  }
`);

export const CT_AGNOSTIC = gql(`
  query CtAgnostic($accession: [String!], $assembly: String!) {
    cCREQuery(assembly: $assembly, accession: $accession) {
      id: accession  # Add a unique identifier for the cCRE
      accession
      group
      dnase: maxZ(assay: "DNase")
      h3k4me3: maxZ(assay: "H3K4me3")
      h3k27ac: maxZ(assay: "H3K27ac")
      ctcf: maxZ(assay: "CTCF")
      atac: maxZ(assay: "ATAC")
    }
  }
`);

export const NEARBY_GENES = gql(`
  query nearbyGenes(
    $assembly: String!
    $geneSearchStart: Int!
    $geneSearchEnd: Int!
    $geneSearchChrom: String!
    $geneVersion: Int!
  ) {
    nearbyGenes: gene(
      chromosome: $geneSearchChrom
      start: $geneSearchStart
      end: $geneSearchEnd
      assembly: $assembly
      version: $geneVersion
    ) {
      name
      id
      gene_type
      strand
      coordinates {
        chromosome
        start
        end
      }
      transcripts {
        id
        coordinates {
          chromosome
          start
          end
        }
      }
    }
  }
`);

export type Assay = "dnase" | "atac" | "h3k4me3" | "h3k27ac" | "ctcf"

export const formatAssay = (assay: Assay) => {
  switch(assay){
    case "atac": return "ATAC";
    case "ctcf": return "CTCF";
    case "dnase": return "DNase";
    case "h3k27ac": return "H3K27ac";
    case "h3k4me3": return "H3K4me3";
  }
}

//Cache is not working as expected when switching between open cCREs
export const BiosampleActivity = ({ entity }: { entity: AnyOpenEntity }) => {
  // Assay values are used to index into row object, so need to modify assaySpecificRows if changing assays here
  const [tab, setTab] = useState<"tables" | Assay>("tables");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as "tables" | "dnase" | "atac" | "h3k4me3" | "h3k27ac" | "ctcf");
  };

  const {
    data: cCREdata,
    loading: loadingCcreData,
    error: errorCcreData,
  } = useCcreData({ accession: entity.entityID, assembly: entity.assembly });

  const coordinates: GenomicRange = {
    chromosome: cCREdata?.chrom,
    start: cCREdata?.start,
    end: cCREdata?.start + cCREdata?.len,
  };

  /**
   * Fetch biosample specific assay scores as well as max-Z for celltype agnostic classification
   * So, right here I can fetch the biosample's umap coordinates. Feels wrong to fetch here since it's not needed and slows down everything
   * BUT, would eliminate a separate fetch. These rows would contain the coordinates for the selected assay, which is then passed down.
   */
  const {
    data: data_Ct_Agnostic,
    loading: loading_Ct_Agnostic,
    error: error_Ct_Agnostic,
  } = useQuery(CT_AGNOSTIC, {
    variables: {
      assembly: entity.assembly.toLowerCase(),
      accession: entity.entityID,
    },
  });

    const {
    data: data_biosampleZs,
    loading: loading_biosampleZs,
    error: error_biosampleZs,
  } = useQuery(BIOSAMPLE_Zs, {
    variables: {
      assembly: entity.assembly.toLowerCase(),
      accession: entity.entityID,
    },
  });

  /**
   * Fetch mapping between biosample and if cCRE is TF in that sample, displayed in table and used for classification
   */
  const {
    data: data_ccre_tf,
    loading: loading_ccre_tf,
    error: error_ccre_tf,
  } = useQuery(GET_CCRE_CT_TF, {
    variables: {
      assembly: entity.assembly.toLowerCase() === "mm10" ? "mm10" : "GRCh38",
      accession: entity.entityID,
    },
  });

  /**
   * fetch genes within 2M bp region to find distance to nearest TSS, used for classification.
   */
  const {
    loading: loadingNearbyGenes,
    data: dataNearbyGenes,
    error: errorNearbyGenes,
  } = useQuery(NEARBY_GENES, {
    variables: {
      assembly: entity.assembly.toLowerCase(),
      geneSearchChrom: coordinates.chromosome,
      geneSearchStart: coordinates.start - 1000000,
      geneSearchEnd: coordinates.end + 1000000,
      geneVersion: entity.assembly === "GRCh38" ? 40 : 25,
    },
    skip: !cCREdata,
  });

  const nearbyGenes = dataNearbyGenes?.nearbyGenes.map((gene) => {
    return {
      ...gene,
      distanceToTSS: calcDistCcreToTSS(coordinates, gene.transcripts, gene.strand as "+" | "-", "middle").distance,
      overlapsTSS: ccreOverlapsTSS(coordinates, gene.transcripts, gene.strand as "+" | "-")
    };
  });

  const distanceToTSS = nearbyGenes?.sort((a, b) => a.distanceToTSS - b.distanceToTSS)[0].distanceToTSS;

  const overlapsTSS = nearbyGenes?.some((x) => x.overlapsTSS);

  //need to extract the experiment from this
  const biosampleRows: BiosampleRow[] = useMemo(() => {
    if (!data_biosampleZs || !data_ccre_tf) return null;
    return data_biosampleZs?.ccREBiosampleQuery.biosamples.map((sample) => {

      const dnase = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "dnase")?.score || -11
      const dnaseAccession = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "dnase")?.experiment_accession
      const atac = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "atac")?.score || -11
      const atacAccession = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "atac")?.experiment_accession

      const h3k4me3 = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "h3k4me3")?.score || -11
      const h3k4me3Accession = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "h3k4me3")?.experiment_accession

      const h3k27ac = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "h3k27ac")?.score || -11
      const h3k27acAccession = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "h3k27ac")?.experiment_accession
      const ctcf = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "ctcf")?.score || -11
      const ctcfAccession = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "ctcf")?.experiment_accession
      const tf = data_ccre_tf.getcCRETFQuery.find((x) => sample.name === x.celltype)?.tf.toString()

      const scores = {dnase, dnaseAccession, atac, atacAccession, h3k4me3, h3k4me3Accession, h3k27ac, h3k27acAccession, ctcf, ctcfAccession, tf}

      const classification = classifyCcre(scores, distanceToTSS, overlapsTSS)

      const collection: "core" | "partial" | "ancillary" =
        dnase === -11.0 ? "ancillary" : ctcf !== -11.0 && h3k27ac !== -11.0 && h3k4me3 !== -11.0 ? "core" : "partial";

      return {
        name: sample.name,
        ontology: sample.ontology,
        sampleType: sample.sampleType,
        displayname: sample.displayname,
        lifeStage: sample.lifeStage,
        class: classification,
        collection,
        ...scores
      };
    });
  }, [data_ccre_tf, data_biosampleZs, distanceToTSS, overlapsTSS]);

  const coreCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "core");
  }, [biosampleRows]) 

  const partialDataCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "partial");
  }, [biosampleRows]) 

  const ancillaryCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "ancillary")
  }, [biosampleRows])

  const assaySpecificRows: BiosampleRow[] = useMemo(() => {
    if (tab === "tables") return undefined
    return biosampleRows?.filter((row) => row[tab] !== -11)
  }, [biosampleRows, tab])

  const loadingCorePartialAncillary =
    distanceToTSS === undefined ||
    overlapsTSS === undefined ||
    !coreCollection ||
    !partialDataCollection ||
    !ancillaryCollection;
  const errorCorePartialAncillary = !!(errorCcreData || error_biosampleZs || error_ccre_tf || errorNearbyGenes);

  const ctAgnosticRow = data_Ct_Agnostic
    ? [{ ...data_Ct_Agnostic.cCREQuery[0], displayname: "Cell Type Agnostic" }]
    : undefined;

  const disableCsvEscapeChar = { slotProps: { toolbar: { csvOptions: { escapeFormulas: false } } } };

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        value={tab}
        onChange={handleChange}
        sx={{
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            opacity: 0.3,
          },
          // borderBottom: 1,
          // borderColor: "divider"
        }}
      >
        <Tab value="tables" label="Classification" />
        <Tab value="dnase" label="DNase" />
        <Tab value="atac" label="ATAC" />
        <Tab value="h3k4me3" label="H3K4me3" />
        <Tab value="h3k27ac" label="H3K27ac" />
        <Tab value="ctcf" label="CTCF" />
      </Tabs>
      {tab === "tables" ? (
        <ParentSize>
          {({ width }) => (
            <Stack spacing={3} sx={{ mt: "0rem", mb: "0rem" }}>
              <Table
                label="Cell type agnostic classification"
                rows={ctAgnosticRow}
                columns={ctAgnosticCols}
                loading={loading_Ct_Agnostic}
                //temp fix to get visual loading state without specifying height once loaded. See https://github.com/weng-lab/web-components/issues/22
                divHeight={!ctAgnosticRow ? { height: "182px" } : undefined}
                error={!!error_Ct_Agnostic}
                {...disableCsvEscapeChar}
              />
              <Stack>
                <Typography variant="caption">Classification Proportions, Core Collection:</Typography>
                <Box sx={{ marginBottom: "12px" }}>
                  {loadingCorePartialAncillary || errorCorePartialAncillary ? (
                    <LinearProgress />
                  ) : (
                    <ClassProportionsBar
                      rows={coreCollection}
                      height={4}
                      width={width}
                      orientation="horizontal"
                      tooltipTitle="Classification Proportions, Core Collection"
                    />
                  )}
                </Box>
                <Table
                  label="Core Collection"
                  rows={coreCollection}
                  columns={coreAndPartialCols}
                  loading={loadingCorePartialAncillary}
                  error={errorCorePartialAncillary}
                  divHeight={{ height: "400px" }}
                  initialState={{ sorting: { sortModel: [{ field: "dnase", sort: "desc" }] } }}
                  {...disableCsvEscapeChar}
                />
              </Stack>
              <Stack>
                <Typography variant="caption">Chromatin Accessibility, Partial Data Collection:</Typography>
                <Box sx={{ marginBottom: "12px" }}>
                  {loadingCorePartialAncillary || errorCorePartialAncillary ? (
                    <LinearProgress />
                  ) : (
                    <ClassProportionsBar
                      rows={partialDataCollection}
                      orientation="horizontal"
                      height={4}
                      width={width}
                      tooltipTitle="Chromatin Accessibility, Partial Data Collection"
                      onlyUseChromatinAccessibility
                    />
                  )}
                </Box>
                <Table
                  label="Partial Data Collection"
                  rows={partialDataCollection}
                  columns={coreAndPartialCols}
                  loading={loadingCorePartialAncillary}
                  error={errorCorePartialAncillary}
                  divHeight={{ height: "400px" }}
                  initialState={{ sorting: { sortModel: [{ field: "dnase", sort: "desc" }] } }}
                  {...disableCsvEscapeChar}
                />
              </Stack>
              <Table
                label="Ancillary Collection"
                rows={ancillaryCollection}
                columns={ancillaryCols}
                loading={loadingCorePartialAncillary}
                error={errorCorePartialAncillary}
                divHeight={{ height: "400px" }}
                initialState={{ sorting: { sortModel: [{ field: "atac", sort: "desc" }] } }}
                {...disableCsvEscapeChar}
              />
            </Stack>
          )}
        </ParentSize>
      ) : (
        <AssayView rows={assaySpecificRows} columns={coreAndPartialCols} assay={tab} entity={entity} />
      )}
    </>
  );
};
