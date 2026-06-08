import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import {
  GridGroupNode,
  GridRenderCellParams,
  useGridApiContext,
} from "@mui/x-data-grid-premium";
import { isMohdOmeLabel, MohdOmeIcon } from "./config";

export function MohdGroupingCell(params: GridRenderCellParams) {
  const apiRef = useGridApiContext();
  const isGroup = params.rowNode.type === "group";
  const groupNode = params.rowNode as GridGroupNode;
  const isExpanded = isGroup ? groupNode.childrenExpanded : false;
  const groupingField = isGroup ? groupNode.groupingField : null;
  const depth = params.rowNode.depth ?? 0;
  const value = String(params.value ?? "");
  const showOmeIcon =
    (isGroup && groupingField === "ome") || isMohdOmeLabel(value);

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
        ml: depth * 2,
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
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ flex: 1, overflow: "hidden" }}
      >
        {showOmeIcon && <MohdOmeIcon type={value} />}
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
      </Stack>
    </Box>
  );
}
