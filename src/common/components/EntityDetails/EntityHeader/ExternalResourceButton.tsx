import { Button } from "@mui/material";
import Image from "next/image";

export type ExternalResourceButtonProps = {
  /** Undefined disables the button, for when the link target can't be built */
  href: string | undefined;
  /** Logo of the resource being linked to */
  imageSrc: string;
  /** Names the resource. The button has no text, so this is its accessible name */
  label: string;
  /** Bypasses the Next image optimizer, for hosts it can't process */
  unoptimized?: boolean;
};

/**
 * Fixed-size logo button linking out to an external resource, shared by the entity headers so every
 * outbound link has the same footprint and the same disabled treatment.
 */
export const ExternalResourceButton = ({ href, imageSrc, label, unoptimized }: ExternalResourceButtonProps) => {
  return (
    <Button
      variant="outlined"
      href={href}
      disabled={!href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        width: 125,
        height: 60,
        minWidth: 0,
        position: "relative",
        backgroundColor: "transparent",
        borderColor: "divider",
        "& img": { transition: "filter 0.2s ease" },
        "&:hover img": { filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" },
        "&.Mui-disabled img": { filter: "grayscale(1)", opacity: 0.4 },
      }}
    >
      <Image
        style={{ objectFit: "contain" }}
        src={imageSrc}
        width={125}
        height={60}
        unoptimized={unoptimized}
        alt={label}
      />
    </Button>
  );
};
