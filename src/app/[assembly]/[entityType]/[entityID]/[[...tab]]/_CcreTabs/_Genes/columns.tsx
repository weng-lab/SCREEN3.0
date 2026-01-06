import { Typography } from "@mui/material";
import { GridRenderCellParams, GridColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { LinkedGeneInfo } from "common/hooks/useGWASSnpscCREsGenesData";
import { toScientificNotationElement } from "common/utility";

const geneNameCol: GridColDef = {
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

const geneTypeCol: GridColDef = {
  field: "genetype",
  headerName: "Gene Type",
  valueGetter: (value, row: LinkedGeneInfo) => GeneTypeFormatter(value, row),
};

const experimentCol: GridColDef = {
  field: "experiment_accession",
  headerName: "Experiment ID",
  renderCell: (params: GridRenderCellParams) => (
    <LinkComponent href={`https://www.encodeproject.org/experiments/${params.value}`} openInNewTab showExternalIcon>
      {params.value}
    </LinkComponent>
  ),
};

const displayNameCol: GridColDef = {
  field: "displayname",
  headerName: "Biosample",
};

const scoreCol: GridColDef = {
  field: "score",
  headerName: "Score",
  type: "number",
};

const pValCol: GridColDef = {
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

const assayCol: GridColDef = {
  field: "assay",
  headerName: "Assay Type",
};

const gRNACol: GridColDef = {
  field: "grnaid",
  headerName: "gRNA ID",
};

const effectSizeCol: GridColDef = {
  field: "effectsize",
  headerName: "Effect Size",
};

const variantIDCol: GridColDef = {
  field: "variantid",
  headerName: "Variant ID",
};

const sourceCol: GridColDef = {
  field: "source",
  headerName: "Source",
};

const tissueCol: GridColDef = {
  field: "tissue",
  headerName: "Tissue",
};

const slopeCol: GridColDef = {
  field: "slope",
  headerName: "Slope",
  type: "number",
};

/**
 * Table definitions for the linked genes tab.
 */
export const IntactHiCLoopsCols: GridColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 65 },
  experimentCol,
  { ...displayNameCol, minWidth: 85 },
  scoreCol,
  { ...pValCol, minWidth: 85 },
];

export const ChIAPETCols: GridColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 65 },
  { ...assayCol, minWidth: 85 },
  experimentCol,
  { ...displayNameCol, minWidth: 85 },
  scoreCol,
];

export const CrisprFlowFISHCols: GridColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 65 },
  gRNACol,
  { ...experimentCol, flex: 1.25 },
  { ...displayNameCol, minWidth: 85 },
  effectSizeCol,
  pValCol,
];

export const eQTLCols: GridColDef[] = [
  geneNameCol,
  { ...geneTypeCol, minWidth: 100 },
  { ...variantIDCol, minWidth: 140 },
  { ...sourceCol, minWidth: 75 },
  { ...tissueCol, minWidth: 85 },
  slopeCol,
  { ...pValCol, minWidth: 85 },
];
