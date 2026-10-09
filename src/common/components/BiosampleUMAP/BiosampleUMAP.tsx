import { useEffect, useId, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ChipLegend,
  ColorbarLegend,
  rampColor,
  sameRange,
  ScatterPlot,
  sweptValues,
  type ChartProps,
  type ColorRange,
  type DownloadPlotHandle,
  type Point,
  type RampKind,
  type RampRange,
  type RampStop,
} from "@weng-lab/visualization";
import {
  colorOf,
  legendGroups,
  shapeScaleOf,
  valueCounts,
  valueOf,
  type CategoryField,
  type ShapeScale,
} from "./fields";
import type { TableFilters } from "@weng-lab/ui-components";

/** A continuous value the points can be colored by, along a ramp with a colorbar in place of chips. */
export type RampColoring<T> = {
  /** In the Color By select, and what the colorbar is read out as. */
  label: string;
  /** The units the colorbar's ends are in, written before it: "Log₁₀(TPM + 1)". */
  unit?: string;
  /** A row's value, in the ramp's units. Null where it has none. */
  valueOf: (row: T) => number | null;
  stops: readonly RampStop[];
  kind?: RampKind;
  /** Where the colors stop until the reader moves them. */
  defaultRange: ColorRange;
  /** Whether the reader can move where the colors stop. */
  adjustable?: boolean;
  /** How the colorbar's ends are written. */
  format: (value: number) => string;
  /** How a sweep writes a point's own value, where it wants more precision than the ends. */
  formatValue?: (value: number) => string;
  /** What the range editor says about the scale. */
  notes?: string[];
  /** A value below which points take the neutral instead of a ramp color, and what the legend calls them. */
  cutoff?: { value: number; label: string };
  /** More controls, beside the selects while this colors the plot. */
  controls?: ReactNode;
};

/** Points with no value on the ramp. */
const NO_VALUE_COLOR = "#757575";
/**
 * Points below a ramp's cutoff: light, as they're most of an inactive cCRE's biosamples and the colored
 * few should stand out, but a step darker than a dimmed point.
 */
const BELOW_CUTOFF_COLOR = "#CCCCCC";

/** The Color By select's value for the ramp. A field's is its column. */
const RAMP = "ramp";
/** The Shape By select's value for no shapes. */
const NO_SHAPE = "none";

const MINIMAP_CONFIG = { position: { right: 50, bottom: 50 } };

/** Room for the plot's controls, which sit to the left of a square plot - see the plot's maxHeight. */
const CONTROLS_OFFSET = 65;

const MENU_PROPS = { disableScrollLock: true };

type PointMeta<T> = {
  row: T;
  /** Why the point is dimmed, if it is: the table doesn't list it, or a selection leaves it out. */
  faded: "unlisted" | "unselected" | null;
  /** Its value on the ramp coloring the plot, which a colorbar sweep matches. Null without one. */
  rampValue: number | null;
};

const FADED_NOTES = {
  unlisted: "Not listed in the table",
  unselected: "Not in the current selection",
};

/** "Sex", "Sex and search", "Sex, TPM and search". */
const listOf = (names: readonly string[]) =>
  names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

/** The part of a legend under the cursor: a chip, with the column it filters, or a stretch of the colorbar. */
type LegendHover =
  { kind: "group"; column: string; value: string } | { kind: "range"; sweep: RampRange; within: ColorRange };

export type BiosampleUMAPProps<T> = {
  /** Every row with a place on the UMAP. */
  rows: T[];
  /** A row's key, which `selected` and `isListed` go by. */
  keyOf: (row: T) => string;
  x: (row: T) => number;
  y: (row: T) => number;
  /** What the points can be colored and shaped by: a field with colors can color, one with an order can shape. */
  fields: CategoryField<T>[];
  /** A continuous coloring, first in the Color By select and the default. */
  ramp?: RampColoring<T>;
  /** What one point is, for the colorbar's counts: "experiment", "biosample". */
  noun: string;
  /** The table's filters, which the chips read and edit - useTablePlotSync's. */
  filters: TableFilters;
  /**
   * Whether the table lists a point, by its key: the filters' own isListed by default, for points keyed
   * by the table's row ids. A point standing for several rows - an experiment's replicates - is listed
   * where any of them is.
   */
  isListed?: (key: string) => boolean;
  /** The table's columns, whose headers name the filters no chip row shows. */
  columns?: readonly { field: string; headerName?: string }[];
  /** The selected rows' keys. The rest are dimmed while any are. */
  selected: ReadonlySet<string>;
  onPointClicked: (row: T) => void;
  /** Rows lassoed, less any the table doesn't list. */
  onLassoSelect: (rows: T[]) => void;
  tooltipBody: (row: T) => ReactNode;
  /** A point's radius, and a selected one's. */
  radius: { base: number; selected: number };
  loading: boolean;
  downloadFileName: string;
  animationGroupSize: number;
  initialState?: ChartProps<PointMeta<T>, true, false>["initialState"];
  ref?: Ref<DownloadPlotHandle>;
};

