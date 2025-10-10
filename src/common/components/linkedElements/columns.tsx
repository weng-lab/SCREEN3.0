import { GridRenderCellParams } from "@weng-lab/ui-components";
import { Typography } from "@mui/material";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { toScientificNotationElement } from "common/utility";
import { colDef } from "./linkedElements";
import { LinkComponent } from "../LinkComponent";


type renderCellParams = GridRenderCellParams<LinkedGeneInfo> | GridRenderCellParams<LinkedICREInfo>;


/**
 * Column definitions for the linked elements tab.
 */
export const geneNameCol: colDef = {
  field: "gene",
  headerName: "Common Gene Name",
  renderCell: (params: renderCellParams) =>
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

export const geneTypeCol: colDef = {
  field: "genetype",
  headerName: "Gene Type",
  valueGetter: (value, row: LinkedGeneInfo) => GeneTypeFormatter(value, row),
};

export const experimentCol: colDef = {
  field: "experiment_accession",
  headerName: "Experiment ID",
  renderCell: (params: renderCellParams) => (
    <LinkComponent
      href={`https://www.encodeproject.org/experiments/${params.value}`}
      openInNewTab
      showExternalIcon
    >
      {params.value}
    </LinkComponent>
  ),
};

export const displayNameCol: colDef = {
  field: "displayname",
  headerName: "Biosample",
};

export const scoreCol: colDef = {
  field: "score",
  headerName: "Score",
  type: "number",
};

export const pValCol: colDef = {
  field: "p_val",
  headerName: "P",
  type: "number",
  display: "flex",
  renderHeader: () => (
    <Typography variant="body2" pr={0.1}>
      <i>P</i>
    </Typography>
  ),
  renderCell: (params: renderCellParams) =>
    params.value === 0 ? "0" : toScientificNotationElement(params.value, 2, { variant: "body2" }),
};

export const assayCol: colDef = {
  field: "assay",
  headerName: "Assay Type",
};

export const gRNACol: colDef = {
  field: "grnaid",
  headerName: "gRNA ID",
};

export const effectSizeCol: colDef = {
  field: "effectsize",
  headerName: "Effect Size",
};

export const variantIDCol: colDef = {
  field: "variantid",
  headerName: "Variant ID",
};

export const sourceCol: colDef = {
  field: "source",
  headerName: "Source",
};

export const tissueCol: colDef = {
  field: "tissue",
  headerName: "Tissue",
};

export const slopeCol: colDef = {
  field: "slope",
  headerName: "Slope",
  type: "number",
};

export const accessionCol = (assembly: string): colDef => ({
  field: "accession",
  headerName: "Accession",
  renderCell: (params: renderCellParams) => (
    <LinkComponent href={`/${assembly}/ccre/${params.value}`}>
      {params.value}
    </LinkComponent>
  ),
});
