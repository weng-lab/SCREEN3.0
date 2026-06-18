import { GWASEnrichment, UseGWASEnrichmentReturn } from "common/hooks/data/gwas";
import { useMemo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { Table, TableColDef, useSyncedTable } from "@weng-lab/ui-components";
import type { useTablePlotSync } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";

export type BiosampleEnrichmentTableProps = {
  enrichmentdata: UseGWASEnrichmentReturn;
  tableProps: ReturnType<typeof useTablePlotSync<GWASEnrichment>>["tableProps"];
};

const initialSort: GridSortModel = [{ field: "fc", sort: "desc" }];

const LabelTooltip = (
  <Tooltip title="Suggested Biosamples: Suggested biosamples to investigate based on cCRE enrichment as calculated by the Variant Enrichment and Sample Prioritization Analysis (VESPA) pipeline">
    <InfoOutlinedIcon fontSize="inherit" />
  </Tooltip>
);

const BiosampleEnrichmentTable = ({ enrichmentdata, tableProps }: BiosampleEnrichmentTableProps) => {
  const { data, loading, error } = enrichmentdata;

  const columns: TableColDef<GWASEnrichment>[] = useMemo(
    () => [
      {
        field: "displayname",
        headerName: "Biosample",
        valueFormatter: (value: string) => capitalizeFirstLetter(value),
        maxWidth: 150,
      },
      {
        field: "fc",
        headerName: "Log2(Fold Enrichment)",
        type: "number",
        valueFormatter: (value: number) => value?.toFixed(3),
        maxWidth: 150,
      },
      {
        field: "fdr",
        headerName: "FDR",
        type: "number",
        valueFormatter: (value: number) => value?.toFixed(3),
      },
      {
        field: "pvalue",
        headerName: "P",
        type: "number",
        renderHeader: () => <i>P&nbsp;</i>,
        valueFormatter: (value: number) => value?.toFixed(3),
      },
      {
        field: "ontology",
        headerName: "Organ/Tissue",
      },
      {
        field: "link",
        headerName: "Experiment",
        sortable: false,
        disableColumnMenu: true,
        valueGetter: (_, row) => {
          return row.accession.split(" ")[0];
        },
        renderCell: (params) => {
          return (
            <IconButton
              href={`https://www.encodeproject.org/experiments/${params.value}/`}
              target="_blank"
              size="small"
            >
              <OpenInNew fontSize="small" />
            </IconButton>
          );
        },
      },
    ],
    []
  );

  const { syncedTableProps } = useSyncedTable({ tableProps, columns, initialSort, isPresorted: false });

  return (
    <Table
      {...syncedTableProps}
      showToolbar
      rows={data}
      loading={loading}
      error={!!error}
      label={`Suggested Biosamples`}
      emptyTableFallback={"No Suggested Biosamples found for this study"}
      slotProps={{
        toolbar: {
          labelTooltip: LabelTooltip,
        },
      }}
    />
  );
};

export default BiosampleEnrichmentTable;
