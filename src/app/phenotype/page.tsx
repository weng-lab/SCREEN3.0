"use client";
import { useQuery } from "@apollo/client";
import ChangeHistoryTwoToneIcon from "@mui/icons-material/ChangeHistoryTwoTone";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility";
import { useEffect, useMemo, useRef, useState } from "react";
import LDSCplot from "./ldsc";
import { iCRE_LDSC_BASELINE_QUERY, ICRE_STUDIES, pValMarks, scale } from "./const";
import { iCRE_LDSC_QUERY } from "./const";

export type LDSCDataPoint = {
  snps: number;
  study: string;
  stimulation: string;
  h2: number;
  enrichment: number;
  enrichment_p: number;
  enrichment_std_error: number;
  coefficient: number;
  coefficient_zscore: number;
  coefficient_std_error: number;
  celltype: string;
  expvalue: string;
  lineage: string;
  biosample: string;
  biosampleid: string;
  biosampleorder: number;
  source: string;
};

export default function Phenotype() {
  const [selectedStudy, setSelectedStudy] = useState<string>("BCX2.BasophilCount");
  const [pValCutoff, setPValCutoff] = useState<number>(0.05);
  const [stimView, setStimView] = useState<"S" | "U" | "B">("B");

  const { data: dataStudies } = useQuery(ICRE_STUDIES);

  const { data: dataiCRELDSC, loading: loadingiCRELDSC } = useQuery(iCRE_LDSC_QUERY, {
    variables: { study: selectedStudy },
    skip: !selectedStudy,
  });

  const { data: dataBaseline } = useQuery(iCRE_LDSC_BASELINE_QUERY, {
    variables: { study: selectedStudy },
    skip: !selectedStudy,
  });

  const legendEntries = useMemo(() => {
    if (!dataiCRELDSC) return [];
    // Count occurrences of each unique cellType
    const cellTypeCounts = dataiCRELDSC.iCRELdscQuery.reduce((acc, point) => {
      const cellType = point.lineage;
      acc.set(cellType, (acc.get(cellType) || 0) + 1);
      return acc;
    }, new Map<string, number>());
    return [...cellTypeCounts.entries()]
      .map(([cellType, count]) => ({
        label: getCellCategoryDisplayname(cellType),
        color: getCellCategoryColor(cellType),
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .concat({
        label: "Baseline",
        color: "#000000", // gray color for baseline
        value: dataBaseline?.iCRELdscBaselineQuery.filter((x) => !x.celltype.startsWith("MAF_Adj")).length || 0,
      });
  }, [dataiCRELDSC, dataBaseline]);

  let LDSCStudies = dataStudies && dataStudies.iCRELdscStudiesQuery;

  const data = useMemo(() => {
    if (!dataiCRELDSC || !dataBaseline) return [] as LDSCDataPoint[];
    const rawData: LDSCDataPoint[] = dataiCRELDSC.iCRELdscQuery;
    const rawDataSorted = [...rawData].sort((a, b) => a.biosampleorder - b.biosampleorder);

    const baselineData: LDSCDataPoint[] = dataBaseline.iCRELdscBaselineQuery;
    const baselineFiltered = baselineData.filter((x) => !x.celltype.startsWith("MAF_Adj"));
    return [...rawDataSorted, ...baselineFiltered];
  }, [dataiCRELDSC, dataBaseline]);

  const svgRef = useRef<SVGSVGElement>(null);

  const rotate = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const theme = useTheme();
  const [currentBreakpoint, setCurrentBreakpoint] = useState("xs");

  // refactor using MUI
  useEffect(() => {
    const handleResize = () => {
      const breakpoint = theme.breakpoints.values;
      const width = window.innerWidth;
      let newBreakpoint = "xs";
      if (width >= breakpoint.lg) newBreakpoint = "lg";
      else if (width >= breakpoint.md) newBreakpoint = "md";
      else if (width >= breakpoint.sm) newBreakpoint = "sm";
      setCurrentBreakpoint(newBreakpoint);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [theme.breakpoints.values]);

  return (
    <Grid2 container mt={3} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
      <Grid2 margin={"auto"} width={"75%"}>
        <Box margin={"auto"} maxWidth={600} display={"flex"} flexDirection={"column"} justifyContent={"center"} gap={2}>
          {/* Header */}
          <Box>
            <Typography variant="h4">LD Score Regression by Phenotype</Typography>
          </Box>
          <Typography>
            Select a phenotype to explore its heritability enrichment (calculated by LD score regression) within 736
            immune cell experiments.
          </Typography>
          {/* Autocomplete */}
          {LDSCStudies && LDSCStudies.length > 0 && (
            <Autocomplete
              fullWidth
              options={LDSCStudies.slice().sort((a, b) => a.category.localeCompare(b.category))}
              groupBy={(option) => option.category}
              getOptionLabel={(option) => option.disease}
              renderInput={(params) => <TextField {...params} label="Select Study" />}
              filterOptions={(options, { inputValue }) =>
                options.filter(
                  (option) =>
                    option.disease.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.category.toLowerCase().includes(inputValue.toLowerCase())
                )
              }
              value={LDSCStudies.find((l) => l.value === selectedStudy)}
              onChange={(_, value) => value && setSelectedStudy(value.value)}
              renderOption={(props, option) => (
                <li {...props} key={option.value + option.study_source}>
                  <div>
                    <Typography variant="body1">{option.disease}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {option.study_source} {option.author && `${option.author.replace(/(\d+)$/, " $1")}`}
                    </Typography>
                  </div>
                </li>
              )}
            />
          )}
          {/* Slider */}
          <Box>
            <FormLabel>
              <i>P</i> Cutoff
            </FormLabel>
            <Slider
              min={0} //Min/Max is 0/4 since that is the true value of the marks above
              max={4}
              defaultValue={3}
              scale={scale} //Allows the slider to access the scaled values which we want displayed
              aria-label="Restricted values"
              onChange={(event: Event, value: number, activeThumb: number) => setPValCutoff(scale(value))} //Sets p value cutoff to scaled value
              getAriaValueText={(value: number, index: number) => value.toString()}
              step={null}
              valueLabelDisplay="auto"
              marks={pValMarks}
            />
          </Box>
          {/* Button Group */}
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Showing experiments in cells that are: </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={"B"}
              onChange={(_, value: "B" | "U" | "S") => setStimView(value)}
            >
              <FormControlLabel
                value="B"
                control={<Radio />}
                label={
                  <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                    <Typography>Unstimulated & Stimulated</Typography>
                    <CircleTwoToneIcon fontSize="small" color="primary" sx={{ fontSize: 12 }} />
                    <ChangeHistoryTwoToneIcon color="primary" sx={{ fontSize: 14 }} />
                  </Stack>
                }
              />
              <FormControlLabel
                value="U"
                control={<Radio />}
                label={
                  <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                    <Typography>Unstimulated</Typography>
                    <CircleTwoToneIcon fontSize="small" color="primary" sx={{ fontSize: 12 }} />
                  </Stack>
                }
              />
              <FormControlLabel
                value="S"
                control={<Radio />}
                label={
                  <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                    <Typography>Stimulated</Typography>
                    <ChangeHistoryTwoToneIcon color="primary" sx={{ fontSize: 14 }} />
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid2>
      {/* LDSC Plot */}
      <Grid2 margin={"auto"} width={"75%"} display={"flex"} justifyContent={"center"} mb={2}>
        {loadingiCRELDSC ? (
          <CircularProgress />
        ) : (
          data && (
            <Box
              p={2}
              border={"1px solid #e0e0e0"}
              borderRadius={1}
              height={"auto"}
              width={"auto"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"flex-start"}
            >
              <LDSCplot
                svgRef={svgRef}
                width={currentBreakpoint === "md" ? "900px" : "1200px"}
                height={currentBreakpoint === "md" ? "300px" : "400px"}
                data={data}
                pValCutoff={pValCutoff}
                stimView={stimView}
                legendEntries={legendEntries}
                rotate={rotate}
              />
              <Legend legendEntries={legendEntries} />
            </Box>
          )
        )}
      </Grid2>
    </Grid2>
  );
}

function Legend({ legendEntries }: { legendEntries: { label: string; color: string; value: number }[] }) {
  return (
    <Box
      display={"flex"}
      flexDirection={{ sm: "column", md: "row" }}
      justifyContent={"space-evenly"}
      flexWrap={"wrap"}
      gap={2}
      alignItems={"center"}
    >
      {legendEntries.map((entry, i) => (
        <Box key={i} display="flex" alignItems="center" gap={1} paddingInline={2}>
          <Box sx={{ width: "12px", height: "12px", backgroundColor: entry.color }} />
          <Typography variant="body2">
            {entry.label}: {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
