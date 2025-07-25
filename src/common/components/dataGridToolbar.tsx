import { GridToolbarQuickFilter, GridToolbarExport } from "@mui/x-data-grid-pro";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Button } from "@mui/material";
export type CustomDataGridToolbarProps = {
  title?: ReactNode;
};

export default function CustomDataGridToolbar({ title }: CustomDataGridToolbarProps) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={1}
    >
      {title != null && (typeof title === "string" || typeof title === "number") ? (
        <Typography variant="h6">{title}</Typography>
      ) : (
        title
      )}
      <Box display="flex" alignItems="center">
      <Box sx={{ mr: 1 }}>
            <GridToolbarQuickFilter />
      </Box>

      <Button variant="text" color="primary">
  <GridToolbarExport />
</Button>
      </Box>
    </Box>
  );
}
