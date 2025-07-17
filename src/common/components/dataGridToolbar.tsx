import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid-pro";

import { Typography } from "@mui/material";
import { ReactNode } from "react";

export type CustomDataGridToolbarProps = {
  /**
   * Optional ReactNode to be used in the table toolbar. Strings and numbers will be rendered as Typography variant h6.
   */
  title?: ReactNode;
};

export default function CustomDataGridToolbar({ title }: CustomDataGridToolbarProps) {
  return (
    <GridToolbarContainer sx={{ p: 1, justifyContent: "space-between" }}>
      {title && (typeof title === "string" || typeof title === "number") ? (
        <Typography variant={"h6"}>{title}</Typography>
      ) : (
        title
      )}
      <div>
        <GridToolbarQuickFilter sx={{ mr: 1 }} />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: "Export data" },
            button: { variant: "text" },
          }}
        />
      </div>
    </GridToolbarContainer>
  );
}
