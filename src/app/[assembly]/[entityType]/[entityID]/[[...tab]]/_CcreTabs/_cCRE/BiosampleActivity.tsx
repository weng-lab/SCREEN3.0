"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import Grid from "@mui/material/Grid";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import ClassProportionsBar from "./ClassProportionsBar";
import { Box, CircularProgress, LinearProgress, Stack, Typography } from "@mui/material";
import { gql } from "types/generated";
import { GridColDef, GridRenderCellParams, Table } from "@weng-lab/ui-components";
import { CcreClass, GenomicRange } from "types/globalTypes";
import { GROUP_COLOR_MAP } from "common/lib/colors";
import { AnyOpenEntity } from "common/EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";
import { useCcreData } from "common/hooks/useCcreData";
import { calcDistCcreToTSS, ccreOverlapsTSS } from "common/utility";

export type cCRERow = {
  ct?: string;
  celltypename: string;
  dnase: number;
  h3k4me3: number;
  h3k27ac: number;
  ctcf: number;
  atac: number;
  class: CcreClass;
  tf?: string;
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
    headerName: "Cell Type",
    field: "celltypename",
  },
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
    field: "celltypename",
    maxWidth: 400
  },
  {
    headerName: "Ontology",
    field: "ontology",
  },
  {
    headerName: "Sample Type",
    field: "sampleType",
  },
  {
    headerName: "DNase Z-score",
    field: "dnase",
    ...zScoreFormatting,
  },
  {
    headerName: "ATAC Z-score",
    field: "atac",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K4me3 Z-score",
    field: "h3k4me3",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K27ac Z-score",
    field: "h3k27ac",
    ...zScoreFormatting,
  },
  {
    headerName: "CTCF Z-score",
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
];

const ancillaryCols = coreAndPartialCols.filter((col) => col.field !== "dnase" && col.field !== "group");

export const GET_CCRE_CT_TF = gql(`
  query cCRETF($accession: String!, $assembly: String!) {
    getcCRETFQuery(accession: $accession, assembly: $assembly) {
      celltype
      tf
    }
  }
`);

