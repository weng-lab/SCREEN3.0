import { Paper, Stack, Typography } from "@mui/material";
import { FolderDefinition } from "../Folders/types";
import { FolderCard } from "./FolderCard";

export interface FolderListProps {
  folders: FolderDefinition[];
  onFolderSelect: (folderId: string) => void;
}

export function FolderList({ folders, onFolderSelect }: FolderListProps) {
  if (folders.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          height: 500,
          borderWidth: 2,
        }}
      >
        <Typography color="text.secondary" sx={{ p: 3 }}>
          No folders available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        height: 500,
        overflow: "auto",
        borderWidth: 2,
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onClick={() => onFolderSelect(folder.id)}
          />
        ))}
      </Stack>
    </Paper>
  );
}
