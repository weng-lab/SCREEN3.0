import { useEffect } from "react";
import { Table } from "@weng-lab/ui-components";
import { GridColumnVisibilityModel } from "@mui/x-data-grid-premium";
import { CcreAssay } from "common/types/globalTypes";
import { CCRE_ASSAYS } from "common/assays";
import { formatAssay } from "common/assays";
import type { AssayTableProps } from "./types";

const makeColumnVisibiltyModel = (assay: CcreAssay): GridColumnVisibilityModel => {
  const hidden = { ontology: false, sampleType: false, lifeStage: false, tf: false };
  CCRE_ASSAYS.forEach((x) => {
    if (x !== assay) Object.defineProperty(hidden, x, { value: false, enumerable: true });
  });
  return hidden;
};

const AssayTable = ({ rows, columns, assay, entityID, tableProps }: AssayTableProps) => {
  // Update column visibility when assay changes
  useEffect(() => {
    if (!tableProps.apiRef.current) return;
    tableProps.apiRef.current.setColumnVisibilityModel(makeColumnVisibiltyModel(assay));
  }, [tableProps.apiRef, assay]);

  return (
    <Table
      {...tableProps}
      columns={columns}
      label={`${entityID} ${formatAssay(assay)} z-scores`}
      rows={rows}
      loading={!rows}
      initialState={{
        ...tableProps.initialState,
        columns: { columnVisibilityModel: makeColumnVisibiltyModel(assay) },
      }}
    />
  );
};

export default AssayTable;
