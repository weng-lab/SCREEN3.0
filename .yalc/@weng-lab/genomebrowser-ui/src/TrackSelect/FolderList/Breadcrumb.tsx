import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FolderDefinition } from "../Folders/types";

export interface BreadcrumbProps {
  currentFolder: FolderDefinition | null;
  onNavigateToRoot: () => void;
}

export function Breadcrumb({
  currentFolder,
  onNavigateToRoot,
}: BreadcrumbProps) {
  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      {currentFolder ? (
        <Link
          component="button"
          variant="body1"
          onClick={onNavigateToRoot}
          underline="hover"
          sx={{ cursor: "pointer" }}
        >
          All Folders
        </Link>
      ) : (
        <Typography variant="body1" color="text.primary">
          All Folders
        </Typography>
      )}
      {currentFolder && (
        <Typography variant="body1" color="text.primary">
          {currentFolder.label}
        </Typography>
      )}
    </Breadcrumbs>
  );
}
