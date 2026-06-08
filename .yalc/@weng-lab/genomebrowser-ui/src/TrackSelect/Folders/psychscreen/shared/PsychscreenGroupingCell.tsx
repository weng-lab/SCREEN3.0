import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, IconButton, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  GridGroupNode,
  GridRenderCellParams,
  useGridApiContext,
} from "@mui/x-data-grid-premium";
import { getPsychscreenCategoryColor } from "./columns";

export function PsychscreenGroupingCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const isGroup = params.rowNode.type === "group";
  const groupNode = params.rowNode as GridGroupNode;
  const isExpanded = isGroup ? groupNode.childrenExpanded : false;
  const groupingField = isGroup ? groupNode.groupingField : null;
  const isCategoryGroup = groupingField === "category";
  const color = getPsychscreenCategoryColor(
    isCategoryGroup ? String(params.value ?? "") : params.row.category,
  );
  const label = String(params.formattedValue ?? params.value ?? "");
  const depth = params.rowNode.depth ?? 0;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    apiRef.current.setRowChildrenExpansion(params.id, !isExpanded);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: 1,
        ml: depth * 2,
      }}
    >
      {isGroup && (
        <IconButton size="small" onClick={handleExpandClick} sx={{ mr: 0.25 }}>
          {isExpanded ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </IconButton>
      )}
      {isCategoryGroup && (
        <Box
          sx={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            bgcolor: alpha(color, 0.65),
            flexShrink: 0,
          }}
        />
      )}
      <Tooltip title={label} placement="top-start" enterDelay={500}>
        <Box
          sx={{
            bgcolor: isCategoryGroup ? alpha(color, 0.06) : undefined,
            borderRadius: isCategoryGroup ? 1 : undefined,
            px: isCategoryGroup ? 0.75 : 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            fontWeight: isGroup ? 700 : undefined,
          }}
        >
          {label}
        </Box>
      </Tooltip>
    </Box>
  );
}
