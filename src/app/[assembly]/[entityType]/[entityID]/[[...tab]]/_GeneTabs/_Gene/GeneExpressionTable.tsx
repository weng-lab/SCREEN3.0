import { GeneExpressionTableProps, PointMetadata } from "./types";
import { IconButton } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { useEffect, useMemo, useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";

const GeneExpressionTable = ({ label, rows, loading, error, tableProps, viewBy, scale }: GeneExpressionTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false);

  const { apiRef } = tableProps;

  const columns: TableColDef<PointMetadata>[] = useMemo(
    () => [
      sortableTableCheckboxColumn,
      {
        field: "biosample",
        headerName: "Sample",
        sortable: viewBy !== "byTissueTPM",
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
        field: " ",
        headerName: scale === "linearTPM" ? "TPM" : "Log10(TPM + 1)",
        type: "number",
        valueGetter: (_, row) => {
          return (row.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0).toFixed(2);
        },
        sortable: viewBy !== "byTissueTPM",
      },
      {
        field: "tissue",
        headerName: "Organ/Tissue",
        sortable: viewBy !== "byTissueTPM",
      },
      {
        field: "biosample_type",
        headerName: "Biosample Type",
        sortable: viewBy !== "byTissueTPM",
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
    [viewBy, scale]
  );

  const initialSort: GridSortModel = useMemo(() => [{ field: "tpm", sort: "desc" }], []);

  // When autoSort or viewBy changes, reset to the canonical sort for the current view.
  // Always resetting on viewBy change ensures the pre-computed row order is not overridden
  // by a stale user sort (e.g. byTissueTPM grouping being destroyed by a biosample sort).
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    const base: GridSortModel = viewBy === "byTissueTPM" ? [] : initialSort;
    api.setSortModel(autoSort ? [{ field: "__check__", sort: "desc" }, ...base] : base);
  }, [apiRef, autoSort, viewBy, initialSort]);

  // While autoSort is on, keep __check__ as primary sort after any user-initiated sort change.
  // Guard against infinite loop: if __check__ is already first, the call was ours — skip it.
  useEffect(() => {
    const api = apiRef?.current;
    if (!api || !autoSort) return;
    return api.subscribeEvent("sortModelChange", (model) => {
      if (model[0]?.field === "__check__") return;
      const withoutCheck = model.filter((s) => s.field !== "__check__");
      api.setSortModel([{ field: "__check__", sort: "desc" }, ...withoutCheck]);
    });
  }, [apiRef, autoSort]);

  // Re-apply the sort model when selection changes while autoSort is active.
  // DataGrid doesn't re-sort automatically when checkbox state changes.
  useEffect(() => {
    const api = apiRef?.current;
    if (!api || !autoSort) return;
    return api.subscribeEvent("rowSelectionChange", () => {
      api.setSortModel([...api.getSortModel()]);
    });
  }, [apiRef, autoSort]);

  return (
    <Table
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      error={error}
      initialState={{
        sorting: {
          sortModel: initialSort,
        },
      }}
      divHeight={{ height: "100%" }}
      toolbarSlot={<AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />}
      {...tableProps}
    />
  );
};

export default GeneExpressionTable;
