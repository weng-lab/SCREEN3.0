import { Checkbox, FormLabel, IconButton, ListItemText, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { CCRE_CLASSES, CLASS_DESCRIPTIONS } from "common/ccre";
import { CcreClass } from "common/types/globalTypes";

const REACHABLE_CLASSES_TOOLTIP =
  "The cCRE classes available for a biosample depend on which assays were performed. " +
  "Classification is gated by DNase — a biosample without a DNase experiment can only yield " +
  "“Unclassified.” H3K4me3 enables Promoter and CA-H3K4me3, H3K27ac enables the Proximal/Distal " +
  "Enhancer classes, and CTCF enables CA-CTCF. ATAC does not affect classification. With no " +
  "biosample selected, all classes are available (global classification).";

type CcreClassSelectProps = {
  selectedClasses: CcreClass[];
  onChange: (classes: CcreClass[]) => void;
  /** Classes the selected biosample's assays are able to produce. The rest are disabled */
  reachableClasses: CcreClass[];
};

/**
 * Multiselect for the cCRE classes to include in the download.
 */
export const CcreClassSelect = ({ selectedClasses, onChange, reachableClasses }: CcreClassSelectProps) => {
  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <FormLabel id="ccre-classes-label">cCRE Classes</FormLabel>
        <Tooltip title={REACHABLE_CLASSES_TOOLTIP}>
          <IconButton size="small">
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Select
        multiple
        size="small"
        displayEmpty
        value={selectedClasses}
        onChange={(e) => onChange(e.target.value as CcreClass[])}
        renderValue={(selected) =>
          selected.length === 0
            ? "None selected"
            : selected.length === CCRE_CLASSES.length
              ? "All classes"
              : selected.map((cls) => CLASS_DESCRIPTIONS[cls]).join(", ")
        }
        aria-labelledby="ccre-classes-label"
        sx={{ minWidth: 220, maxWidth: 260, display: "flex" }}
      >
        {CCRE_CLASSES.map((cls) => (
          <MenuItem key={cls} value={cls} disabled={!reachableClasses.includes(cls)}>
            <Checkbox checked={selectedClasses.includes(cls)} />
            <ListItemText primary={CLASS_DESCRIPTIONS[cls]} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
