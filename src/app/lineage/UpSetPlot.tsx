import React, { useMemo } from "react";
import { Bar, Circle } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { JoinFull } from "@mui/icons-material";
import { defaultStyles as defaultTooltipStyles, useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { GetIcreCountsQuery } from "types/generated/graphql";

export type UpSetPlotDatum = GetIcreCountsQuery["upsetploticrecounts"][number]

export type BarsProps = {
  width: number;
  height: number;
  data: UpSetPlotDatum[];
  onBarClicked?: (grouping: UpSetPlotDatum & {unionCelltypes?: string[]}) => void;
  reference?: React.LegacyRef<SVGSVGElement>;
  loadingDownload?: boolean;
};

interface TooltipData {
  message: string;
  count: number;
}

/**
 * @todo this needs to be cleaned up if being put in component library. 
 * stuff like `index * fontSize * 1.5 + 0.5 * fontSize * 1.5` isn't great
 */

export default function UpSetPlot({
  width,
  height,
  data,
  onBarClicked = () => {},
  reference = null,
  loadingDownload = false,
}: BarsProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip, updateTooltip } =
    useTooltip<TooltipData>();

  // const { parentRef, width: parentWidth, height: parentHeight } = useParentSize()

  const celltypes: string[] = [...new Set(data.flatMap((x) => [...x.includedCelltypes, ...x.excludedCelltypes]))];
  /**
   * Sorted Individual Cell Set Sizes
   */
  const setSizes: { name: string; count: number }[] = celltypes
    .map((celltype) => {
      return {
        name: celltype,
        count: data.reduce((prev, curr) => {
          if (curr.includedCelltypes.some((x) => x === celltype)) {
            return prev + curr.count;
          } else return prev;
        }, 0),
      };
    })
    .sort((a, b) => b.count - a.count);

  const orderedCelltypes = setSizes.map((x) => x.name);

  const totalUnionSize = data.reduce((prev, curr) => prev + curr.count, 0);
  //Add unique id to access scale, also sort descending
  const intersectionData = [...data]
    .sort((a, b) => b.count - a.count)
    .map((x, i) => {
      return { ...x, id: i.toString() };
    });

  const fontSize = 14;
  let intersectionCountsFontSize = 14;

  // end dimensions of the plot
  const totalWidth = width;
  const totalHeight = height;

  let setSizePlotTotalWidth: number;
  switch (celltypes.length) {
    case 1:
      setSizePlotTotalWidth = totalWidth * 0.45;
      break;
    case 2:
      setSizePlotTotalWidth = totalWidth * 0.45;
      break;
    case 3:
      setSizePlotTotalWidth = totalWidth * 0.45;
      break;
    case 4:
      setSizePlotTotalWidth = totalWidth * 0.375;
      break;
    case 5:
      setSizePlotTotalWidth = totalWidth * 0.325;
      intersectionCountsFontSize = 12;
      break;
    case 6:
      setSizePlotTotalWidth = totalWidth * 0.275;
      intersectionCountsFontSize = 7;
      break;
  }
  const spaceForCellName = 100;
  const spaceForCellCounts = 80;
  const setSizePlotBarsWidth = setSizePlotTotalWidth - spaceForCellName - spaceForCellCounts;
  const spaceForTextRight = 15;
  const intersectionPlotWidth = totalWidth - setSizePlotTotalWidth - spaceForTextRight;

  // Intersection plot width scale based on width available to it
  const intersectionPlotWidthScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, intersectionPlotWidth],
        round: true,
        domain: intersectionData.map((x) => x.id),
        padding: 0.4,
      }),
    [intersectionPlotWidth, intersectionData]
  );

  const spaceForBottomAxis = 40;
  const setSizePlotBarsHeight = fontSize * 1.5 * celltypes.length;

  const setSizePlotTotalHeight = setSizePlotBarsHeight + spaceForBottomAxis;
  const spaceForTextTop = 60;
  const intersectionPlotBarsHeight = totalHeight - setSizePlotTotalHeight - spaceForTextTop;
  const intersectionPlotTotalHeight = intersectionPlotBarsHeight + spaceForTextTop;

  const intersectionPlotHeightScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [intersectionPlotBarsHeight, 0],
        round: true,
        domain: [0, Math.max(...intersectionData.map((x) => x.count))],
      }),
    [intersectionPlotBarsHeight, intersectionData]
  );

  const setSizePlotWidthScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [setSizePlotBarsWidth, 0],
        round: true,
        domain: [0, Math.max(...setSizes.map((x) => x.count))],
      }),
    [setSizePlotBarsWidth, setSizes]
  );

  const setSizePlotHeightScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, setSizePlotBarsHeight],
        round: true,
        domain: setSizes.map((x) => x.name),
        paddingInner: 0.4,
        paddingOuter: 0.2,
      }),
    [setSizePlotBarsHeight, setSizes]
  );

  return totalWidth < 10 ? null : (
    <>
      <svg
        fontSize={fontSize}
        id="UpSet-Plot"
        width="100%"
        style={{ height: 'auto', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        ref={reference}
      >
        {/* <rect width={totalWidth} height={totalHeight} fill='none' stroke='black' fillOpacity={0.5} rx={8}  /> */}
        <Group
          top={30}
          left={30}
          cursor="pointer"
          onClick={() => onBarClicked({ unionCelltypes: celltypes })}
          onMouseMove={(event) => {
            showTooltip({
              tooltipTop: event.pageY,
              tooltipLeft: event.pageX,
              tooltipData: {
                message: "Total Union Size",
                count: totalUnionSize,
              },
            });
          }}
          onMouseLeave={() => {
            hideTooltip();
          }}
        >
          <JoinFull inheritViewBox />
          <text>
            <tspan x={25} y={17}>
              Total Union Size:
            </tspan>
            <tspan x={25} y={17} dy={16}>
              {totalUnionSize.toLocaleString()}
            </tspan>
          </text>
        </Group>
        {loadingDownload && (
          <Group top={25} left={totalWidth - 10}>
            <Text textAnchor="end">Generating File...</Text>
          </Group>
        )}
        {/* The set size plot */}
        <Group left={0} top={intersectionPlotTotalHeight}>
          <AxisBottom
            left={spaceForCellCounts}
            top={setSizePlotBarsHeight}
            scale={setSizePlotWidthScale}
            label="Set Size"
            numTicks={1}
          />
          <GridColumns
            left={spaceForCellCounts}
            top={0}
            scale={setSizePlotWidthScale}
            height={setSizePlotBarsHeight}
            tickValues={[0, 100000]}
            stroke="#e0e0e0"
          />
          {setSizes.map((d, i) => {
            const barWidth = setSizePlotBarsWidth - (setSizePlotWidthScale(d.count) ?? 0);
            const barHeight = setSizePlotHeightScale.bandwidth();
            const barX = (setSizePlotWidthScale(d.count) ?? 0) + spaceForCellCounts;
            const barY = setSizePlotHeightScale(d.name);
            return (
              <Group key={`Group-${d.name}`}>
                {/* Shading bar */}
                {i % 2 === 1 && (
                  <Bar
                    y={barY - 0.5 * ((1 - setSizePlotHeightScale.padding()) * barHeight)}
                    x={spaceForTextRight}
                    width={totalWidth - 2 * spaceForTextRight}
                    height={barHeight + (1 - setSizePlotHeightScale.padding()) * barHeight}
                    fill="#eeeeee"
                  />
                )}
                <Group
                  onClick={() => onBarClicked({ includedCelltypes: [d.name] })}
                  onMouseMove={(event) => {
                    showTooltip({
                      tooltipTop: event.pageY,
                      tooltipLeft: event.pageX,
                      tooltipData: {
                        message: d.name,
                        count: d.count,
                      },
                    });
                  }}
                  onMouseLeave={() => {
                    hideTooltip();
                  }}
                  cursor="pointer"
                >
                  <Text textAnchor="end" verticalAnchor="middle" x={barX} dx={-4} y={barY} dy={0.5 * barHeight}>
                    {d.count.toLocaleString()}
                  </Text>
                  <Bar x={barX} y={barY} width={barWidth} height={barHeight} fill="black" />
                  <Text
                    textAnchor="end"
                    verticalAnchor="middle"
                    x={setSizePlotTotalWidth}
                    y={barY}
                    dy={0.5 * barHeight}
                  >
                    {d.name.length > 12
                      ? d.name.substring(0, 9).replaceAll("_", " ") + "..."
                      : d.name.replaceAll("_", " ")}
                  </Text>
                  {/* this expands clickable area for download */}
                  <rect x={spaceForTextRight} y={barY} width={setSizePlotTotalWidth} height={barHeight} fill="none" />
                </Group>
              </Group>
            );
          })}
        </Group>
        {/* The intersection plot and circles */}
        <Group left={setSizePlotTotalWidth} top={spaceForTextTop}>
          <AxisLeft label="Intersection Size" scale={intersectionPlotHeightScale} labelOffset={45} />
          <GridRows
            scale={intersectionPlotHeightScale}
            width={intersectionPlotWidth}
            height={intersectionPlotBarsHeight}
            stroke="#e0e0e0"
          />
          {intersectionData.map((d) => {
            const barWidth = intersectionPlotWidthScale.bandwidth();
            const barHeight = intersectionPlotBarsHeight - (intersectionPlotHeightScale(d.count) ?? 0);
            const barX = intersectionPlotWidthScale(d.id);
            const barY = intersectionPlotHeightScale(d.count) ?? 0;
            const halfBarWidth = barWidth / 2;
            const circleRadius = Math.min(halfBarWidth, fontSize * 0.6);
            const connectingBarWidth = circleRadius / 3;
            return (
              <Group
                key={`Group-${d.id}`}
                onClick={() => onBarClicked(d)}
                cursor="pointer"
                onMouseMove={(event) => {
                  showTooltip({
                    tooltipTop: event.pageY,
                    tooltipLeft: event.pageX,
                    tooltipData: {
                      message: `${"Intersecting: " + d.includedCelltypes.join(", ")} ${
                        d.excludedCelltypes.length > 0 ? "\nExcluding: " + d.excludedCelltypes.join(", ") : ""
                      }`,
                      count: d.count,
                    },
                  });
                }}
                onMouseLeave={() => {
                  hideTooltip();
                }}
              >
                <Group>
                  <Text x={barX + halfBarWidth} y={barY - 5} angle={315} fontSize={intersectionCountsFontSize}>
                    {d.count.toLocaleString()}
                  </Text>
                  <Bar x={barX} y={barY} width={barWidth} height={barHeight} fill="black" />
                </Group>
                {/* this expands clickable area for download */}
                <rect x={barX} y={barY} width={barWidth} height={barHeight + setSizePlotBarsHeight} fill="none" />
                {setSizes.map((set, index) => (
                  <Circle
                    key={`circle-${index}`}
                    cx={barX + halfBarWidth}
                    cy={intersectionPlotBarsHeight + index * fontSize * 1.5 + 0.5 * fontSize * 1.5}
                    r={circleRadius}
                    fill={d.includedCelltypes.includes(set.name) ? "#000000" : "#bbbbbb"}
                  />
                ))}
                {/* If intersecting multiple cells, generate bar between first and last filled in circles */}
                {d.includedCelltypes.length > 1 && (
                  <Bar
                    x={barX + halfBarWidth - connectingBarWidth / 2}
                    //Set to begin at first intersection
                    y={
                      intersectionPlotBarsHeight +
                      Math.min(...d.includedCelltypes.map((x) => orderedCelltypes.indexOf(x))) * 1.5 * fontSize +
                      0.5 * 1.5 * fontSize
                    }
                    width={connectingBarWidth}
                    //height set to reach last intersection
                    height={
                      1.5 *
                      fontSize *
                      (Math.max(...d.includedCelltypes.map((x) => orderedCelltypes.indexOf(x))) -
                        Math.min(...d.includedCelltypes.map((x) => orderedCelltypes.indexOf(x))))
                    }
                    fill="black"
                  />
                )}
              </Group>
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: "#283238", color: "white" }}
        >
          {tooltipData.message.split("\n").map((line, i) => {
            return (
              <div key={i}>
                <p>{line}</p>
              </div>
            );
          })}
          <div>
            <p>Count: {tooltipData.count.toLocaleString()}</p>
          </div>
          <div>
            <p>Click to download set (.BED)</p>
          </div>
        </TooltipWithBounds>
      )}
    </>
  );
}
