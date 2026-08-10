import { TableColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { ScientificNotation } from "common/utils";

export function formatCoord(str: string) {
  const [chrom, start, end] = str.split("_");
  return `${chrom}:${start}-${end}`;
}

// Shared column definitions
export const sharedColumns: { [key: string]: TableColDef } = {
  accession: {
    field: "accession",
    headerName: "Accession",
    renderCell: (params) => (
      <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
        <i>{params.value}</i>
      </LinkComponent>
    ),
  },
  gene: {
    field: "gene",
    headerName: "Common Gene Name",
    renderCell: (params) => (
      <LinkComponent href={`/GRCh38/gene/${params.value}`}>
        <i>{params.value}</i>
      </LinkComponent>
    ),
  },
  genename: {
    field: "genename",
    headerName: "Common Gene Name",
    renderCell: (params) => (
      <LinkComponent href={`/GRCh38/gene/${params.value}`}>
        <i>{params.value}</i>
      </LinkComponent>
    ),
  },
  genetype: {
    field: "genetype",
    headerName: "Gene Type",
    valueGetter: (_, row) =>
      row.genetype === "lncRNA"
        ? row.genetype
        : row.genetype
            .replaceAll("_", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
  },
  assay: {
    field: "assay",
    headerName: "Assay Type",
  },
  experiment_accession: {
    field: "experiment_accession",
    headerName: "Experiment ID",
    renderCell: (params) => (
      <LinkComponent href={`https://www.encodeproject.org/experiments/${params.value}`} openInNewTab showExternalIcon>
        {params.value}
      </LinkComponent>
    ),
  },
  displayname: {
    field: "displayname",
    headerName: "Biosample",
  },
  score: {
    field: "score",
    headerName: "Score",
    type: "number",
  },
  p_val: {
    field: "p_val",
    headerName: "P",
    renderHeader: () => (
      <p>
        <i>P&nbsp;</i>
      </p>
    ),
    renderCell: (params) => (
      <>
        {params.value === 0
          ? "0"
          : ScientificNotation(params.value, 2, {
              variant: "body2",
            })}
      </>
    ),
    type: "number",
  },
};
