import { Table } from "@weng-lab/ui-components";
import { GridColumnVisibilityModel } from "@mui/x-data-grid-premium";
import { CCRE_ASSAYS } from "common/assays";
import { formatAssay } from "common/assays";
import type { AssayTableProps } from "./types";

/** Every assay's own column starts hidden: the one in view shows as the score column - see AssayView. */
const COLUMN_VISIBILITY: GridColumnVisibilityModel = {
  ontology: false,
  sampleType: false,
  lifeStage: false,
  tf: false,
  ...Object.fromEntries(CCRE_ASSAYS.map((assay) => [assay, false])),
};

const AssayTable = ({ rows, columns, assay, entityID, tableProps }: AssayTableProps) => (
  <Table
    {...tableProps}
    columns={columns}
    label={`${entityID} ${formatAssay(assay)} z-scores`}
    rows={rows}
    loading={!rows}
    initialState={{
      ...tableProps.initialState,
      columns: { columnVisibilityModel: COLUMN_VISIBILITY },
    }}
  />
);

export default AssayTable;
