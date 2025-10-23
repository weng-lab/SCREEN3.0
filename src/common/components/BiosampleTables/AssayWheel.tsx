import { useState, useMemo } from "react";
import { Tooltip, Stack, Typography } from "@mui/material";
import { Launch } from "@mui/icons-material";
import { Assay } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_cCRE/BiosampleActivity";
import { assayColors, assayHoverInfo } from "common/components/BiosampleTables/helpers";

export type AssayWheelProps = {
  /**
   * The value of the assay should be the experiment accession if the assay exists for that sample
   */
  row: { [key in Assay]: string | null };
};

/**
 *
 * @prop row
 * @returns the assay wheel for the row
 */
export const AssayWheel = ({ row }: AssayWheelProps) => {
  const [hoveredAssay, setHoveredAssay] = useState<Assay>(null);

  const height = 36;

  //Constants used for sizing svg elements
  const radius = 8;
  const radiusHovered = 9; //If assay is hovered, bump up the radius to create the "poking out" effect
  const fifth = (2 * Math.PI * radius) / 5;
  const fifthHovered = (2 * Math.PI * radiusHovered) / 5;

  const assays: {
    id: Assay;
    accession: string;
    color: string;
    dashArray: string;
    radius: number;
  }[] = useMemo(() => {
    return [
      {
        id: "dnase",
        accession: row.dnase, //Used to provide link to ENCODE for that experiment
        color: row.dnase ? assayColors.DNase : "transparent", //Only color slice if the biosample has data in that assay
        dashArray: hoveredAssay === "dnase" ? `${fifthHovered} ${fifthHovered * 4}` : `${fifth} ${fifth * 4}`, //Use dasharray to create a single slice of 1/5th of the circle.
        radius: hoveredAssay === "dnase" ? radiusHovered : radius,
      },
      {
        id: "h3k27ac",
        accession: row.h3k27ac,
        color: row.h3k27ac ? assayColors.H3K27ac : "transparent",
        dashArray:
          hoveredAssay === "h3k27ac"
            ? `0 ${fifthHovered} ${fifthHovered} ${fifthHovered * 3}`
            : `0 ${fifth} ${fifth} ${fifth * 3}`,
        radius: hoveredAssay === "h3k27ac" ? radiusHovered : radius,
      },
      {
        id: "h3k4me3",
        accession: row.h3k4me3,
        color: row.h3k4me3 ? assayColors.H3K4me3 : "transparent",
        dashArray:
          hoveredAssay === "h3k4me3"
            ? `0 ${fifthHovered * 2} ${fifthHovered} ${fifthHovered * 2}`
            : `0 ${fifth * 2} ${fifth} ${fifth * 2}`,
        radius: hoveredAssay === "h3k4me3" ? radiusHovered : radius,
      },
      {
        id: "ctcf",
        accession: row.ctcf,
        color: row.ctcf ? assayColors.CTCF : "transparent",
        dashArray:
          hoveredAssay === "ctcf"
            ? `0 ${fifthHovered * 3} ${fifthHovered} ${fifthHovered * 1}`
            : `0 ${fifth * 3} ${fifth} ${fifth * 1}`,
        radius: hoveredAssay === "ctcf" ? radiusHovered : radius,
      },
      {
        id: "atac",
        accession: row.atac,
        color: row.atac ? assayColors.ATAC : "transparent",
        dashArray: hoveredAssay === "atac" ? `0 ${fifthHovered * 4} ${fifthHovered}` : `0 ${fifth * 4} ${fifth}`,
        radius: hoveredAssay === "atac" ? radiusHovered : radius,
      },
    ];
  }, [row.dnase, row.h3k27ac, row.h3k4me3, row.ctcf, row.atac, hoveredAssay, fifthHovered, fifth]);

  return (
    <Tooltip
      title={
        <Stack spacing={1}>
          <Typography variant="body2">
            {assayHoverInfo({
              dnase: !!row.dnase,
              atac: !!row.atac,
              ctcf: !!row.ctcf,
              h3k27ac: !!row.h3k27ac,
              h3k4me3: !!row.h3k4me3,
            })}
          </Typography>
          {hoveredAssay && (
            <>
              <Typography variant="body2">Click to view {hoveredAssay} experiment:</Typography>
              <Stack direction="row" alignItems={"baseline"}>
                <Typography variant="body2">{row[hoveredAssay.toLowerCase()]}</Typography>
                <Launch fontSize="inherit" sx={{ ml: 0.5 }} />
              </Stack>
            </>
          )}
        </Stack>
      }
      arrow
      placement="right"
    >
      <svg height={height} width={height} viewBox={`0 0 ${height} ${height}`}>
        {/* Provides outline */}
        <circle
          r={2 * radius + 0.125}
          cx={height / 2}
          cy={height / 2}
          fill="#EEEEEE"
          stroke="black"
          strokeWidth={0.25}
        />
        {assays.map((assay) => (
          <circle
            key={assay.id}
            cursor={"pointer"}
            pointerEvents={"auto"}
            r={assay.radius}
            cx={height / 2}
            cy={height / 2}
            fill="transparent"
            stroke={assay.color}
            strokeWidth={hoveredAssay === assay.id ? 2 * radiusHovered : 2 * radius}
            strokeDasharray={assay.dashArray}
            onMouseEnter={() => setHoveredAssay(assay.id)}
            onMouseLeave={() => setHoveredAssay(null)}
            onClick={(event) => {
              event.stopPropagation();
              window.open(
                `https://www.encodeproject.org/experiments/${assay.accession}/`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          />
        ))}
        {/* Provides dead zone in middle to prevent ATAC wheel from capturing mouse events in center due to it being topmost element */}
        <circle r={radius} cx={height / 2} cy={height / 2} fill="white" stroke="black" strokeWidth={0.25} />
      </svg>
    </Tooltip>
  );
};
