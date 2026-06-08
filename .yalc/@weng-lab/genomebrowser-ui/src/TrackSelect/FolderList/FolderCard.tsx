import { Paper, Typography } from "@mui/material";
import { FolderDefinition } from "../Folders/types";

export interface FolderCardProps {
  folder: FolderDefinition;
  onClick: () => void;
}

export function FolderCard({ folder, onClick }: FolderCardProps) {
  return (
    <Paper
      elevation={1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      sx={{
        p: 3,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          elevation: 3,
          boxShadow: 3,
          bgcolor: "action.hover",
        },
        "&:focus": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {folder.label}
      </Typography>
      {folder.description && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {folder.description}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary">
        {folder.rows.length.toLocaleString()} tracks available
      </Typography>
    </Paper>
  );
}