/**
 * A UMAP of biosamples or experiments beside their table, colored by a ramp or a field and optionally
 * shaped by another, with a legend for each.
 *
 * The legend and plot highlight each other: a hovered point rings its chips (scrolling them into view)
 * and marks its value on the colorbar, and a hovered chip or stretch of the colorbar spotlights its
 * points. Chips switch their value in and out of the table's filters, and whatever the table filters
 * out is dimmed rather than dropped, since a point's place means something beside the rest.
 */
const BiosampleUMAP = <T,>({
  rows,
  keyOf,
  x,
  y,
  fields,
  ramp,
  noun,
  filters,
  isListed = filters.isListed,
  columns = [],
  selected,
  onPointClicked,
  onLassoSelect,
  tooltipBody,
  radius,
  loading,
  downloadFileName,
  animationGroupSize,
  initialState,
  ref,
}: BiosampleUMAPProps<T>) => {
  const theme = useTheme();
  const colorFields = useMemo(() => fields.filter((field) => field.colorOf), [fields]);
  const [colorBy, setColorBy] = useState<string>(ramp ? RAMP : (colorFields[0]?.column ?? RAMP));
  const [shapeBy, setShapeBy] = useState<string>(NO_SHAPE);
  const colorLabelId = useId();
  const shapeLabelId = useId();

  // A field, or the ramp where none is picked.
  const colorField = useMemo(
    () => colorFields.find(({ column }) => column === colorBy) ?? null,
    [colorFields, colorBy]
  );
  const coloring = colorField ? null : (ramp ?? null);

  // Shape scales over every row, so a value keeps its shape as filters change.
  const shapeOptions = useMemo(
    () =>
      fields.flatMap((field) => {
        const scale = shapeScaleOf(field, rows);
        return scale ? [{ field, scale }] : [];
      }),
    [fields, rows]
  );
  const shaping: { field: CategoryField<T>; scale: ShapeScale } | null =
    shapeOptions.find(({ field }) => field.column === shapeBy) ?? null;

  // Where the ramp's colors stop: the default, or where the reader moved it from that default.
  const [moved, setMoved] = useState<{ from: ColorRange; range: ColorRange } | null>(null);
  const range =
    coloring && moved && sameRange(moved.from, coloring.defaultRange) ? moved.range : (coloring?.defaultRange ?? null);

  const points = useMemo(() => {
    const onRamp = coloring && range && rampColor(coloring.stops, range);
    const paint = (row: T): { color: string; rampValue: number | null } => {
      if (colorField) return { color: colorOf(colorField, valueOf(colorField, row)), rampValue: null };
      const value = coloring?.valueOf(row) ?? null;
      if (!onRamp || value === null || !Number.isFinite(value)) return { color: NO_VALUE_COLOR, rampValue: null };
      if (coloring?.cutoff && value < coloring.cutoff.value) return { color: BELOW_CUTOFF_COLOR, rampValue: null };
      return { color: onRamp(value), rampValue: value };
    };

    const plotted = rows.map((row): Point<PointMeta<T>> => {
      const key = keyOf(row);
      const isSelected = selected.has(key);
      const faded = !isListed(key) ? "unlisted" : selected.size > 0 && !isSelected ? "unselected" : null;
      const { color, rampValue } = paint(row);
      return {
        x: x(row),
        y: y(row),
        r: isSelected && !faded ? radius.selected : radius.base,
        color,
        shape: shaping ? shaping.scale.get(valueOf(shaping.field, row)) : undefined,
        dimmed: faded !== null,
        metaData: { row, faded, rampValue },
      };
    });

    // Highest values drawn last, on top, and the selection over everything.
    const rank = ({ metaData }: Point<PointMeta<T>>) => metaData!.rampValue ?? -Number.MAX_VALUE;
    return plotted.sort(
      (a, b) =>
        Number(selected.has(keyOf(a.metaData!.row))) - Number(selected.has(keyOf(b.metaData!.row))) || rank(a) - rank(b)
    );
  }, [rows, keyOf, x, y, colorField, coloring, range, shaping, selected, isListed, radius]);

  const shown = useMemo(() => points.filter(({ dimmed }) => !dimmed), [points]);

  // Both ways: a hovered point rings its chips and marks the colorbar, and a hovered chip or stretch
  // of the colorbar spotlights its points.
  const [plotHover, setPlotHover] = useState<PointMeta<T> | null>(null);
  const [legendHover, setLegendHover] = useState<LegendHover | null>(null);

  // From the points in focus, so a switched-off chip highlights nothing.
  const hoveredPoints = useMemo(() => {
    if (legendHover === null) return undefined;
    if (legendHover.kind === "range") {
      const [low, high] = legendHover.within;
      return shown.filter(({ metaData }) => {
        const value = metaData!.rampValue;
        return value !== null && value >= low && value <= high;
      });
    }
    const field = fields.find(({ column }) => column === legendHover.column);
    return field ? shown.filter(({ metaData }) => valueOf(field, metaData!.row) === legendHover.value) : [];
  }, [legendHover, shown, fields]);
  // A stretch of the colorbar dims everything outside it even while empty; a chip with nothing in focus
  // - one switched off - leaves the plot be.
  const spotlit =
    hoveredPoints && (hoveredPoints.length > 0 || legendHover?.kind === "range") ? hoveredPoints : undefined;

  const ringed = (field: CategoryField<T>) =>
    plotHover
      ? valueOf(field, plotHover.row)
      : legendHover?.kind === "group" && legendHover.column === field.column
        ? legendHover.value
        : null;

  const chipRow = (field: CategoryField<T>, asShapes: boolean, label?: string) => {
    const values = valueCounts(field, rows).map(([value]) => value);
    const hidden = filters.excluded(field.column, values);
    const groups = legendGroups(field, rows, (row) => isListed(keyOf(row)), hidden).map((group) => ({
      ...group,
      shape: shaping?.field === field ? shaping.scale.get(group.value) : undefined,
      // A shape row's glyphs are in ink: the points are colored by another field.
      color: asShapes ? "currentColor" : group.color,
    }));
    return (
      <ChipLegend
        key={field.column}
        label={label}
        groups={groups}
        hidden={hidden}
        onToggle={(value) => filters.toggle(field.column, value, values)}
        highlighted={ringed(field)}
        onHover={(value) =>
          setLegendHover(value === null ? null : { kind: "group", column: field.column, value: value })
        }
        scrollable
      />
    );
  };

  // A ramp's colorbar, counting only the points in focus.
  const rampLegend = coloring && (
    <RampLegend
      coloring={coloring}
      range={range}
      shown={shown}
      noun={noun}
      marker={plotHover?.rampValue ?? null}
      sweep={legendHover?.kind === "range" ? legendHover.sweep : null}
      onSweep={(sweep) =>
        setLegendHover(
          sweep === null || range === null ? null : { kind: "range", sweep, within: sweptValues(range, sweep) }
        )
      }
      onRangeChange={(next) => setMoved({ from: coloring.defaultRange, range: next })}
    />
  );

  // The shape row is its own only where it names another field; otherwise the color chips carry the glyphs.
  const shapeRow = shaping && shaping.field !== colorField ? shaping.field : null;

  // What the table filters by that no chip row shows, named so the reader knows why points are dimmed.
  const chipColumns: (string | undefined)[] = [colorField?.column, shapeRow?.column];
  const unshown = [
    ...filters.columns
      .filter((column) => !chipColumns.includes(column))
      .map(
        (column) =>
          columns.find(({ field }) => field === column)?.headerName ??
          fields.find((field) => field.column === column)?.label ??
          column
      ),
    ...(filters.searching ? ["search"] : []),
  ];

  // Band-aid: the plot's controls sit on its left, and a square plot takes min(width, height), so the
  // height is kept below the width to leave them room.
  const plotContainerRef = useRef<HTMLDivElement>(null);
  const [plotContainerWidth, setPlotContainerWidth] = useState(0);
  useEffect(() => {
    const el = plotContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setPlotContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={1}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
        <FormControl size="small">
          <InputLabel id={colorLabelId}>Color By</InputLabel>
          <Select
            labelId={colorLabelId}
            value={colorField?.column ?? RAMP}
            label="Color By"
            onChange={(event) => setColorBy(event.target.value)}
            MenuProps={MENU_PROPS}
          >
            {ramp && <MenuItem value={RAMP}>{ramp.label}</MenuItem>}
            {colorFields.map(({ column, label }) => (
              <MenuItem key={column} value={column}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {shapeOptions.length > 0 && (
          <FormControl size="small">
            <InputLabel id={shapeLabelId}>Shape By</InputLabel>
            <Select
              labelId={shapeLabelId}
              value={shaping?.field.column ?? NO_SHAPE}
              label="Shape By"
              onChange={(event) => setShapeBy(event.target.value)}
              MenuProps={MENU_PROPS}
            >
              <MenuItem value={NO_SHAPE}>None</MenuItem>
              {shapeOptions.map(({ field: { column, label } }) => (
                <MenuItem key={column} value={column}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {coloring?.controls}
        {rampLegend && <Box ml="auto">{rampLegend}</Box>}
      </Stack>
      {shapeRow && chipRow(shapeRow, true, shapeRow.label)}
      {/* Named only beneath a shape row, to tell the two apart. */}
      {colorField && chipRow(colorField, false, shapeRow ? colorField.label : undefined)}
      {unshown.length > 0 && (
        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary">
            Also filtered in the table by {listOf(unshown)}.
          </Typography>
          <Button size="small" onClick={filters.clear} sx={{ py: 0 }}>
            Clear all filters
          </Button>
        </Stack>
      )}
      <Box
        ref={plotContainerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          ...(plotContainerWidth > 0 && { maxHeight: plotContainerWidth - CONTROLS_OFFSET }),
        }}
      >
        <ScatterPlot
          pointData={points}
          loading={loading}
          selectable
          square
          initialState={initialState}
          onPointClicked={({ metaData }) => {
            // A row the table doesn't list can't be selected there either.
            if (metaData!.faded !== "unlisted") onPointClicked(metaData!.row);
          }}
          onSelectionChange={(picked) =>
            onLassoSelect(
              picked.filter(({ metaData }) => metaData!.faded !== "unlisted").map(({ metaData }) => metaData!.row)
            )
          }
          hoveredPoints={spotlit}
          spotlight
          onHoveredPointChange={(point) => setPlotHover(point?.metaData ?? null)}
          tooltipBody={({ metaData }) => (
            // Held to a width, as biosample names can run long.
            <Box maxWidth={350}>
              {metaData!.faded && (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  {FADED_NOTES[metaData!.faded]}
                </Typography>
              )}
              {tooltipBody(metaData!.row)}
            </Box>
          )}
          controlsHighlight={theme.palette.primary.light}
          miniMap={MINIMAP_CONFIG}
          leftAxisLabel="UMAP-2"
          bottomAxisLabel="UMAP-1"
          ref={ref}
          downloadFileName={downloadFileName}
          animation="scale"
          animationBuffer={0.01}
          animationGroupSize={animationGroupSize}
        />
        {!loading && points.length > 0 && shown.length === 0 && (
          <Stack
            position="absolute"
            alignItems="center"
            justifyContent="center"
            sx={{ inset: 0, pointerEvents: "none" }}
          >
            {/* Backed, since the dimmed points are drawn underneath. */}
            <Typography
              color="text.secondary"
              sx={{ px: 2, py: 1, borderRadius: 1, bgcolor: "background.paper", boxShadow: 1 }}
            >
              {selected.size > 0
                ? "None of the selected points are listed in the table"
                : "No points are listed in the table"}
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

type RampLegendProps<T> = {
  coloring: RampColoring<T>;
  range: ColorRange | null;
  /** The points in focus, which the colorbar counts. */
  shown: Point<PointMeta<T>>[];
  noun: string;
  /** The hovered point's value on the ramp, marked on the colorbar. */
  marker: number | null;
  sweep: RampRange | null;
  onSweep: (sweep: RampRange | null) => void;
  onRangeChange: (range: ColorRange) => void;
};

/** The colorbar for a ramp, with a count of the points in focus drawn in a neutral instead. */
const RampLegend = <T,>({
  coloring,
  range,
  shown,
  noun,
  marker,
  sweep,
  onSweep,
  onRangeChange,
}: RampLegendProps<T>) => {
  const values = useMemo(
    () => Float64Array.from(shown.flatMap(({ metaData }) => metaData!.rampValue ?? [])).sort(),
    [shown]
  );
  const offRamp = shown.length - values.length;

  const legend = (
    <ColorbarLegend
      label={coloring.label}
      stops={coloring.stops}
      kind={coloring.kind}
      range={range}
      values={values}
      format={coloring.format}
      formatValue={coloring.formatValue}
      noun={noun}
      sweep={sweep}
      onSweep={onSweep}
      marker={marker}
      control={coloring.adjustable ? { defaultRange: coloring.defaultRange, onChange: onRangeChange } : undefined}
      notes={coloring.notes}
      missing={{
        count: offRamp,
        color: coloring.cutoff ? BELOW_CUTOFF_COLOR : NO_VALUE_COLOR,
        label: coloring.cutoff?.label,
      }}
    />
  );

  return coloring.unit ? (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography variant="caption">{coloring.unit}</Typography>
      {legend}
    </Stack>
  ) : (
    legend
  );
};

export default BiosampleUMAP;
