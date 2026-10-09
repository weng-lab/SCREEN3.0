/** The categories a biosample UMAP can color and shape its points by, and the chips that list them. */

import { POINT_SHAPES, type LegendGroup, type PointShape } from "@weng-lab/visualization";
import { tissueColors } from "common/colors";
import { capitalizeFirstLetter } from "common/utils";

/**
 * A categorical property of each row - its tissue, sample type, life stage - with the table column
 * showing it, which the field's chips filter.
 */
export type CategoryField<T> = {
  /** The row property holding the value, and the table column showing it. */
  column: keyof T & string;
  label: string;
  /** The value's color, for a field points can be colored by. */
  colorOf?: (value: string) => string;
  /** How a value reads on its chip. Capitalized by default. */
  labelOf?: (value: string) => string;
  /**
   * For a field points can be shaped by, the values in the order they take shapes, so a value keeps
   * its shape from page to page. Any not listed follow alphabetically. Offered only while every value
   * gets a shape of its own.
   */
  shapeOrder?: readonly string[];
};

/** A row with no value for a field, grouped as one. */
const UNKNOWN = "unknown";

export const valueOf = <T>({ column }: CategoryField<T>, row: T): string =>
  (row[column] as string | null | undefined) || UNKNOWN;

export const labelOf = <T>(field: CategoryField<T>, value: string) => (field.labelOf ?? capitalizeFirstLetter)(value);

export const colorOf = <T>(field: CategoryField<T>, value: string) => field.colorOf?.(value) ?? tissueColors.missing;

/** A field's values across these rows, most rows first, each with how many rows have it. */
export const valueCounts = <T>(field: CategoryField<T>, rows: readonly T[]) => {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = valueOf(field, row);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts].sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b));
};

export type ShapeScale = ReadonlyMap<string, PointShape>;

/**
 * Which shape each value takes, or null where the field can't be shaped by: it lists no order, the
 * rows have fewer than two of its values, or it has more values than there are shapes.
 */
export const shapeScaleOf = <T>(field: CategoryField<T>, rows: readonly T[]): ShapeScale | null => {
  if (!field.shapeOrder) return null;
  const present = new Set(rows.map((row) => valueOf(field, row)));
  const unlisted = [...present].filter((value) => !field.shapeOrder!.includes(value)).sort();
  const order = [...field.shapeOrder, ...unlisted];
  if (present.size < 2 || order.length > POINT_SHAPES.length) return null;
  return new Map(order.map((value, i) => [value, POINT_SHAPES[i]]));
};

/**
 * A field's chips, most rows first, so the order holds as filters change. A chip counts the rows the
 * table lists, or while it's switched off, every row it stands for.
 */
export const legendGroups = <T>(
  field: CategoryField<T>,
  rows: readonly T[],
  listed: (row: T) => boolean,
  hidden: ReadonlySet<string>
): LegendGroup[] => {
  const listedCounts = new Map(valueCounts(field, rows.filter(listed)));
  return valueCounts(field, rows).map(([value, count]) => ({
    value,
    label: labelOf(field, value),
    color: colorOf(field, value),
    count: hidden.has(value) ? count : (listedCounts.get(value) ?? 0),
  }));
};

const tissueColor = (value: string) => tissueColors[value as keyof typeof tissueColors] ?? tissueColors.missing;

/** The biosample's organ or tissue: `tissue` on an expression row, `ontology` on a biosample. */
export const tissueField = <T>(column: keyof T & string): CategoryField<T> => ({
  column,
  label: "Organ/Tissue",
  colorOf: tissueColor,
});

/** Tissue, cell line and so on: `biosample_type` on an expression row, `sampleType` on a biosample. */
export const sampleTypeField = <T>(column: keyof T & string): CategoryField<T> => ({
  column,
  label: "Sample Type",
  colorOf: tissueColor,
  shapeOrder: ["tissue", "primary cell", "cell line", "in vitro differentiated cells", "organoid"],
});

/** Adult or embryonic. Shaped by rather than colored: it has no palette. */
export const lifeStageField = <T>(column: keyof T & string): CategoryField<T> => ({
  column,
  label: "Life Stage",
  shapeOrder: ["adult", "embryonic"],
});
