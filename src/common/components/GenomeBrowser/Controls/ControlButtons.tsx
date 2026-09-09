import { Box, Divider, Stack, Typography, ButtonGroup as MuiButtonGroup } from "@mui/material";
import { BrowserNavigationButton, type BrowserNavigationAction } from "@weng-lab/genomebrowser-ui";
import { BrowserStoreInstance } from "@weng-lab/genomebrowser";

type ButtonConfig = { label: string; action: BrowserNavigationAction };

const buttonGroups = {
  moveLeft: [
    { label: "◄◄◄", action: { type: "pan", fraction: -1 } },
    { label: "◄◄", action: { type: "pan", fraction: -0.5 } },
    { label: "◄", action: { type: "pan", fraction: -0.25 } },
  ],
  moveRight: [
    { label: "►", action: { type: "pan", fraction: 0.25 } },
    { label: "►►", action: { type: "pan", fraction: 0.5 } },
    { label: "►►►", action: { type: "pan", fraction: 1 } },
  ],
  zoomIn: [
    { label: "1.5x", action: { type: "zoom", factor: 1 / 1.5 } },
    { label: "3x", action: { type: "zoom", factor: 1 / 3 } },
    { label: "10x", action: { type: "zoom", factor: 1 / 10 } },
  ],
  zoomOut: [
    { label: "10x", action: { type: "zoom", factor: 10 } },
    { label: "3x", action: { type: "zoom", factor: 3 } },
    { label: "1.5x", action: { type: "zoom", factor: 1.5 } },
  ],
} satisfies Record<string, ButtonConfig[]>;

// Reusable button group component
const ButtonGroup = ({ buttons, browserStore }: { buttons: ButtonConfig[]; browserStore: BrowserStoreInstance }) => (
  <MuiButtonGroup>
    {buttons.map((btn) => {
      return (
        <BrowserNavigationButton
          key={btn.label}
          variant="outlined"
          size="small"
          browserStore={browserStore}
          action={btn.action}
          sx={{
            padding: "2px 8px",
            minWidth: "30px",
            fontSize: "0.8rem",
          }}
        >
          {btn.label}
        </BrowserNavigationButton>
      );
    })}
  </MuiButtonGroup>
);

const TwoSidedControl = ({
  browserStore,
  leftButtons,
  rightButtons,
  label,
  leftLabel,
  rightLabel,
}: {
  browserStore: BrowserStoreInstance;
  leftButtons: ButtonConfig[];
  rightButtons: ButtonConfig[];
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
}) => (
  <Stack alignItems={"center"}>
    {label && <Typography variant="body2">{label}</Typography>}
    <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
      <Stack direction={"column"} alignItems={"center"}>
        {leftLabel && <Typography variant="body2">{leftLabel}</Typography>}
        <ButtonGroup buttons={leftButtons} browserStore={browserStore} />
      </Stack>
      <Divider orientation="vertical" flexItem />
      <Stack direction={"column"} alignItems={"center"}>
        {rightLabel && <Typography variant="body2">{rightLabel}</Typography>}
        <ButtonGroup buttons={rightButtons} browserStore={browserStore} />
      </Stack>
    </Stack>
  </Stack>
);

export default function ControlButtons({ browserStore }: { browserStore: BrowserStoreInstance }) {
  return (
    <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"} gap={2}>
      <TwoSidedControl
        browserStore={browserStore}
        leftButtons={buttonGroups.moveLeft}
        rightButtons={buttonGroups.moveRight}
        label="Move"
      />
      <TwoSidedControl
        browserStore={browserStore}
        leftButtons={buttonGroups.zoomIn}
        rightButtons={buttonGroups.zoomOut}
        leftLabel="Zoom In"
        rightLabel="Zoom Out"
      />
    </Box>
  );
}
