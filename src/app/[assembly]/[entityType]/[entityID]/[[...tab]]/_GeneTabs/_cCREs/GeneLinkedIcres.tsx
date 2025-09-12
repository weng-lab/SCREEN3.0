import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Slider, Stack, Typography } from "@mui/material";
import ComputationalLinkedCcres from "./ComputationalLinkedCcres";
import DistanceLinkedCcres from "./DistanceLinkedCcres";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { useState } from "react";

const GeneLinkedIcres = ({ geneData }: { geneData: UseGeneDataReturn<{ name: string }> }) => {
  const [calcMethod, setCalcMethod] = useState<"body" | "tss">("body");
  const [distance, setDistance] = useState<number>(0);

  return (
    <Stack spacing={2}>
      <Stack direction={"row"} spacing={2}>
        <FormControl>
          <RadioGroup
            row
            value={calcMethod}
            onChange={(event) => setCalcMethod(event.target.value as "body" | "tss")}
          >
            <FormControlLabel
              value="body"
              control={<Radio />}
              label={
                <>
                  <i>{geneData.data.name}</i> Gene Body
                </>
              }
            />
            <FormControlLabel
              value="tss"
              control={<Radio />}
              label={
                <>
                  Within Distance of TSS of <i>{geneData.data.name}</i>
                </>
              }
            />
          </RadioGroup>
        </FormControl>
        {calcMethod === "tss" && (
          <Box sx={{ width: 300 }} >
            <Slider
              aria-label="Custom marks"
              defaultValue={0}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={null}
              value={distance}
              onChange={(_, value: number) => setDistance(value)}
              marks={tssMarks}
            />
          </Box>
        )}
      </Stack>
      <DistanceLinkedCcres geneData={geneData} distance={distance} method={calcMethod}/>
      <ComputationalLinkedCcres geneData={geneData} distance={distance} method={calcMethod}/>
    </Stack>
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

export default GeneLinkedIcres;
