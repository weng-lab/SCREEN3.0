import type { GridValidRowModel, ValueOptions } from "@mui/x-data-grid-premium";
import type { TableColDef } from "@weng-lab/ui-components";
import { capitalizeFirstLetter } from "common/utils";

/** A `getOptionLabel` for options held lowercase. A `{ value, label }` option keeps its label, as in MUI's default. */
export const capitalizeOption = (option: ValueOptions): string =>
  typeof option === "object" ? option.label : capitalizeFirstLetter(String(option));

/**
 * Fills in the options of every column marked `type: "singleSelect"` without them, from the values
 * the rows have, so marking a column is enough to give it a categorical filter. Values are read from
 * `row[field]`, not a valueGetter. Label them with `getOptionLabel`, which the cells read too.
 *
 * Memoize the result on the rows: new columns send the grid back through its column state.
 * @todo potential improvement - can this work with valueGetter columns if we call the valueGetter here?
 */
export const withValueOptions = <R extends GridValidRowModel>(
  columns: readonly TableColDef<R>[],
  rows: readonly R[] | undefined
): TableColDef<R>[] =>
  columns.map((column) => {
    if (column.type !== "singleSelect" || ("valueOptions" in column && column.valueOptions)) return column;
    const values = new Set<string>();
    for (const row of rows ?? []) {
      const value: unknown = row[column.field];
      if (value != null && value !== "") values.add(String(value));
    }
    return { ...column, valueOptions: [...values].sort((a, b) => a.localeCompare(b)) };
  });
