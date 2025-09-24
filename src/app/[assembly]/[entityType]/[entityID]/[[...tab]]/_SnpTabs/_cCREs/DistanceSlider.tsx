import { Box, Slider } from "@mui/material";

type DistanceSliderProps = {
    distance: number;
    handleDistanceChange: (value: number) => void;
};

const valuetext = (value: number) => {
    return `${value}kb`;
}

const marks = [
    {
        value: 0,
        label: '0kb',
    },
    {
        value: 500,
        label: '0.5kb',
    },
    {
        value: 1000,
        label: '1kb',
    },
    {
        value: 1500,
        label: '1.5kb',
    },
    {
        value: 2000,
        label: '2kb',
    }
];

export const DistanceSlider = ({
    distance,
    handleDistanceChange,
}: DistanceSliderProps) => {
    return (
        <Box sx={{ width: "200px", mr: 2 }}>
            <Slider
                aria-label="Distance slider"
                defaultValue={500}
                getAriaValueText={valuetext}
                min={0}
                max={2000}
                step={null}
                value={distance}
                onChange={(_, value: number) => handleDistanceChange(value)}
                marks={marks}
            />
        </Box>
    );
};
