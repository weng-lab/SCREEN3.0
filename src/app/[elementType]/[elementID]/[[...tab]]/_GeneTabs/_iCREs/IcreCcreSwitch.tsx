import { Stack, styled, Switch, SwitchProps, Typography } from "@mui/material";

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 75,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(35px)",
      "& .MuiSwitch-thumb:before": {
        backgroundPosition: "center",
        backgroundSize: "90%",
        backgroundImage: `url("/SCREEN_icon.png")`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.primary.main,
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundPosition: "center",
      backgroundSize: "90%",
      backgroundImage: `url("/igSCREEN_icon.png")`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#a75a5f",
    borderRadius: 20 / 2,
  },
}));

const IcreCcreSwitch = (props: SwitchProps) => {
  return (
    <Stack direction={"row"} alignItems={"center"} spacing={2}>
      <Typography>iCREs Only</Typography>
      <StyledSwitch {...props} />
      <Typography>All cCREs</Typography>
    </Stack>
  );
};

export default IcreCcreSwitch;
