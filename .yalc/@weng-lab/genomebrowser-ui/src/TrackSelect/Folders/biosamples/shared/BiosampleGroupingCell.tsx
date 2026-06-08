import { Stack, Tooltip, Box, IconButton } from "@mui/material";
import {
  GridRenderCellParams,
  useGridApiContext,
  GridGroupNode,
} from "@mui/x-data-grid-premium";
import { assayTypes, AssayIcon } from "./constants";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * Biosample-specific grouping cell that renders AssayIcon for assay groups/values.
 * Handles expand/collapse, truncation, and tooltips.
 */
export default function BiosampleGroupingCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const isGroup = params.rowNode.type === "group";
  const groupNode = params.rowNode as GridGroupNode;
  const isExpanded = isGroup ? groupNode.childrenExpanded : false;
  const groupingField = isGroup ? groupNode.groupingField : null;
  const depth = params.rowNode.depth ?? 0;

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    apiRef.current.setRowChildrenExpansion(params.id, !isExpanded);
  };

  // Render content based on grouping field
  const renderContent = () => {
    const value = String(params.value ?? "");

    // For assay groups, show the colored icon
    if (isGroup && groupingField === "assay") {
      return (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flex: 1, overflow: "hidden" }}
        >
          {AssayIcon(value)}
          <Tooltip title={value} placement="top-start" enterDelay={500}>
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: "bold",
              }}
            >
              {params.formattedValue}
            </Box>
          </Tooltip>
        </Stack>
      );
    }

    // For other groups (ontology, displayName), show bold text
    if (isGroup) {
      return (
        <Tooltip title={value} placement="top-start" enterDelay={500}>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              fontWeight: "bold",
            }}
          >
            {params.formattedValue}
          </Box>
        </Tooltip>
      );
    }

    // For leaf rows - check if it's an assay value
    const isAssayValue = assayTypes
      .map((a) => a.toLowerCase())
      .includes(value.toLowerCase());

    if (isAssayValue) {
      return (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flex: 1, overflow: "hidden" }}
        >
          {AssayIcon(value)}
          <Tooltip title={value} placement="top-start" enterDelay={500}>
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.formattedValue}
            </Box>
          </Tooltip>
        </Stack>
      );
    }

    return (
      <Tooltip title={value} placement="top-start" enterDelay={500}>
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {params.formattedValue}
        </Box>
      </Tooltip>
    );
  };

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
      {renderContent()}
    </Box>
  );
}
