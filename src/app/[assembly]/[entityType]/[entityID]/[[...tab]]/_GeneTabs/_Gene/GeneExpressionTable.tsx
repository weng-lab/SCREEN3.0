import { GeneExpressionTableProps, PointMetadata } from "./types";
import { IconButton } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { GridSortModel, GridSortDirection } from "@mui/x-data-grid-premium";
import { useEffect, useMemo, useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";

const GeneExpressionTable = ({ label, rows, loading, error, tableProps, viewBy, scale }: GeneExpressionTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false);

  const { apiRef, rowSelectionModel } = tableProps;

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

  const initialSort: GridSortModel = useMemo(() => [{ field: "tpm", sort: "desc" as GridSortDirection }], []);

  const hasSelection = rowSelectionModel.type === "include" && rowSelectionModel.ids.size > 0;

  // handle auto sorting
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    // handle sort by tissue special case
    if (viewBy === "byTissueTPM") {
      if (!autoSort || !hasSelection) {
        api.setSortModel([]); // clear when autoSort off OR no selection
      } else {
        api.setSortModel([{ field: "__check__", sort: "desc" }]);
      }
      return;
    }

    // all other views
    if (!autoSort) {
      api.setSortModel(initialSort);
      return;
    }

    //sort by checkboxes if some selected, otherwise sort by tpm
    api.setSortModel(hasSelection ? [{ field: "__check__", sort: "desc" }] : initialSort);
  }, [apiRef, autoSort, initialSort, hasSelection, viewBy]);

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
