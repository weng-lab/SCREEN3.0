import { SharedAssayViewPlotProps } from "./AssayView";
import { useCallback, useEffect, useMemo } from "react";
import { Assay, BiosampleRow, formatAssay } from "./BiosampleActivity";
import {
  GridColumnVisibilityModel,
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  Table,
  useGridApiRef,
} from "@weng-lab/ui-components";
import { useMediaQuery, useTheme } from "@mui/material";

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

const makeColumnVisibiltyModel = (assay: Assay): GridColumnVisibilityModel => {
  const hidden = { ontology: false, sampleType: false, lifeStage: false, tf: false };
  assays.forEach((x) => {
    if (x !== assay) Object.defineProperty(hidden, x, { value: false, enumerable: true });
  });
  return hidden;
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
  viewBy,
}: SharedAssayViewPlotProps) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const transformedData: BiosampleRow[] = useMemo(() => {
    if (!rows) return [];

    let filteredData = rows

    switch (viewBy) {
      case "value": {
        filteredData.sort((a, b) => b[assay] - a[assay]);
        break;
      }

      case "tissue": {
        const getTissue = (d: BiosampleRow) => d.ontology ?? "unknown";

        const maxValuesByTissue = filteredData.reduce<Record<string, number>>((acc, item) => {
          const tissue = getTissue(item);
          acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item[assay]);
          return acc;
        }, {});

        filteredData.sort((a, b) => {
          const tissueA = getTissue(a);
          const tissueB = getTissue(b);
          const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
          if (maxDiff !== 0) return maxDiff;
          return b[assay] - a[assay];
        });
        break;
      }

      case "tissueMax": {
        const getTissue = (d: BiosampleRow) => d.ontology ?? "unknown";

        const maxValuesByTissue = filteredData.reduce<Record<string, number>>((acc, item) => {
          const tissue = getTissue(item);
          acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item[assay]);
          return acc;
        }, {});

        filteredData = filteredData.filter((item) => {
          const tissue = getTissue(item);
          return item[assay] === maxValuesByTissue[tissue];
        });

        filteredData.sort((a, b) => b[assay] - a[assay]);
        break;
      }
    }

    return [...filteredData]
  }, [rows, viewBy, assay]);

  const apiRef = useGridApiRef();

  // const tableCols = useMemo(() => {
  //   const displaynameCol = columns.find((x) => x.field === "displayname");
  //   const assayCols = columns.filter((x) => assays.includes(x.field as Assay));
  //   const tfCol = columns.find((x) => x.field === "tf");
  //   const restCols = columns.filter(
  //     (x) => x.field !== "displayname" && x.field !== "tf" && !assays.includes(x.field as Assay)
  //   );
  //   return [displaynameCol, ...assayCols, tfCol, ...restCols];
  // }, [columns]);

  const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
    if (newRowSelectionModel.type === "include") {
      const newIds = Array.from(newRowSelectionModel.ids);
      const selectedRows = newIds.map((id) => rows.find((row) => row.name === id));
      setSelected(selectedRows);
    } else { // if type is exclude, it's always with 0 ids (aka select all)
      setSelected(rows);
    }
  };

  const handleSync = useCallback(() => {
    if (!apiRef.current) return;
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as BiosampleRow[];
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      //It's breaking when this is called
      setSortedFilteredData(rows);
      // setSortedFilteredData((prev) => [...prev]);
    }
  }, [apiRef, setSortedFilteredData, sortedFilteredData]);

  const rowSelectionModel: GridRowSelectionModel = useMemo(() => {
    return { type: "include", ids: new Set(selected.map((x) => x.name)) };
  }, [selected]);

  useEffect(() => {
    if (!apiRef.current) return;
    apiRef.current.setColumnVisibilityModel(makeColumnVisibiltyModel(assay));
    apiRef.current.sortColumn(assay, "desc");
  }, [apiRef, assay]);

  useEffect(() => {
          const isCustomSorted = viewBy === "tissue";
          if (isCustomSorted && apiRef?.current) {
              apiRef.current.setSortModel([]); // completely clears internal sort
          }
      }, [viewBy, apiRef, assay]);

  /**
   * Resize cols on assay change. Need to use requestAnimationFrame to queue this update until after
   * the column changes are completed. This calls the autosize method right before the next repaint.
   * Calling it in above useEffect autosized before column updates were complete
   */
  useEffect(() => {
    if (!apiRef.current) return;
    const frame = requestAnimationFrame(() => {
      apiRef.current?.autosizeColumns({
        expand: true,
        includeHeaders: true,
        outliersFactor: 1.5,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [apiRef, assay]);

  return (
    <Table
      label={`${entity.entityID} ${formatAssay(assay)} z-scores`}
      rows={transformedData}
      loading={!rows}
      columns={columns}
      apiRef={apiRef}
      // -- Selection Props --
      checkboxSelection
      getRowId={(row: BiosampleRow) => row.name} //Need to assign unique ID, as DataGrid selection is managed only through row ID
      onRowSelectionModelChange={handleRowSelectionModelChange}
      rowSelectionModel={rowSelectionModel}
      keepNonExistentRowsSelected
      // -- End Selection Props --
      onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
      divHeight={{ height: "100%", minHeight: isXs ? "none" : "580px" }}
      initialState={{
        columns: { columnVisibilityModel: makeColumnVisibiltyModel(assay) },
        sorting: { sortModel: [{ field: assay, sort: "desc" }] },
      }}
    />
  );
};

export default AssayTable;
