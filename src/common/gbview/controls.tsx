import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import { useCallback } from "react";
import { BrowserStoreInstance } from "@weng-lab/genomebrowser";

export default function ControlButtons({ browserStore }: { browserStore: BrowserStoreInstance }) {
  const domain = browserStore((state) => state.domain);
  const setDomain = browserStore((state) => state.setDomain);

  const zoom = useCallback(
    (factor: number) => {
      // Calculate new domain width
      const width = domain.end - domain.start;
      const newWidth = Math.round(width * factor);
      const center = Math.round((domain.start + domain.end) / 2);

      // Calculate new start and end based on center point
      const newStart = Math.max(0, Math.round(center - newWidth / 2));
      const newEnd = Math.round(center + newWidth / 2);

      // Dispatch with exact coordinates instead of using factor
      setDomain({
        ...domain,
        start: newStart,
        end: newEnd,
      });
    },
    [domain, setDomain]
  );

  const shift = useCallback(
    (delta: number) => {
      // Round the delta to ensure consistent integer values
      const roundedDelta = Math.round(delta);
      const width = domain.end - domain.start;

      // Ensure we don't go below 0
      const newStart = Math.max(0, Math.round(domain.start + roundedDelta));
      const newEnd = Math.round(newStart + width);

      // Dispatch with exact coordinates instead of using delta
      setDomain({
        ...domain,
        start: newStart,
        end: newEnd,
      });
    },
    [domain, setDomain]
  );

  // Reusable button group component
  const ButtonGroup = ({
    title,
    buttons,
  }: {
    title: string;
    buttons: ({
      label: string;
      onClick: (value: number) => void;
      value: number;
    } | "divider")[];
  }) => (
    <Stack alignItems={"center"}>
      <Typography variant="body2" pr={1}>
        {title}
      </Typography>
      <Box display={"flex"}>
        {buttons.map((btn, index) => {
          if (btn === "divider") return <Divider key={index} orientation="vertical" flexItem sx={{mx: 1}} />
          return (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => btn.onClick(btn.value)}
              title={`${title} ${btn.value.toLocaleString()}`}
              sx={{
                padding: "2px 8px",
                minWidth: "30px",
                fontSize: "0.8rem",
              }}
            >
              {btn.label}
            </Button>
          );
        })}
      </Box>
    </Stack>
  );

  const width = domain.end - domain.start;

  // Define button configurations
  const buttonGroups = [
    {
      title: "Move",
      buttons: [
        { label: "◄◄◄", onClick: shift, value: -width },
        { label: "◄◄", onClick: shift, value: -Math.round(width / 2) },
        { label: "◄", onClick: shift, value: -Math.round(width / 4) },
        "divider" as const,
        { label: "►", onClick: shift, value: Math.round(width / 4) },
        { label: "►►", onClick: shift, value: Math.round(width / 2) },
        { label: "►►►", onClick: shift, value: width },
      ],
    },
    {
      title: "Zoom",
      buttons: [
        { label: "-100x", onClick: zoom, value: 100 },
        { label: "-10x", onClick: zoom, value: 10 },
        { label: "-3x", onClick: zoom, value: 3 },
        { label: "-1.5x", onClick: zoom, value: 1.5 },
        "divider" as const,
        { label: "+1.5x", onClick: zoom, value: 1 / 1.5 },
        { label: "+3x", onClick: zoom, value: 1 / 3 },
        { label: "+10x", onClick: zoom, value: 1 / 10 },
        { label: "+100x", onClick: zoom, value: 1 / 100 },
      ],
    },
  ];

  return (
    //only allow wrapping on xs-md, since that's then the parent layout is in a column. Nowrap forces cytoband to shrink instead when arranged in a row
    <Box display={"flex"} flexDirection={"row"} flexWrap={{xs: "wrap", lg: "nowrap"}} justifyContent={"center"} gap={2}>
      {buttonGroups.map((group, index) => (
        <ButtonGroup key={index} title={group.title} buttons={group.buttons} />
      ))}
    </Box>
  );
}
