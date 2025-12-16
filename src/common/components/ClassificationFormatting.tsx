import { Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@weng-lab/ui-components";
import { CCRE_CLASSES, CLASS_DESCRIPTIONS } from "common/consts";
import { LinkComponent } from "./LinkComponent";
import { CLASS_COLORS } from "common/colors";

export const ClassificationFormatting: Partial<GridColDef> = {
  type: "singleSelect",
  valueOptions: CCRE_CLASSES.map((group) => ({ value: group, label: CLASS_DESCRIPTIONS[group] })),
  renderCell: (params: GridRenderCellParams) => {
    const group = params.value;
    // Override the InActive color here since it's being used for coloring text and is too light
    const color = group === "InActive" ? CLASS_COLORS.noclass : CLASS_COLORS[group];
    const classification = CLASS_DESCRIPTIONS[group];
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
