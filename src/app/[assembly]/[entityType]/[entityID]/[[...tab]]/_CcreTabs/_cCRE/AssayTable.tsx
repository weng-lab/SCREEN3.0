import { useEffect, useMemo, useState } from "react";
import { Table } from "@weng-lab/ui-components";
import {
  GridColumnVisibilityModel,
  GridSortDirection,
  GridSortModel,
} from "@mui/x-data-grid-premium";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { CcreAssay } from "common/types/globalTypes";
import { CCRE_ASSAYS } from "common/consts";
import { formatAssay } from "common/utility";
import type { AssayTableProps } from "./types";

const makeColumnVisibiltyModel = (assay: CcreAssay): GridColumnVisibilityModel => {
  const hidden = { ontology: false, sampleType: false, lifeStage: false, tf: false };
  CCRE_ASSAYS.forEach((x) => {
    if (x !== assay) Object.defineProperty(hidden, x, { value: false, enumerable: true });
  });
  return hidden;
};

const AssayTable = ({ rows, columns, assay, entity, tableProps, viewBy }: AssayTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false);

  const { apiRef, rowSelectionModel } = tableProps;

  useEffect(() => {
    if (!apiRef.current) return;
    apiRef.current.setColumnVisibilityModel(makeColumnVisibiltyModel(assay));
    apiRef.current.sortColumn(assay, "desc");
  }, [apiRef, assay]);

  const initialSort: GridSortModel = useMemo(() => [{ field: assay, sort: "desc" as GridSortDirection }], [assay]);

  // Derive selected from the rowSelectionModel for autoSort logic
  const hasSelection = rowSelectionModel.type === "include" && rowSelectionModel.ids.size > 0;

  // handle auto sorting
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    // handle sort by tissue special case
    if (viewBy === "tissue") {
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

  /**
   * Resize cols on assay change. Need to use requestAnimationFrame to queue this update until after
   * the column changes are completed. This calls the autosize method right before the next repaint.
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
      rows={rows}
      loading={!rows}
      columns={columns}
      divHeight={{ height: "100%" }}
      initialState={{
        columns: { columnVisibilityModel: makeColumnVisibiltyModel(assay) },
        sorting: { sortModel: initialSort },
      }}
      toolbarSlot={<AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />}
      {...tableProps}
    />
  );
};

export default AssayTable;
