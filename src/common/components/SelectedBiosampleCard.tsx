import { Stack, Typography, IconButton } from "@mui/material";
import { CancelRounded } from "@mui/icons-material";
import { EncodeBiosample } from "@weng-lab/ui-components";

interface SelectedBiosampleCardProps {
  biosample: EncodeBiosample;
  onClear: () => void;
}

/**
 * Small banner shown above a cCRE table when a biosample is selected, displaying the
 * selected biosample's ontology + display name with a button to clear the selection.
 */
export const SelectedBiosampleCard = ({ biosample, onClear }: SelectedBiosampleCardProps) => {
  return (
    <Stack
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      sx={{ backgroundColor: (theme) => theme.palette.secondary.light }}
      alignItems={"center"}
      width={"fit-content"}
    >
      <Typography sx={{ color: "#2C5BA0", pl: 1 }}>
        <b>Selected Biosample: </b>
        {" " +
          biosample.ontology.charAt(0).toUpperCase() +
          biosample.ontology.slice(1) +
          " - " +
          biosample.displayname}
      </Typography>
      <IconButton onClick={onClear}>
        <CancelRounded />
      </IconButton>
    </Stack>
  );
};
