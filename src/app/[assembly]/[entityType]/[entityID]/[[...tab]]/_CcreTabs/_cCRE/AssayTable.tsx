import { SharedAssayViewPlotProps } from "./AssayView";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Assay, BiosampleRow, formatAssay } from "./BiosampleActivity";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  Table,
  useGridApiRef,
} from "@weng-lab/ui-components";

const assays: Assay[] = ["dnase", "atac", "h3k4me3", "h3k27ac", "ctcf"];

const arraysAreEqual = (arr1: BiosampleRow[], arr2: BiosampleRow[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const isEqual = JSON.stringify(arr1[0]) === JSON.stringify(arr2[0]);
  if (!isEqual) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].name !== arr2[i].name) {
      return false;
    }
  }
  return true;
};

const AssayTable = ({
  entity,
  rows,
  columns,
  assay,
  selected,
  setSelected,
  sortedFilteredData,
  setSortedFilteredData,
}: SharedAssayViewPlotProps) => {
  const hideAllOtherAssays = useMemo(() => {
    const hiddenAssays = { tf: false };
    assays.forEach((x) => {
      if (x !== assay) Object.defineProperty(hiddenAssays, x, { value: false, enumerable: true });
    });
    return hiddenAssays;
  }, [assay]);

  const tableCols = useMemo(() => {
    const displaynameCol = columns.find((x) => x.field === "displayname");
    const assayCols = columns.filter((x) => assays.includes(x.field as Assay));
    const tfCol = columns.find((x) => x.field === "tf");
    const restCols = columns.filter(
      (x) => x.field !== "displayname" && x.field !== "tf" && !assays.includes(x.field as Assay)
    );
    return [displaynameCol, ...assayCols, tfCol, ...restCols];
  }, [columns]);

  const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
    console.log(newRowSelectionModel)
    if (newRowSelectionModel.type === "include") {
      const newIds = Array.from(newRowSelectionModel.ids);
      const selectedRows = newIds.map((id) => rows.find((row) => row.name === id));
      setSelected(selectedRows);
    } else { // type is "exclude" with no ids (select all)
      setSelected(rows)
    }
  };

  const apiRef = useGridApiRef();

  const handleSync = useCallback(() => {
    if (!apiRef.current) return;
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as BiosampleRow[];
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      //It's breaking when this is called
      setSortedFilteredData(rows);
      // setSortedFilteredData((prev) => [...prev]);
    }
  }, [apiRef, setSortedFilteredData, sortedFilteredData]); 

  // okay so whenever this component updates parent state it gets a rerender which reruns handleSync?

  const rowSelectionModel: GridRowSelectionModel = useMemo(() => {
    return { type: "include", ids: new Set(selected.map((x) => x.name)) };
  }, [selected]);

  return (
    <Table
      key={assay} // force reset to initial state and hide all other assays
      label={`${entity.entityID} ${formatAssay(assay)} z-scores`}
      rows={rows}
      loading={!rows}
      columns={tableCols}
      apiRef={apiRef}
      // -- Selection Props --
      checkboxSelection
      getRowId={(row: BiosampleRow) => row.name} //Need to assign unique ID, as DataGrid selection is managed only through row ID
      onRowSelectionModelChange={handleRowSelectionModelChange}
      rowSelectionModel={rowSelectionModel}
      keepNonExistentRowsSelected
      // -- End Selection Props --
      onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
      divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
      initialState={{
        columns: { columnVisibilityModel: hideAllOtherAssays },
        sorting: { sortModel: [{ field: assay, sort: "desc" }] },
      }}
    />
  );
};

export default AssayTable;
