import { useState } from "react";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { TableColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreClosestTSS } from "common/hooks/useCcreClosestTSS";
import { Assembly } from "common/types/globalTypes";

type TSSAnchor = "middleAnchor" | "edgeAnchor";

/**
 * Builds the "Nearest TSS" cCRE table column, backed by {@link useCcreClosestTSS}. The column's
 * tooltip exposes a toggle to measure distance from the middle of the cCRE body or its nearest
 * edge. State + data fetching live here so each table only needs one line to add the column.
 *
 * @param getAccession reads the cCRE accession off a row (differs per table, e.g. `row.accession`
 *   vs `row.ccre`)
 * @param assembly used for both the closest-TSS fetch and the gene links rendered in the cell
 */
export const useNearestTSSColumn = <T,>({
  accessions,
  assembly,
  getAccession,
}: {
  accessions: string[];
  assembly: Assembly;
  getAccession: (row: T) => string;
}): TableColDef<T> => {
  // Whether the nearest-TSS distance is measured from the middle of the cCRE body or its nearest edge
  const [tssAnchor, setTssAnchor] = useState<TSSAnchor>("middleAnchor");

  const { data: dataClosestTSS, loading: loadingClosestTSS } = useCcreClosestTSS({
    accessions,
    assembly,
    skip: accessions.length === 0,
  });

  return {
    field: "nearestTSS",
    headerName: "Nearest TSS",
    minWidth: 150,
    valueGetter: (_, row) => {
      const closest = dataClosestTSS?.[getAccession(row)]?.[tssAnchor];
      return closest ? `${closest.gene} - ${closest.distance.toLocaleString()} bp` : null;
    },
    sortComparator: (_v1, _v2, cellParams1, cellParams2) => {
      const rowA = cellParams1.api.getRow(cellParams1.id);
      const rowB = cellParams2.api.getRow(cellParams2.id);
      const distA = (rowA ? dataClosestTSS?.[getAccession(rowA)]?.[tssAnchor].distance : undefined) ?? Infinity;
      const distB = (rowB ? dataClosestTSS?.[getAccession(rowB)]?.[tssAnchor].distance : undefined) ?? Infinity;
      return distA - distB;
    },
    renderCell: (params) => {
      if (loadingClosestTSS) return <Skeleton variant="text" width={120} />;
      const closest = dataClosestTSS?.[getAccession(params.row)]?.[tssAnchor];
      if (!closest) return "—";
      return (
        <span>
          <LinkComponent href={`/${assembly}/gene/${closest.gene}`}>
            <i>{closest.gene}</i>
          </LinkComponent>
          &nbsp;- {closest.distance.toLocaleString()} bp
        </span>
      );
    },
    tooltip: (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="body2" gutterBottom>
          Distance to nearest TSS measured from the{" "}
          {tssAnchor === "middleAnchor" ? "middle of the cCRE" : "nearest edge of the cCRE"}.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{
            color: "common.white",
            borderColor: "common.white",
            "&:hover": {
              borderColor: "common.white",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
          onClick={() => setTssAnchor((prev) => (prev === "middleAnchor" ? "edgeAnchor" : "middleAnchor"))}
        >
          Measure from {tssAnchor === "middleAnchor" ? "nearest edge" : "middle"} instead
        </Button>
      </Box>
    ),
  };
};
