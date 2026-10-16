import { GeneExpressionScale, getScaledTPM, PointMetadata } from "./types";
import { IconButton } from "@mui/material";
import { capitalizeOption, TableColDef } from "@weng-lab/ui-components";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utils";

/** The table's columns, which the UMAP also reads to name the table's filters. */
export const geneExpressionColumns = (scale: GeneExpressionScale): TableColDef<PointMetadata>[] => [
  {
    field: "biosample",
    headerName: "Sample",
    valueGetter: (_, row) => {
      return capitalizeFirstLetter(row.biosample);
    },
    //truncate
    renderCell: (params) => (
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 250,
        }}
        title={params.value}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "tpm",
    headerName: scale === "linearTPM" ? "TPM" : "Log10(TPM + 1)",
    type: "number",
    valueGetter: (_, row) => {
      return getScaledTPM(row, scale);
    },
    valueFormatter: (value: number) => value.toFixed(2),
    minWidth: 75,
  },
  // Options filled in from the rows - see withValueOptions.
  {
    field: "tissue",
    headerName: "Organ/Tissue",
    type: "singleSelect",
    getOptionLabel: capitalizeOption,
  },
  {
    field: "biosample_type",
    headerName: "Biosample Type",
    type: "singleSelect",
    getOptionLabel: capitalizeOption,
  },
  {
    field: "link",
    headerName: "Experiment",
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (_, row) => row.exp_accession,
    renderCell: (params) => {
      const biorep = params.row.biorep;
      return (
        <>
          <IconButton href={`https://www.encodeproject.org/experiments/${params.value}/`} target="_blank" size="small">
            <OpenInNew fontSize="small" />
          </IconButton>
          {biorep != null && ` rep. ${biorep}`}
        </>
      );
    },
  },
];
