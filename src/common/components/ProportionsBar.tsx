import React, { useMemo } from "react";
import { BarStack, BarStackHorizontal } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { useTooltip, defaultStyles, useTooltipInPortal } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { TooltipInPortalProps } from "@visx/tooltip/lib/hooks/useTooltipInPortal";

export const getProportionsFromArray = <T extends Record<K, string>, K extends string, V extends string>(
  /**
   * Array of objects to pull values from.
   */
  data: T[],
  /**
   * The field you want to count up. Should resolve to a string in the object.
   */
  field: K,
  /**
   * Optionally define the fields of the returned object.
   * If specified, only values exactly matching these fields will be counted.
   * Useful for getting 0 values in the returned object.
   */
  includeValues?: readonly V[]
) => {
  const counts: Record<string, number> = {};
  if (includeValues) {
    includeValues.forEach((val) => (counts[val] = 0));
    data?.forEach((entry) => {
      if (counts[entry[field]] !== undefined) {
        counts[entry[field]]++;
      }
    });
    return counts as Record<V, number>;
  } else {
    data?.forEach((entry) => {
      counts[entry[field]] ? counts[entry[field]]++ : (counts[entry[field]] = 1);
    });
    return counts as Record<T[K], number>;
  }
};

/**
 * Sorts an object of numeric values in descending order by value.
 * 
 * @param obj - An object with string keys and number values
 * @returns A new object with the same entries sorted by value (descending)
 */
export function sortObjectByValueDesc(
  obj: Record<string, number>
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(obj).sort(([, a], [, b]) => b - a)
  );
}

export type ProportionBarProps<K extends string> = {
  data: Record<K, number>;
  width: number;
  height: number;
  orientation: "vertical" | "horizontal";
  tooltipTitle: string;
  getColor: (key: K) => string;
  /**
   * By default this component keeps original insertion order, set this to sort descending.
   */
  sortDescending?: boolean;
  formatLabel?: (key: K) => string;
  /**
   * applied to wrapper div
   */
  style?: React.CSSProperties;
};

export const ProportionsBar = <K extends string>({
  data,
  width,
  height,
  orientation,
  tooltipTitle,
  sortDescending = false,
  getColor,
  formatLabel,
  style,
}: ProportionBarProps<K>) => {
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  const plotData = useMemo(() => sortDescending ? sortObjectByValueDesc(data) : data, [data, sortDescending])

  //Fix weird type error on build
  //Type error: 'TooltipInPortal' cannot be used as a JSX component.
  const TooltipComponent = TooltipInPortal as unknown as React.FC<TooltipInPortalProps>;

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<ProportionBarProps<K>["data"]>();

  const totalCount = (Object.values(plotData) as number[]).reduce((prev, curr) => prev + curr, 0);

  const barLengthScale = scaleLinear<number>({
    domain: [0, totalCount],
    range: orientation === "vertical" ? [height, 0] : [0, width],
  });

  //Not actually using since this is only a single bar
  const uselessScale = scaleBand<string>({
    domain: [""],
    range: [0, 0],
  });

  const handleMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const coords = localPoint(event, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: plotData,
    });
  };

  const sharedProps = useMemo(
    () => ({
      data: [plotData],
      keys: Object.keys(plotData),
      color: getColor,
    }),
    [plotData, getColor]
  );

  const hitboxPadding = 10;

  return (
    <div style={{ position: "relative", width, height, ...style }} ref={containerRef}>
      <svg width={width} height={height} style={{ display: "block" }}>
        {orientation === "vertical" ? (
          <BarStack {...sharedProps} xScale={uselessScale} yScale={barLengthScale} x={() => ""} width={width} />
        ) : (
          <BarStackHorizontal
            {...sharedProps}
            xScale={barLengthScale}
            yScale={uselessScale}
            y={() => ""}
            height={height}
          />
        )}
      </svg>
      {/* Expand mouse over area since the bar is small */}
      <div
        style={{
          position: "absolute",
          left: -hitboxPadding,
          top: -hitboxPadding,
          width: width + hitboxPadding * 2,
          height: height + hitboxPadding * 2,
          zIndex: 2,
          background: "transparent",
        }}
        onMouseMove={(e) => handleMouseOver(e)}
        onMouseLeave={hideTooltip}
      />
      {tooltipOpen && (
        <TooltipComponent top={tooltipTop} left={tooltipLeft} style={{ zIndex: 1000, ...defaultStyles }}>
          <Typography>{tooltipTitle}</Typography>
          <Table size="small">
            <TableBody>
              {(Object.keys(plotData) as K[]).map((key, i) => {
                const value = plotData[key];
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          marginRight: 6,
                          borderRadius: "50%",
                          backgroundColor: getColor(key),
                        }}
                      />
                      {formatLabel ? formatLabel(key) : key}
                    </TableCell>
                    <TableCell align="right">{value}</TableCell>
                    <TableCell align="right">{((value / totalCount) * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TooltipComponent>
      )}
    </div>
  );
};
