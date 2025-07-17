import { Circle, Line, Polygon } from "@visx/shape";
import { LDSCDataPoint } from "./page";
import { AxisLeft } from "@visx/axis";
import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { Text } from "@visx/text";
import { MouseEvent } from "react";
import { toScientificNotationElement } from "../../common/utility";
import { getCellCategoryDisplayname, getCellCategoryColor } from "common/utility";

type Props = {
  width: string;
  height: string;
  data: LDSCDataPoint[];
  pValCutoff: number;
  stimView: "S" | "U" | "B";
  legendEntries: { label: string; value: string; color: string }[];
  rotate?: boolean;
  svgRef: React.RefObject<SVGSVGElement>;
};

interface TooltipData {
  biosampleid: string;
  lineage: string;
  celltype: string;
  enrichment: number;
  enrichmentP: number;
  enrichmentStdErr: number;
  percentageSNPs: number;
}

export default function LDSCplot({
  width,
  height,
  data,
  pValCutoff,
  stimView,
  legendEntries,
  rotate,
  svgRef,
}: Props) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } =
    useTooltip<TooltipData>();

  const handleHover = (
    event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>,
    point: LDSCDataPoint,
    index: number
  ) => {
    if (rotate) return; // don't show tooltip on rotated plot
    const info = {
      biosampleid: point.biosampleid || "Baseline",
      lineage: getCellCategoryDisplayname(point.lineage),
      celltype: point.celltype,
      enrichment: point.enrichment,
      enrichmentP: point.enrichment_p,
      enrichmentStdErr: point.enrichment_std_error,
      percentageSNPs: point.snps,
    };

    const tooltip = {
      tooltipTop: event.pageY,
      tooltipLeft: event.pageX,
      tooltipData: info,
    };

    showTooltip(tooltip);

    // Handle hover effects
    event.currentTarget.setAttribute("stroke", "black");
    event.currentTarget.setAttribute("transform", "scale(1.5)");
    document.getElementById(`stdErr-${index}`).setAttribute("stroke", "black");
  };

  const handleLeaveHover = (
    event: MouseEvent<SVGPolygonElement | SVGCircleElement, globalThis.MouseEvent>,
    index: number
  ) => {
    hideTooltip();
    event.currentTarget.setAttribute("stroke", "none");
    event.currentTarget.setAttribute("transform", "scale(1)");
    document.getElementById(`stdErr-${index}`).setAttribute("stroke", "none");
  };

  const WIDTH = 1200;
  const HEIGHT = 400;
  const spaceForAxis = 70;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 20;
  const plotWidth = WIDTH - spaceForAxis - paddingRight;
  const plotHeight = HEIGHT - paddingTop - paddingBottom;
  const dataPaddingLeft = 20;
  const dataPaddingTopBottom = 15;

  //Input to this will be the order of the celltype according to known order. Output is its position on the x axis
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, data.length],
        range: [dataPaddingLeft, plotWidth], //Start at 20 to provide left side padding to data points
      }),
    [plotWidth, data]
  );

  const dataMin: number = Math.min(...data.map((x) => x.enrichment));
  const dataMax: number = Math.max(...data.map((x) => x.enrichment));

  //Input to this is the enrichment value of a point. Output is its vertical position on the scale
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [dataMin - dataPaddingTopBottom, dataMax + dataPaddingTopBottom],
        range: [plotHeight, 0],
      }),
    [dataMin, dataMax, plotHeight]
  );

  return (
    <div
      style={{
        width: rotate ? height : width,
        height: rotate ? width : height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={
          rotate
            ? {
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) rotate(90deg)",
                transformOrigin: "center center",
              }
            : {}
        }
      >
        <rect width={width} height={height} rx={14} fill="none" stroke="transparent" />
        <Group top={paddingTop} left={spaceForAxis}>
          <Line stroke="black" opacity={0.3} from={{ x: 0, y: yScale(0) }} to={{ x: plotWidth, y: yScale(0) }} />
          <Line
            from={{ x: xScale(736), y: 0 }}
            to={{ x: xScale(736), y: plotHeight }}
            stroke="#666"
            strokeDasharray="4,4"
            opacity={0.5}
          />
          <AxisLeft label="Heritability Enrichment" labelProps={{ fontSize: 14 }} scale={yScale} />
          {data.map((point, i) => {
            const stimulated = point.stimulation === "stimulated";
            // Passes p-val cutoff and is correct stimulation
            const toBeShown =
              point.enrichment_p <= pValCutoff &&
              ((stimView === "S" && stimulated) || (stimView === "U" && !stimulated) || stimView === "B");

            const commonProps = {
              opacity: toBeShown ? 1 : 0.1,
              fill: getCellCategoryColor(point.lineage),
              style: {
                // i for points with no biosampleorder (baseline
                transformOrigin: `${xScale(point.biosampleorder || i)}px ${yScale(point.enrichment)}px`,
                cursor: "pointer", // Add cursor pointer to indicate interactivity
              },
              onMouseOver: (event) => handleHover(event, point, i),
              onMouseLeave: (event) => handleLeaveHover(event, i),
            };

            return (
              <Group key={`datapoint-${i}`}>
                {/* Standard error */}
                <Group id={`stdErr-${i}`}>
                  <Line
                    from={{ x: xScale(i), y: yScale(point.enrichment - point.enrichment_std_error) }}
                    to={{ x: xScale(i), y: yScale(point.enrichment + point.enrichment_std_error) }}
                  />
                  <Line
                    from={{ x: xScale(i - 2), y: yScale(point.enrichment - point.enrichment_std_error) }}
                    to={{ x: xScale(i + 2), y: yScale(point.enrichment - point.enrichment_std_error) }}
                  />
                  <Line
                    from={{ x: xScale(i - 2), y: yScale(point.enrichment + point.enrichment_std_error) }}
                    to={{ x: xScale(i + 2), y: yScale(point.enrichment + point.enrichment_std_error) }}
                  />
                </Group>
                {/* Datapoint */}
                {stimulated ? (
                  <Polygon
                    center={{ x: xScale(i), y: yScale(point.enrichment) }}
                    sides={3}
                    size={6}
                    rotate={90}
                    {...commonProps}
                  />
                ) : (
                  <Circle r={5} cx={xScale(i)} cy={yScale(point.enrichment)} {...commonProps} />
                )}
              </Group>
            );
          })}
        </Group>

        <Text x={WIDTH - 10} y={20} textAnchor="end" fontSize={12}>
          * Colors represent lineage, hovering shows standard error
        </Text>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultTooltipStyles,
            backgroundColor: "#283238",
            color: "white",
            position: "fixed",
          }}
        >
          <div style={{ maxWidth: "20rem" }}>
            {tooltipData.biosampleid !== "Baseline" && (
              <p>
                <b>Biosample:</b> {tooltipData.biosampleid}
              </p>
            )}
            {tooltipData.biosampleid !== "Baseline" && (
              <p>
                <b>Lineage:</b> {tooltipData.lineage}
              </p>
            )}
            <p>
              <b>Celltype:</b> {tooltipData.celltype}
            </p>
          </div>
          <br />
          <div>
            <p>
              <b>Enrichment:</b> {tooltipData.enrichment.toFixed(2)}
            </p>
          </div>
          <div>
            <p>
              <b>
                Enrichment <i>P</i> :
              </b>{" "}
              {toScientificNotationElement(tooltipData.enrichmentP, 2, {variant: "body2"})}
            </p>
          </div>
          <div>
            <p>
              <b>Enrichment Std Error:</b> {tooltipData.enrichmentStdErr.toFixed(2)}
            </p>
          </div>
          <div>
            <p>
              <b>Percentage of SNPs:</b> {tooltipData.percentageSNPs.toPrecision(2)}
            </p>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
}

// {legendEntries && legendEntries.length > 0 && (
//   <Box display="flex" justifyContent="space-between">
//     {Array.from({ length: 5 }).map((_, colIndex) => (
//       <Box key={colIndex} display="flex" flexDirection="column" gap={1}>
//         {legendEntries
//           .filter((_, idx) => idx % 5 === colIndex)
//           .map((entry, i) => (
//             <Box key={i} display="flex" alignItems="center" gap={1}>
//               <Box sx={{ width: "12px", height: "12px", backgroundColor: entry.color }} />
//               <Typography variant="body2">
//                 {entry.label} : {entry.value}
//               </Typography>
//             </Box>
//           ))}
//       </Box>
//     ))}
//   </Box>
// )}
