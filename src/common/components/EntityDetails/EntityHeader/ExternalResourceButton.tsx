import { Box, Button, Tooltip } from "@mui/material";
import Image from "next/image";

export type ExternalResourceButtonProps = {
  /** Undefined disables the button, for when the link target can't be built */
  href: string | undefined;
  /** Logo of the resource being linked to */
  imageSrc: string;
  /** Names the resource. The button has no text, so this is its accessible name */
  label: string;
  /** Hover text while disabled, for a link that doesn't exist rather than one that hasn't loaded */
  disabledReason?: string;
  /** Bypasses the Next image optimizer, for hosts it can't process */
  unoptimized?: boolean;
};

/**
 * Fixed-size logo button linking out to an external resource, shared by the entity headers so every
 * outbound link has the same footprint and the same disabled treatment.
 */
export const ExternalResourceButton = ({
  href,
  imageSrc,
  label,
  disabledReason,
  unoptimized,
}: ExternalResourceButtonProps) => {
  const button = (
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

  if (href || !disabledReason) return button;

  // Disabled buttons don't fire pointer events, so the tooltip needs a wrapper to listen on
  return (
    <Tooltip title={disabledReason}>
      <Box component="span" display="flex">
        {button}
      </Box>
    </Tooltip>
  );
};
