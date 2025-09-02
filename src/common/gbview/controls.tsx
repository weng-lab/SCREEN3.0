import { Box, Button, Typography } from "@mui/material";

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
    buttons: {
      label: string;
      onClick: (value: number) => void;
      value: number;
    }[];
  }) => (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      <Typography variant="body2" pr={1}>
        {title}
      </Typography>
      {buttons.map((btn, index) => {
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
  );

  const width = domain.end - domain.start;

  // Define button configurations
  const buttonGroups = [
    {
      title: "Move Left",
      buttons: [
        { label: "◄◄◄", onClick: shift, value: -width },
        { label: "◄◄", onClick: shift, value: -Math.round(width / 2) },
        { label: "◄", onClick: shift, value: -Math.round(width / 4) },
      ],
    },
    {
      title: "Move Right",
      buttons: [
        { label: "►", onClick: shift, value: Math.round(width / 4) },
        { label: "►►", onClick: shift, value: Math.round(width / 2) },
        { label: "►►►", onClick: shift, value: width },
      ],
    },
    {
      title: "Zoom In",
      buttons: [
        { label: "1.5x", onClick: zoom, value: 1 / 1.5 },
        { label: "3x", onClick: zoom, value: 1 / 3 },
        { label: "10x", onClick: zoom, value: 1 / 10 },
        { label: "100x", onClick: zoom, value: 1 / 100 },
      ],
    },
    {
      title: "Zoom Out",
      buttons: [
        { label: "-1.5x", onClick: zoom, value: 1.5 },
        { label: "-3x", onClick: zoom, value: 3 },
        { label: "-10x", onClick: zoom, value: 10 },
        { label: "-100x", onClick: zoom, value: 100 },
      ],
    },
  ];

  return (
    <Box justifyContent={"space-around"} flexDirection={"row"} display={"flex"} width={"100%"}>
      {buttonGroups.map((group, index) => (
        <ButtonGroup key={index} title={group.title} buttons={group.buttons} />
      ))}
    </Box>
  );
}
