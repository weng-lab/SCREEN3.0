"use client";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { gql } from "common/types/generated";
import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRenderCellParams, Table } from "@weng-lab/ui-components";
import type { CcreAssay, CcreClass, GenomicRange } from "common/types/globalTypes";
import { CLASS_COLORS } from "common/colors";
import type { EntityViewComponentProps } from "common/entityTabsConfig";
import { useCcreData } from "common/hooks/useCcreData";
import { calcDistCcreToTSS, capitalizeFirstLetter, ccreOverlapsTSS } from "common/utility";
import AssayView from "./AssayView";
import { AssayWheel } from "@weng-lab/ui-components";
import { ProportionsBar, getProportionsFromArray } from "@weng-lab/visualization";
import { CCRE_CLASSES, CLASS_DESCRIPTIONS } from "common/consts";
import { BiosampleRow } from "./types";
import { useSilencersData } from "common/hooks/useSilencersData";
import { Silencer_Studies } from "./consts";
import { LinkComponent } from "common/components/LinkComponent";

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
  type: "number",
};

//This should be given singleSelect
const classificationFormatting: Partial<GridColDef> = {
  type: "singleSelect",
  valueOptions: CCRE_CLASSES.map((group) => ({ value: group, label: CLASS_DESCRIPTIONS[group] })),
  renderCell: (params: GridRenderCellParams) => {
    const group = params.value;
    const color = CLASS_COLORS[group];
    const classification = CLASS_DESCRIPTIONS[group];
    return (
      <span style={{ color }}>
        <strong>{classification}</strong>
      </span>
    );
  },
  valueFormatter: (v) => CLASS_DESCRIPTIONS[v] ?? "Unknown",
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

const silencersDataCols: GridColDef[] = [
  {
    headerName: "Study",
    field: "study",
    valueGetter: (value, row) => row.study,
  },
  {
    headerName: "PMID",
    field: "pmid",
    valueGetter: (value, row) => row.pmid,
    renderCell: (params) => (
      <LinkComponent href={params.row.pubmed_link} showExternalIcon openInNewTab>
        {params.row.pmid}
      </LinkComponent>
    ),
  },
  {
    headerName: "Method",
    field: "method",
    valueGetter: (value, row) => row.method,
  },
];
//This is used to prevent sorting from happening when clicking on the header checkbox
const StopPropagationWrapper = (params) => (
  <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
    <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
  </div>
);

const getCoreAndPartialCols = (): GridColDef[] => [
  {
    ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
    sortable: true,
    hideable: false,
    renderHeader: StopPropagationWrapper,
  },
  {
    headerName: "Cell Type",
    field: "displayname",
    maxWidth: 400,
    valueFormatter: capitalizeFirstLetter,
  },
  {
    headerName: "Organ/Tissue",
    field: "ontology",
    valueFormatter: capitalizeFirstLetter,
  },
  {
    headerName: "Sample Type",
    field: "sampleType",
    valueFormatter: capitalizeFirstLetter,
  },
  {
    headerName: "Life Stage",
    field: "lifeStage",
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
    valueGetter: (_, row) => Object.values(assayInfo(row)).filter((x) => x).length,
    renderCell: (params) => <AssayWheel row={assayInfo(params.row as BiosampleRow)} />,
  },
];

const assayInfo = (row: BiosampleRow) => {
  return {
    dnase: row.dnaseAccession,
    atac: row.atacAccession,
    h3k4me3: row.h3k4me3Accession,
    h3k27ac: row.h3k27acAccession,
    ctcf: row.ctcfAccession,
  };
};

const getAncillaryCols = () => getCoreAndPartialCols().filter((col) => col.field !== "dnase" && col.field !== "class");

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

const CORE_COLLECTION_TOOLTIP =
  "Thanks to the extensive coordination efforts by the ENCODE4 Biosample Working Group, 171 biosamples have DNase, H3K4me3, H3K27ac, and CTCF data. We refer to these samples as the biosample-specific Core Collection of cCREs. These samples cover a variety of tissues and organs and primarily comprise primary tissues and cells. We suggest that users prioritize these samples for their analysis as they contain all the relevant marks for the most complete annotation of cCREs.";

const PARTIAL_COLLECTION_TOOLTIP =
  "To supplement the Core Collection, 1,154 biosamples have DNase in addition to various combinations of the other marks (but not all three). Though we are unable to annotate the full spectrum of cCRE classes in these biosamples, having DNase enables us to annotate element boundaries with high resolution. Therefore, we refer to this group as the Partial Data Collection. In these biosamples, we classify elements using the available marks. For example, if a sample lacks H3K27ac and CTCF, its cCREs can only be assigned to the promoter, CA-H3K4me3, and CA groups, not the enhancer or CA-CTCF groups. The Partial Data Collection contains some unique tissues and cell states that are not represented in the Core Collection, such as fetal brain tissue and stimulated immune cells that may be of high interest to some researchers. Therefore, if users are interested in cCRE annotations in such biosamples, we suggest leveraging the cell type-agnostic annotations or annotations from similar biosamples in the Core Collection, to supplement their analyses.";

const ANCILLARY_COLLECTION_TOOLTIP =
  "For the 563 biosamples lacking DNase data, we do not have the resolution to identify specific elements and we refer to these annotations as the Ancillary Collection. In these biosamples, we simply label cCREs as having a high or low signal for every available assay. We highly suggest that users do not use annotations from the Ancillary Collection unless they are anchoring their analysis on cCREs from the Core Collection or Partial Data Collection.";

//Cache is not working as expected when switching between open cCREs
export const BiosampleActivity = ({ entity }: EntityViewComponentProps) => {
  // Assay values are used to index into row object, so need to modify assaySpecificRows if changing assays here
  const [tab, setTab] = useState<"tables" | CcreAssay>("tables");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as "tables" | "dnase" | "atac" | "h3k4me3" | "h3k27ac" | "ctcf");
  };

  const { data: cCREdata, error: errorCcreData } = useCcreData({
    accession: entity.entityID,
    assembly: entity.assembly,
  });

  const {
    data: silencersData,
    loading: loadingSilencersData,
    error: errorSilencersData,
  } = useSilencersData({ accession: [entity.entityID], assembly: entity.assembly });

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

  const { data: data_biosampleZs, error: error_biosampleZs } = useQuery(BIOSAMPLE_Zs, {
    variables: {
      assembly: entity.assembly.toLowerCase(),
      accession: entity.entityID,
    },
  });

  /**
   * Fetch mapping between biosample and if cCRE is TF in that sample, displayed in table and used for classification
   */
  const { data: data_ccre_tf, error: error_ccre_tf } = useQuery(GET_CCRE_CT_TF, {
    variables: {
      assembly: entity.assembly.toLowerCase() === "mm10" ? "mm10" : "GRCh38",
      accession: entity.entityID,
    },
  });

  /**
   * fetch genes within 2M bp region to find distance to nearest TSS, used for classification.
   */
  const { data: dataNearbyGenes, error: errorNearbyGenes } = useQuery(NEARBY_GENES, {
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
      overlapsTSS: ccreOverlapsTSS(coordinates, gene.transcripts, gene.strand as "+" | "-"),
    };
  });

  const distanceToTSS = nearbyGenes?.sort((a, b) => a.distanceToTSS - b.distanceToTSS)[0].distanceToTSS;

  const overlapsTSS = nearbyGenes?.some((x) => x.overlapsTSS);

  //need to extract the experiment from this
  const biosampleRows: BiosampleRow[] = useMemo(() => {
    if (!data_biosampleZs || !data_ccre_tf) return null;
    return data_biosampleZs?.ccREBiosampleQuery.biosamples.map((sample) => {
      const dnase = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "dnase")?.score || -11;
      const dnaseAccession = sample.cCREZScores.find(
        (exp) => exp.assay.toLowerCase() === "dnase"
      )?.experiment_accession;
      const atac = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "atac")?.score || -11;
      const atacAccession = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "atac")?.experiment_accession;

      const h3k4me3 = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "h3k4me3")?.score || -11;
      const h3k4me3Accession = sample.cCREZScores.find(
        (exp) => exp.assay.toLowerCase() === "h3k4me3"
      )?.experiment_accession;

      const h3k27ac = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "h3k27ac")?.score || -11;
      const h3k27acAccession = sample.cCREZScores.find(
        (exp) => exp.assay.toLowerCase() === "h3k27ac"
      )?.experiment_accession;
      const ctcf = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "ctcf")?.score || -11;
      const ctcfAccession = sample.cCREZScores.find((exp) => exp.assay.toLowerCase() === "ctcf")?.experiment_accession;
      const tf = data_ccre_tf.getcCRETFQuery.find((x) => sample.name === x.celltype)?.tf.toString();

      const scores = {
        dnase,
        dnaseAccession,
        atac,
        atacAccession,
        h3k4me3,
        h3k4me3Accession,
        h3k27ac,
        h3k27acAccession,
        ctcf,
        ctcfAccession,
        tf,
      };

      const classification = classifyCcre(scores, distanceToTSS, overlapsTSS);

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
        ...scores,
      };
    });
  }, [data_ccre_tf, data_biosampleZs, distanceToTSS, overlapsTSS]);

  const coreCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "core");
  }, [biosampleRows]);

  const partialDataCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "partial");
  }, [biosampleRows]);

  const ancillaryCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "ancillary");
  }, [biosampleRows]);

  const assaySpecificRows: BiosampleRow[] = useMemo(() => {
    if (tab === "tables") return undefined;
    return biosampleRows?.filter((row) => row[tab] !== -11);
  }, [biosampleRows, tab]);

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

  const partialCollectionChromAccess = useMemo(() => {
    if (!partialDataCollection) return;
    let highDNase = 0;
    let lowDNase = 0;
    partialDataCollection.forEach((row) => {
      if (row.dnase >= 1.64) {
        highDNase++;
      } else lowDNase++;
    });
    return { highDNase, lowDNase };
  }, [partialDataCollection]);

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
        <Stack spacing={3} sx={{ mt: "0rem", mb: "0rem" }}>
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 400,
              color: "text.primary",
              pl: 1,
              ml: 0, // match table start
            }}
          >
            Cell Type Agnostic Classification
          </Typography>
          <Table
            rows={ctAgnosticRow}
            columns={ctAgnosticCols}
            loading={loading_Ct_Agnostic}
            //temp fix to get visual loading state without specifying height once loaded. See https://github.com/weng-lab/web-components/issues/22
            divHeight={!ctAgnosticRow ? { height: "182px" } : undefined}
            error={!!error_Ct_Agnostic}
            {...disableCsvEscapeChar}
            hideFooter
            showToolbar={false}
          />
          {silencersData && silencersData.length > 0 && (
            <Table
              label="Silencers"
              rows={
                silencersData?.flatMap((item) =>
                  item.silencer_studies.map((study) => ({
                    study: Silencer_Studies.find((s) => s.value == study).study,
                    pmid: Silencer_Studies.find((s) => s.value == study).pubmed_id,
                    method: Silencer_Studies.find((s) => s.value == study).method,
                    pubmed_link: Silencer_Studies.find((s) => s.value == study).pubmed_link,
                  }))
                ) || []
              }
              columns={silencersDataCols}
              loading={loadingSilencersData}
              //temp fix to get visual loading state without specifying height once loaded. See https://github.com/weng-lab/web-components/issues/22
              divHeight={!silencersData ? { height: "182px" } : undefined}
              error={!!errorSilencersData}
              {...disableCsvEscapeChar}
              hideFooter
              //showToolbar={false}
            />
          )}
          <div>
            <ProportionsBar
              data={getProportionsFromArray(coreCollection, "class", CCRE_CLASSES)}
              label="Classification Proportions, Core Collection:"
              loading={loadingCorePartialAncillary || errorCorePartialAncillary}
              getColor={(key) => CLASS_COLORS[key]}
              formatLabel={(key) => CLASS_DESCRIPTIONS[key]}
              tooltipTitle="Classification Proportions, Core Collection"
              style={{ marginBottom: "8px" }}
            />
            <Table
              label="Core Collection"
              labelTooltip={CORE_COLLECTION_TOOLTIP}
              rows={coreCollection}
              columns={getCoreAndPartialCols()}
              loading={loadingCorePartialAncillary}
              error={errorCorePartialAncillary}
              divHeight={{ height: "400px" }}
              initialState={{ sorting: { sortModel: [{ field: "dnase", sort: "desc" }] } }}
              {...disableCsvEscapeChar}
            />
          </div>
          <div>
            <ProportionsBar
              data={partialCollectionChromAccess}
              label="Chromatin Accessibility, Partial Data Collection:"
              loading={loadingCorePartialAncillary || errorCorePartialAncillary}
              getColor={(key) => (key === "highDNase" ? "#06DA93" : "#e1e1e1")}
              formatLabel={(key) =>
                key === "highDNase"
                  ? "High Chromatin Accessibility (DNase ≥ 1.64)"
                  : "Low Chromatin Accessibility (DNase < 1.64)"
              }
              tooltipTitle="Chromatin Accessibility, Partial Data Collection"
              style={{ marginBottom: "12px" }}
            />
            <Table
              label="Partial Data Collection"
              labelTooltip={PARTIAL_COLLECTION_TOOLTIP}
              rows={partialDataCollection}
              columns={getCoreAndPartialCols()}
              loading={loadingCorePartialAncillary}
              error={errorCorePartialAncillary}
              divHeight={{ height: "400px" }}
              initialState={{ sorting: { sortModel: [{ field: "dnase", sort: "desc" }] } }}
              {...disableCsvEscapeChar}
            />
          </div>
          <Table
            label="Ancillary Collection"
            labelTooltip={ANCILLARY_COLLECTION_TOOLTIP}
            rows={ancillaryCollection}
            columns={getAncillaryCols()}
            loading={loadingCorePartialAncillary}
            error={errorCorePartialAncillary}
            divHeight={{ height: "400px" }}
            initialState={{ sorting: { sortModel: [{ field: "atac", sort: "desc" }] } }}
            {...disableCsvEscapeChar}
          />
        </Stack>
      ) : (
        <AssayView rows={assaySpecificRows} columns={getCoreAndPartialCols()} assay={tab} entity={entity} />
      )}
    </>
  );
};
