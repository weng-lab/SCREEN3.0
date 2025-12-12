import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

type ColorBySelectProps = {
  colorScheme: "expression" | "organ/tissue";
  handleColorSchemeChange: (event: SelectChangeEvent) => void;
};

export const ColorBySelect = ({ colorScheme, handleColorSchemeChange }: ColorBySelectProps) => (
  <FormControl sx={{ alignSelf: "flex-start" }}>
    <InputLabel>Color By</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={colorScheme}
      label="Color By"
      onChange={handleColorSchemeChange}
      MenuProps={{ disableScrollLock: true }}
      size="small"
    >
      <MenuItem value={"expression"}>Expression</MenuItem>
      <MenuItem value={"organ/tissue"}>Tissue</MenuItem>
    </Select>
  </FormControl>
);
