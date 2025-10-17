import React from "react";
import { Tooltip, FormControlLabel, Switch, Box } from "@mui/material";
import { Sort } from "@mui/icons-material";

interface AutoSortSwitchProps {
  autoSort: boolean;
  setAutoSort: (value: boolean) => void;
}

const AutoSortSwitch: React.FC<AutoSortSwitchProps> = ({ autoSort, setAutoSort }) => {
  return (
    <Tooltip title="Auto sort selected rows">
      <FormControlLabel
        value="autoSort"
        control={
          <Switch
            color="primary"
            size="small"
            sx={{ mr: 1 }}
            checked={autoSort}
            onChange={(_, checked) => setAutoSort(checked)}
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center", lineHeight: 1 }}>
            <Sort fontSize="small" />
          </Box>
        }
        labelPlacement="start"
      />
    </Tooltip>
  );
};

export default AutoSortSwitch;