export const TOP_TISSUES = gql(`
  query topTissues($accession: [String!], $assembly: String!) {
    ccREBiosampleQuery(assembly: $assembly) {
      biosamples {
        id: name  # Add a unique identifier for each biosample
        sampleType
        displayname
        cCREZScores(accession: $accession) @nonreactive {  # Mark this field as non-reactive to prevent unnecessary re-renders
          score
          assay
          experiment_accession
        }
        name
        ontology
      }
    }
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

//Cache is not working as expected when switching between open cCREs
export const BiosampleActivity = ({ entity }: { entity: AnyOpenEntity }) => {
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
   */
  const {
    data: data_toptissues,
    loading: loading_toptissues,
    error: error_toptissues,
  } = useQuery(TOP_TISSUES, {
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
      distanceToTSS: calcDistCcreToTSS(coordinates, gene.transcripts, gene.strand as "+" | "-"),
      overlapsTSS: ccreOverlapsTSS(coordinates, gene.transcripts, gene.strand as "+" | "-")
    };
  });

  const distanceToTSS = nearbyGenes?.sort((a, b) => a.distanceToTSS - b.distanceToTSS)[0].distanceToTSS
  
  const overlapsTSS = nearbyGenes?.map(x => x.overlapsTSS).includes(true)

  let partialDataCollection: cCRERow[], coreCollection: cCRERow[], ancillaryCollection: cCRERow[];
  if (data_toptissues) {
    const r = data_toptissues.ccREBiosampleQuery.biosamples;
    const ctcfdata = r.map((rs) => {
      return rs.cCREZScores
        .filter((d) => d.assay.toLowerCase() === "ctcf")
        .map((c) => {
          return {
            score: c.score,
            ct: rs.name,
            tissue: rs.ontology,
            celltypename: rs.displayname,
          };
        });
    });

    const d = ctcfdata.filter((s) => s.length > 0).flat();

    const c = {};
    d.forEach((g) => {
      c[g.ct] = { ctcf: g.score, tissue: g.tissue };
    });

    const dnasedata = r.map((rs) => {
      return rs.cCREZScores
        .filter((d) => d.assay.toLowerCase() === "dnase")
        .map((c) => {
          return {
            score: c.score,
            ct: rs.name,
            tissue: rs.ontology,
            celltypename: rs.displayname,
          };
        });
    });

    const dnase = dnasedata.filter((s) => s.length > 0).flat();

    const dn = {};
    dnase.forEach((g) => {
      dn[g.ct] = { dnase: g.score, tissue: g.tissue };
    });

    const h3k4me3data = r.map((rs) => {
      return rs.cCREZScores
        .filter((d) => d.assay.toLowerCase() === "h3k4me3")
        .map((c) => {
          return {
            score: c.score,
            ct: rs.name,
            tissue: rs.ontology,
            celltypename: rs.displayname,
          };
        });
    });

    const h3k4me3 = h3k4me3data.filter((s) => s.length > 0).flat();

    const h3 = {};
    h3k4me3.forEach((g) => {
      h3[g.ct] = { h3k4me3: g.score, tissue: g.tissue };
    });

    const h3k27acdata = r.map((rs) => {
      return rs.cCREZScores
        .filter((d) => d.assay.toLowerCase() === "h3k27ac")
        .map((c) => {
          return {
            score: c.score,
            ct: rs.name,
            tissue: rs.ontology,
            celltypename: rs.displayname,
          };
        });
    });

    const h3k27ac = h3k27acdata.filter((s) => s.length > 0).flat();

    const h3k = {};
    h3k27ac.forEach((g) => {
      h3k[g.ct] = { h3k27ac: g.score, tissue: g.tissue };
    });

    const typedata = r.map((d) => {
      return {
        ct: d.name,
        ontology: d.ontology,
        sampleType: d.sampleType,
        tf:
          data_ccre_tf && data_ccre_tf.getcCRETFQuery.length > 0
            ? data_ccre_tf.getcCRETFQuery.find((a) => d.name === a.celltype)?.tf.toString()
            : undefined,
        celltypename: d.displayname,
        tissue: d.ontology,
        dnase: d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "dnase")
          ? d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "dnase").score
          : -11.0,
        ctcf: d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "ctcf")
          ? d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "ctcf").score
          : -11.0,
        h3k4me3: d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "h3k4me3")
          ? d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "h3k4me3").score
          : -11.0,
        h3k27ac: d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "h3k27ac")
          ? d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "h3k27ac").score
          : -11.0,
        atac: d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "atac")
          ? d.cCREZScores.find((cz) => cz.assay.toLowerCase() === "atac").score
          : -11.0,
      };
    });

    const ccreCts = typedata.map((t) => {
      let ccreClass: CcreClass;
      const tf =
        data_ccre_tf && data_ccre_tf.getcCRETFQuery.length > 0
          ? data_ccre_tf.getcCRETFQuery.find((a) => t.ct === a.celltype)?.tf.toString()
          : undefined;

      if (t.dnase != -11.0) {
        if (t.dnase >= 1.64) {
          if (t.h3k4me3 >= 1.64) {
            if (distanceToTSS <= 200 || overlapsTSS) {
              ccreClass = "PLS"; //Promoter-like signatures (promoter) must fall within 200 bp of a TSS and have high chromatin accessibility and H3K4me3 signals.
            } else if (t.h3k27ac < 1.64 && distanceToTSS > 200) {
              ccreClass = "CA-H3K4me3"; //Chromatin accessibility + H3K4me3 (CA-H3K4me3) have high chromatin accessibility and H3K4me3 signals but low H3K27ac signals and do not fall within 200 bp of a TSS.
            } else if (distanceToTSS <= 2000 && t.h3k27ac >= 1.64) {
              ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
            } else if (distanceToTSS > 2000 && t.h3k27ac >= 1.64) {
              ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
            }
          } else if (t.h3k27ac >= 1.64) {
            if (distanceToTSS <= 2000) {
              ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
            } else if (distanceToTSS > 2000) {
              ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
            }
          } else if (t.ctcf >= 1.64) {
            ccreClass = "CA-CTCF"; //Chromatin accessibility + CTCF (CA-CTCF) have high chromatin accessibility and CTCF signals but low H3K4me3 and H3K27ac signals.
          } else if (tf === "1") {
            ccreClass = "CA-TF"; //Chromatin accessibility + transcription factor (CA-TF) have high chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
          } else {
            ccreClass = "CA"; //Chromatin accessibility (CA) have high chromatin accessibility, and low H3K4me3, H3K27ac, and CTCF signals.
          }
        } else {
          if (tf === "1") {
            ccreClass = "TF"; //Transcription factor (TF) have low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
          } else {
            ccreClass = "InActive"; //low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are NOT bound by a transcription factor.
          }
        }
      } else {
        ccreClass = "noclass"; //If not active in DNase, No class assigned
      }

      let type: "core" | "partial" | "ancillary";

      type = "ancillary";
      if (t.dnase !== -11.0) {
        type = "partial";
        if (t.ctcf !== -11.0 && t.h3k27ac !== -11.0 && t.h3k4me3 !== -11.0) {
          type = "core";
        }
      }
      return { ...t, type, class: ccreClass };
    });

    coreCollection = ccreCts.filter((c) => c.type === "core");
    partialDataCollection = ccreCts.filter((c) => c.type === "partial");
    ancillaryCollection = ccreCts.filter((c) => c.type === "ancillary");
  }

  const loadingCorePartialAncillary =
    distanceToTSS === undefined || overlapsTSS === undefined || !coreCollection || !partialDataCollection || !ancillaryCollection;
  const errorCorePartialAncillary = !!(errorCcreData || error_toptissues || error_ccre_tf || errorNearbyGenes);

  const ctAgnosticRow = data_toptissues
    ? [{ ...data_toptissues.cCREQuery[0], celltypename: "Cell Type Agnostic" }]
    : undefined;

  const disableCsvEscapeChar = { slotProps: { toolbar: { csvOptions: { escapeFormulas: false } } } };

  console.log(nearbyGenes?.sort((a, b) => a.distanceToTSS - b.distanceToTSS))
  console.log("Distance to TSS: " + String(distanceToTSS))
  console.log("Overlaps TSS: " + overlapsTSS)

  return (
    <ParentSize>
      {({ width }) => (
        <Stack spacing={3} sx={{ mt: "0rem", mb: "0rem" }}>
          <Table
            label="Cell type agnostic classification"
            rows={ctAgnosticRow}
            columns={ctAgnosticCols}
            loading={loading_toptissues}
            //temp fix to get visual loading state without specifying height once loaded. See https://github.com/weng-lab/web-components/issues/22
            divHeight={!ctAgnosticRow ? { height: "182px" } : undefined}
            error={!!error_toptissues}
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
  );
};
