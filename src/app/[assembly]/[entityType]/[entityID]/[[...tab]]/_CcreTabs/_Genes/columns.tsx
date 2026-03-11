import { Typography } from "@mui/material";
import { TableColDef } from "@weng-lab/ui-components";
import { GridRenderCellParams } from "@mui/x-data-grid-premium";
import { LinkComponent } from "common/components/LinkComponent";
import { LinkedGeneInfo } from "common/hooks/useGWASSnpscCREsGenesData";
import { toScientificNotationElement } from "common/utility";

const geneNameCol: TableColDef = {
  field: "gene",
  headerName: "Common Gene Name",
  renderCell: (params: GridRenderCellParams) =>
    params.value.startsWith("ENSG") ? (
      <i>{params.value}</i>
    ) : (
      <LinkComponent href={`/GRCh38/gene/${params.value}`}>
        <i>{params.value}</i>
      </LinkComponent>
    ),
};

const GeneTypeFormatter = (value: string, row: LinkedGeneInfo) =>
  row.genetype
    ? row.genetype === "lncRNA"
      ? row.genetype
      : row.genetype
          .replaceAll("_", " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
    : value;

const geneTypeCol: TableColDef = {
  field: "genetype",
  headerName: "Gene Type",
  valueGetter: (value, row: LinkedGeneInfo) => GeneTypeFormatter(value, row),
};

const experimentCol: TableColDef = {
  field: "experiment_accession",
  headerName: "Experiment ID",
  renderCell: (params: GridRenderCellParams) => (
    <LinkComponent href={`https://www.encodeproject.org/experiments/${params.value}`} openInNewTab showExternalIcon>
      {params.value}
    </LinkComponent>
  ),
};

const displayNameCol: TableColDef = {
  field: "displayname",
  headerName: "Biosample",
};

const scoreCol: TableColDef = {
  field: "score",
  headerName: "Score",
  type: "number",
};

const pValCol: TableColDef = {
  field: "p_val",
  headerName: "P",
  type: "number",
  display: "flex",
  renderHeader: () => (
    <Typography variant="body2" pr={0.1}>
      <i>P</i>
    </Typography>
  ),
  renderCell: (params: GridRenderCellParams) =>
    params.value === 0 ? "0" : toScientificNotationElement(params.value, 2, { variant: "body2" }),
};

const assayCol: TableColDef = {
  field: "assay",
  headerName: "Assay Type",
};

const gRNACol: TableColDef = {
  field: "grnaid",
  headerName: "gRNA ID",
};

const effectSizeCol: TableColDef = {
  field: "effectsize",
  headerName: "Effect Size",
};

const variantIDCol: TableColDef = {
  field: "variantid",
  headerName: "Variant ID",
};

const sourceCol: TableColDef = {
  field: "source",
  headerName: "Source",
};

const tissueCol: TableColDef = {
  field: "tissue",
  headerName: "Tissue",
};

const slopeCol: TableColDef = {
  field: "slope",
  headerName: "Slope",
  type: "number",
};

/**
 * Table definitions for the linked genes tab.
 */
export const IntactHiCLoopsCols: TableColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 65 },
  experimentCol,
  { ...displayNameCol, minWidth: 85 },
  scoreCol,
  { ...pValCol, minWidth: 85 },
];

export const ChIAPETCols: TableColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 65 },
  { ...assayCol, minWidth: 85 },
  experimentCol,
  { ...displayNameCol, minWidth: 85 },
  scoreCol,
];

export const CrisprFlowFISHCols: TableColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 65 },
  gRNACol,
  { ...experimentCol, flex: 1.25 },
  { ...displayNameCol, minWidth: 85 },
  effectSizeCol,
  pValCol,
];

export const eQTLCols: TableColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 100 },
  { ...variantIDCol, minWidth: 140 },
  { ...sourceCol, minWidth: 75 },
  { ...tissueCol, minWidth: 85 },
  slopeCol,
  { ...pValCol, minWidth: 85 },
];
