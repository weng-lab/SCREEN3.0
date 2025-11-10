import { Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@weng-lab/ui-components";
import { GROUP_COLOR_MAP } from "common/colors";
import { LinkComponent } from "./LinkComponent";

export const classificationFormatting: Partial<GridColDef> = {
  renderCell: (params: GridRenderCellParams) => {
    const group = params.value;
    const colormap = GROUP_COLOR_MAP.get(group);
    const color = colormap ? (group === "InActive" ? "gray" : colormap.split(":")[1]) : "#06da93";
    const classification = colormap ? colormap.split(":")[0] : "DNase only";
    return (
      <Tooltip
        title={
          <div>
            See{" "}
            <LinkComponent
              openInNewTab
              color="inherit"
              showExternalIcon
              href="https://screen.wenglab.org/about#classifications"
            >
              SCREEN
            </LinkComponent>{" "}
            for Class definitions
          </div>
        }
      >
        <span style={{ color }}>
          <strong>{classification}</strong>
        </span>
      </Tooltip>
    );
  },
};
