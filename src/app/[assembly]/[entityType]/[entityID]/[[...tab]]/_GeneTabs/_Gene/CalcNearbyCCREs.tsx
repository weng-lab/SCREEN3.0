import React from "react";
import {
    Popper,
    Paper,
    Box,
    ClickAwayListener,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Slider,
    Stack,
    Typography,
} from "@mui/material";
import { Assembly } from "types/globalTypes";

interface CalculateNearbyCCREsPopperProps {
    open: boolean;
    anchorEl: any; // virtual anchor object
    handleClickAway: () => void;
    geneName: string;
    calcMethod: "body" | "tss" | "3gene";
    handleMethodChange: (method: "body" | "tss" | "3gene") => void;
    distance: number;
    handleDistanceChange: (distance: number) => void;
    assembly: Assembly;
}

const CalculateNearbyCCREsPopper: React.FC<CalculateNearbyCCREsPopperProps> = ({
    open,
    anchorEl,
    handleClickAway,
    geneName,
    calcMethod,
    handleMethodChange,
    distance,
    handleDistanceChange,
    assembly
}) => {
    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            disablePortal
            sx={{ zIndex: 10 }}
        >
            <ClickAwayListener onClickAway={handleClickAway}>
                <Paper elevation={8} sx={{ minWidth: 200 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography sx={{ mb: 2 }}>Calculate Nearby cCREs by:</Typography>
                        <Stack direction={"row"} spacing={2}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    value={calcMethod}
                                    onChange={(event) => handleMethodChange(event.target.value as "body" | "tss" | "3gene")}
                                >
                                    <FormControlLabel
                                        value="tss"
                                        control={<Radio />}
                                        label={
                                            <>
                                                Within Distance of TSS of <i>{geneName}</i>
                                            </>
                                        }
                                    />
                                    <FormControlLabel
                                        value="body"
                                        control={<Radio />}
                                        label={
                                            <>
                                                <i>{geneName}</i> Gene Body
                                            </>
                                        }
                                    />
                                    {assembly === "GRCh38" && (
                                        <FormControlLabel
                                            value="3gene"
                                            control={<Radio />}
                                            label="Closest 3 Genes"
                                        />
                                    )}
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                        <Box sx={{ width: "100%", padding: 2 }}>
                            <Slider
                                aria-label="Custom marks"
                                defaultValue={0}
                                getAriaValueText={valuetext}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100000}
                                step={null}
                                value={distance}
                                onChange={(_, value: number) => handleDistanceChange(value)}
                                marks={tssMarks}
                                disabled={calcMethod !== "tss"}
                            />
                        </Box>
                    </Box>
                </Paper>
            </ClickAwayListener>
        </Popper>
    );
};

const valuetext = (value: number) => {
    return `${value}kb`;
}

const tssMarks = [
    {
        value: 0,
        label: '0kb',
    },
    {
        value: 10000,
        label: '10kb',
    },
    {
        value: 25000,
        label: '25kb',
    },
    {
        value: 50000,
        label: '50kb',
    },
    {
        value: 100000,
        label: '100kb',
    }
];

export default CalculateNearbyCCREsPopper;
