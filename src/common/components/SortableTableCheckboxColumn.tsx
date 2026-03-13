import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid-premium";
import { TableColDef } from "@weng-lab/ui-components";

//This is used to prevent sorting from happening when clicking on the header checkbox
export const StopPropagationWrapper: TableColDef["renderHeader"] = (params) => (
  <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
    <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
  </div>
);

export const sortableTableCheckboxColumn = {
  ...GRID_CHECKBOX_SELECTION_COL_DEF, //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
  sortable: true,
  hideable: false,
  renderHeader: StopPropagationWrapper,
} satisfies TableColDef;