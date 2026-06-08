import { Tooltip, Box, IconButton } from "@mui/material";
import {
  GridRenderCellParams,
  useGridApiContext,
  GridGroupNode,
} from "@mui/x-data-grid-premium";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * Default grouping cell that handles expand/collapse, truncation, and tooltips.
 * This is a generic implementation without any folder-specific logic.
 */
export function DefaultGroupingCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const isGroup = params.rowNode.type === "group";
  const groupNode = params.rowNode as GridGroupNode;
  const isExpanded = isGroup ? groupNode.childrenExpanded : false;
  const depth = params.rowNode.depth ?? 0;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    apiRef.current.setRowChildrenExpansion(params.id, !isExpanded);
  };

  const value = String(params.value ?? "");

  // Indent based on depth (2 units per level)
  const indentLevel = depth * 2;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        ml: indentLevel,
      }}
    >
      {isGroup && (
        <IconButton size="small" onClick={handleExpandClick} sx={{ mr: 0.5 }}>
          {isExpanded ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </IconButton>
      )}
      <Tooltip title={value} placement="top-start" enterDelay={500}>
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            fontWeight: isGroup ? "bold" : undefined,
          }}
        >
          {params.formattedValue}
        </Box>
      </Tooltip>
    </Box>
  );
}
