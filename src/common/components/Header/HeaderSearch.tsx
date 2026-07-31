"use client";
import { IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import AutoComplete from "../autocomplete";
import { Assembly } from "common/types/globalTypes";

// Sits on the dark toolbar, so the field fakes a borderless white input
const desktopInputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "none" },
  },
  "& .MuiInputLabel-root": {
    color: "#666666",
    "&.Mui-focused": { color: "#444444" },
  },
  "& .MuiInputLabel-shrink": {
    display: "none",
  },
};

const mobileInputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
  },
};

export type HeaderSearchProps = {
  /** Focused externally by OpenEntitiesTabBar via getElementById, so these ids are load bearing */
  id: string;
  variant: "desktop" | "mobile";
  assembly: Assembly;
  closeDrawer?: () => void;
};

/** The search field shared by the desktop toolbar and the mobile drawer */
export default function HeaderSearch({ id, variant, assembly, closeDrawer }: HeaderSearchProps) {
  const isDesktop = variant === "desktop";

  return (
    <AutoComplete
      id={id}
      assembly={assembly}
      closeDrawer={closeDrawer}
      style={{ width: isDesktop ? 400 : "100%" }}
      slots={{
        button: IconButton,
      }}
      slotProps={{
        box: { gap: 1 },
        button: { sx: { color: isDesktop ? "white" : "black" }, children: <Search /> },
        input: {
          size: "small",
          label: `Enter a gene, cCRE${assembly === "GRCh38" ? ", variant" : ""} or locus`,
          placeholder: isDesktop ? "Enter a gene, cCRE, variant or locus" : undefined,
          sx: isDesktop ? desktopInputSx : mobileInputSx,
        },
      }}
    />
  );
}
