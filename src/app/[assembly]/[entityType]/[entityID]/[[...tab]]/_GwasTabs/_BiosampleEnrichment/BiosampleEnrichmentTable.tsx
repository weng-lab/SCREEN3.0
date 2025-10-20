import { GWASEnrichment, UseGWASEnrichmentReturn } from "common/hooks/useGWASEnrichmentData";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { Table, GRID_CHECKBOX_SELECTION_COL_DEF } from "@weng-lab/ui-components";
import { OpenInNew } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { capitalizeFirstLetter } from "common/utility";

import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
  GridColDef,
  GridSortDirection,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import AutoSortSwitch from "common/components/AutoSortSwitch";

export type BiosampleEnrichmentTableProps = {
  enrichmentdata: UseGWASEnrichmentReturn;
  onSelectionChange: (selected: GWASEnrichment[]) => void;
  setSortedFilteredData: Dispatch<SetStateAction<GWASEnrichment[]>>;
  selected: GWASEnrichment[];
  sortedFilteredData: GWASEnrichment[];
};
const BiosampleEnrichmentTable = ({
  enrichmentdata,
  onSelectionChange,
  setSortedFilteredData,
  selected,
  sortedFilteredData,
}: BiosampleEnrichmentTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false);
  const { data, loading, error } = enrichmentdata;
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const newIds = Array.from(ids.ids);
    const selectedRows = newIds.map((id) => data.find((row) => row.accession === id));
    onSelectionChange(selectedRows);
  };

  const apiRef = useGridApiRef();

  const arraysAreEqual = (arr1: GWASEnrichment[], arr2: GWASEnrichment[]): boolean => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const isEqual = JSON.stringify(arr1[0]) === JSON.stringify(arr2[0]);
    if (!isEqual) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].accession !== arr2[i].accession) {
        return false;
      }
    }
    return true;
  };

  const handleSync = () => {
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as GWASEnrichment[];
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      setSortedFilteredData(rows);
    }
  };

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) => (
    <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>
  );

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef<GWASEnrichment>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
      sortable: true,
      hideable: false,
      renderHeader: StopPropagationWrapper,
    },
    {
      field: "displayname",
      headerName: "Biosample",
      valueGetter: (_, row) => {
        return capitalizeFirstLetter(row.displayname);
      },
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 150,
          }}
          title={params.value}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "fc",
      headerName: "Fold Change",
      valueGetter: (_, row) => row.fc.toFixed(3),
    },
    {
      field: "fdr",
      headerName: "FDR",
      valueGetter: (_, row) => row.fdr.toFixed(3),
    },
    {
      field: "pvalue",
      headerName: "P",
      valueGetter: (_, row) => row.pvalue.toFixed(3),
    },

    {
      field: "ontology",
      headerName: "Tissue",
      valueGetter: (_, row) => row.ontology,
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
          <IconButton href={`https://www.encodeproject.org/experiments/${params.value}/`} target="_blank" size="small">
            <OpenInNew fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  const tooltip = useMemo(() => (
    <Tooltip
      title="Suggested Biosamples: Suggested biosamples to investigate based on cCRE enrichment as calculated by the Variant Enrichment and Sample Prioritization Analysis (VESPA) pipeline"
    >
      <InfoOutlinedIcon fontSize="inherit" />
    </Tooltip>
  ), []);

  const initialSort: GridSortModel = useMemo(() =>
    [{ field: "fc", sort: "desc" as GridSortDirection }],
    []);

  const AutoSortToolbar = useMemo(() => {
    return (
      <AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />
    )
  }, [autoSort])

  // handle auto sorting 
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;
    if (!autoSort) {
      //reset sort if none selected
      api.setSortModel(initialSort);
      return;
    }

    //sort by checkboxes if some selected, otherwise sort by tpm
    api.setSortModel(selected?.length > 0 ? [{ field:  "__check__", sort: "desc" }] : initialSort);
  }, [apiRef, autoSort, initialSort, selected]);

  return error ? (
    <Typography>Error Fetching GWAS Enrichment</Typography>
  ) : (
    <>
      <Table
        apiRef={apiRef}
        showToolbar
        rows={data || []}
        columns={columns}
        loading={loading}
        label={`Suggested Biosamples`}
        emptyTableFallback={"No Suggested Biosamples found for this study"}
        initialState={{
          sorting: {
            sortModel: initialSort,
          },
        }}
        checkboxSelection
        getRowId={(row) => row.accession} //needed to match up data with the ids returned by onRowSelectionModelChange
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={{ type: "include", ids: new Set(selected.map((x) => x.accession)) }}
        keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
        onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structur
        divHeight={{ height: "100%", minHeight: isXs ? "none" : "580px" }}
        labelTooltip={tooltip}
        toolbarSlot={AutoSortToolbar}
      />
    </>
  );
};

export default BiosampleEnrichmentTable;
