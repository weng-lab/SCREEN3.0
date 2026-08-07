import { Box, Checkbox, FormControlLabel } from "@mui/material";

export type CheckboxOption<T extends string> = { value: T; label: string };

type CheckboxGroupProps<T extends string> = {
  /** Label for the parent checkbox, which toggles every enabled option at once */
  label: string;
  options: readonly CheckboxOption<T>[];
  selected: Record<T, boolean>;
  onChange: (selected: Record<T, boolean>) => void;
  /**
   * Options marked false here are disabled, are never checked by the parent checkbox, and are
   * ignored when deriving the parent's state. Defaults to every option enabled.
   */
  enabled?: Partial<Record<T, boolean>>;
  /** Disables the whole group, parent checkbox included */
  disabled?: boolean;
};

/**
 * A row of checkboxes preceded by a parent checkbox which selects/deselects all of them, and shows
 * an indeterminate state when only some are selected.
 */
export function CheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
  enabled,
  disabled,
}: CheckboxGroupProps<T>) {
  const isEnabled = (option: CheckboxOption<T>) => !disabled && (enabled?.[option.value] ?? true);
  const enabledOptions = options.filter(isEnabled);

  const allChecked = enabledOptions.length > 0 && enabledOptions.every((option) => selected[option.value]);
  const noneChecked = enabledOptions.every((option) => !selected[option.value]);

  const handleToggleAll = (checked: boolean) =>
    onChange(
      Object.fromEntries(options.map((option) => [option.value, isEnabled(option) && checked])) as Record<T, boolean>
    );

  return (
    <div>
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && !noneChecked}
            disabled={disabled}
            onChange={(_, checked: boolean) => handleToggleAll(checked)}
          />
        }
      />
      <Box sx={{ display: "flex", flexDirection: "row", ml: 3 }}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            label={option.label}
            checked={selected[option.value]}
            disabled={!isEnabled(option)}
            onChange={(_, checked: boolean) => onChange({ ...selected, [option.value]: checked })}
            control={<Checkbox />}
          />
        ))}
      </Box>
    </div>
  );
}
