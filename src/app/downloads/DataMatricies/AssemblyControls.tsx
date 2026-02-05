import { Typography, Divider, Button } from "@mui/material";
import { Stack } from "@mui/system";
import MouseIcon from "common/components/MouseIcon";
import { DNase_seq, H3K4me3, H3K27ac, CA_CTCF } from "../../../common/colors";
import HumanIcon from "common/components/HumanIcon";

type AssemblyControlsProps = {
  assembly: "Human" | "Mouse";
  setSelected: (selection: Selected) => void;
  selectedAssay: Selected;
};

export type Selected = {
  assembly: "Human" | "Mouse";
  assay: "DNase" | "H3K4me3" | "H3K27ac" | "CTCF";
};

const assays = ["DNase", "H3K4me3", "H3K27ac", "CTCF"];
const assemblyInfo = {
  Mouse: {
    cCREs: 926843,
    cellTypes: 366,
    icon: <MouseIcon size={75} />,
  },
  Human: {
    cCREs: 2348854,
    cellTypes: 1678,
    icon: <HumanIcon size={75} />,
  },
};

const AssemblyControls = ({ assembly, setSelected, selectedAssay }: AssemblyControlsProps) => {
  /**
   * @param assay an assay
   * @returns the corresponding color for the given assay
   */
  function borderColor(assay: Selected["assay"]) {
    switch (assay) {
      case "DNase":
        return DNase_seq;
      case "H3K4me3":
        return H3K4me3;
      case "H3K27ac":
        return H3K27ac;
      case "CTCF":
        return CA_CTCF;
    }
  }

  // Assay selectors
  const selectorButton = (variant: Selected) => {
    return (
      <Button
        key={`${variant.assembly}-${variant.assay}`}
        variant="text"
        fullWidth
        onClick={() => {
          setSelected(variant);
        }}
        sx={{
          mb: 1,
          textTransform: "none",
          backgroundColor: `${selectedAssay && selectedAssay.assembly === variant.assembly && selectedAssay.assay === variant.assay ? borderColor(variant.assay) : "initial"}`,
          borderLeft: `0.40rem solid ${borderColor(variant.assay)}`,
          borderRight: `0.40rem solid ${selectedAssay && selectedAssay.assembly === variant.assembly && selectedAssay.assay === variant.assay ? borderColor(variant.assay) : "white"}`,
          color: `${selectedAssay && selectedAssay.assembly === variant.assembly && selectedAssay.assay === variant.assay && selectedAssay.assay === "H3K4me3" ? "white" : "initial"}`,
          boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.25)",
          "&:hover": {
            transform: "translateY(-0.75px)",
            boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.35)",
            backgroundColor: `${selectedAssay && selectedAssay.assembly === variant.assembly && selectedAssay.assay === variant.assay ? borderColor(variant.assay) : "initial"}`,
          },
        }}
      >
        {`${variant.assay}`}
      </Button>
    );
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        {assemblyInfo[assembly].icon}
        <Stack flex={1} spacing={1}>
          <Typography variant="h5">{assembly}</Typography>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">
              <b>{assemblyInfo[assembly].cCREs.toLocaleString()}</b> cCREs
            </Typography>
            <Typography variant="subtitle2">
              <b>{assemblyInfo[assembly].cellTypes.toLocaleString()}</b> cell types
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        {assays.map((assay) =>
          selectorButton({
            assembly,
            assay: assay as "DNase" | "H3K4me3" | "H3K27ac" | "CTCF",
          })
        )}
      </Stack>
    </Stack>
  );
};

export default AssemblyControls;
