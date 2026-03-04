"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GridColDef, GridRenderCellParams, Table } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { gql } from "common/types/generated";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { CircularProgress, IconButton, Slider, styled, Tab, Tooltip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { ParentSize } from "@visx/responsive";
import { PhyloTree, SequenceAlignmentPlot, TooltipData } from "@weng-lab/visualization";
import { data as data241 } from "./241_mammals_treedata";

import {
  formatNode,
  getColor,
  getLabel,
  getOrder,
  makeAlignmentPlotData,
  sortSpeciesByTreeOrder,
  SPECIES_ORDER_IN_API_RETURN,
  SpeciesRow,
} from "./utils";
import { capitalizeFirstLetter } from "common/utility";
import { InfoOutline, SettingsBackupRestore, Tune } from "@mui/icons-material";
import Button from "@mui/material/Button";
import SpeciesSelect from "./SpeciesSelect";

type orthologRow = {
  accession: string;
  chrom: string;
  start: number;
  stop: number;
};

const ORTHOLOG_QUERY = gql(`
  query orthologTab($assembly: String!, $accession: [String!]) {
    orthologQuery(accession: $accession, assembly: $assembly) {
      assembly
      accession
      ortholog {
        stop
        start
        chromosome
        accession
      }
    }
  }
`);

const SEQ_ALIGNMENT_QUERY = gql(`
  query fetchccreSequenceAlignmentQuery(
    $assembly: String!
    $accession: [String]!
  ) {
    ccreSequenceAlignmentQuery(assembly: $assembly, accession: $accession) {
      sequence_alignment
      accession
    }
  }
`);

const PhyloTreeTooltip = (id: string) => (
  <div style={{ fontSize: 12 }}>
    <div style={{ fontWeight: 600 }}>{getLabel(id)}</div>
    <div>{id.replaceAll("_", " ")}</div>
    <div>{capitalizeFirstLetter(getOrder(id).toLowerCase())}</div>
  </div>
);

const SeqAlignTooltipContents = (tooltipData: TooltipData) => (
  <div
    style={{
      fontSize: 12,
    }}
  >
    <div style={{ fontWeight: 600 }}>{tooltipData.label}</div>
    <div>{tooltipData.id.replaceAll("_", " ")}</div>
    <div>{capitalizeFirstLetter(tooltipData.order.toLowerCase())}</div>
    {tooltipData.basePair && tooltipData.position && (
      <div>{`Position ${tooltipData.position} • ${tooltipData.basePair}`}</div>
    )}
  </div>
);

const StyledTabPanel = styled(TabPanel)(() => ({
  padding: 0,
}));

const PlotGridContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
  gap: theme.spacing(2),
}));

const PlotWrapper = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: 600, //define set height for plots, width is determined by ParentSize
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
  minWidth: 0, //allow item to shrink below plot intrinsic dimensions
}));

const phyloTreeRoot = formatNode(data241);

const allSpecies = new Set(SPECIES_ORDER_IN_API_RETURN)

const SLIDER_STEPS = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"]
type SliderStep = (typeof SLIDER_STEPS)[number];

export const Conservation = ({ entity }: EntityViewComponentProps) => {
  const [tab, setTab] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const { loading, error, data } = useQuery(ORTHOLOG_QUERY, {
    variables: {
      assembly: entity.assembly === "GRCh38" ? "grch38" : "mm10",
      accession: entity.entityID,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const {
    data: dataCcre,
    loading: loadingCcre,
    error: errorCcre,
  } = useCcreData({
    assembly: entity.assembly,
    accession: [entity.entityID],
  });

  const ortholog: orthologRow[] = [];
  if (data && data.orthologQuery.length > 0) {
    for (const ccre of data.orthologQuery[0].ortholog) {
      ortholog.push({
        accession: ccre.accession,
        chrom: ccre.chromosome,
        start: ccre.start,
        stop: ccre.stop,
      });
    }
  }

  const cols: GridColDef[] = [
    {
      headerName: "Accession",
      field: "accession",
      renderCell: (params: GridRenderCellParams) => (
        <LinkComponent href={`/${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}/ccre/${params.row.accession}`}>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      headerName: "Chromosome",
      field: "chrom",
    },
    {
      headerName: "Start",
      field: "start",
    },
    {
      headerName: "Stop",
      field: "stop",
    },
  ];

  const conservationCols: GridColDef[] = [
    {
      headerName: "Vertebrates",
      field: "vertebrates",
      valueFormatter: (value: number) => value.toFixed(2),
    },
    {
      headerName: "Mammals",
      field: "mammals",
      valueFormatter: (value: number) => value.toFixed(2),
    },
    {
      headerName: "Primates",
      field: "primates",
      valueFormatter: (value: number) => value.toFixed(2),
    },
  ];

  const {
    data: alignmentData,
    loading: loadingAlignment,
    error: errorAlignment,
  } = useQuery(SEQ_ALIGNMENT_QUERY, {
    variables: {
      assembly: entity.assembly,
      accession: entity.entityID,
    },
    skip: entity.assembly === "mm10",
  });

  const [selectedSpecies, setSelectedSpecies] = useState<Set<string>>(allSpecies);
  const [speciesSelectOpen, setSpeciesSelectOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<string[]>([]);

  const handleSeqPlotHoverChange = useCallback((newHovered: string | null) => {
    setHovered(newHovered ? [newHovered] : []);
  }, []);

  const unfilteredAlignmentPlotData = useMemo(() => {
    if (!alignmentData?.ccreSequenceAlignmentQuery[0]?.sequence_alignment) return {};
    return makeAlignmentPlotData(
      alignmentData.ccreSequenceAlignmentQuery[0].sequence_alignment,
      SPECIES_ORDER_IN_API_RETURN,
      sortSpeciesByTreeOrder
    );
  }, [alignmentData]);

  const speciesCoverageData: SpeciesRow[] = useMemo(() => {
    if (!alignmentData?.ccreSequenceAlignmentQuery[0]?.sequence_alignment || !unfilteredAlignmentPlotData) {
      return [];
    }
    const totalLength = alignmentData.ccreSequenceAlignmentQuery[0].sequence_alignment[0].length;

    return SPECIES_ORDER_IN_API_RETURN.map((speciesId) => {
      const alignmentSequence = unfilteredAlignmentPlotData[speciesId] || [];
      const gapFilteredLength = alignmentSequence.filter((bp: string) => bp !== "-").length;
      const coverage = totalLength > 0 ? gapFilteredLength / totalLength : 0;

      return {
        id: speciesId,
        displayName: getLabel(speciesId),
        order: getOrder(speciesId),
        coverage,
      };
    });
  }, [alignmentData, unfilteredAlignmentPlotData]);

  const filteredAlignmentPlotData = useMemo(() => {
    if (selectedSpecies.size === SPECIES_ORDER_IN_API_RETURN.length) return unfilteredAlignmentPlotData;
    else
      return Object.fromEntries(
        Object.entries(unfilteredAlignmentPlotData).filter(([species, _]) => selectedSpecies.has(species))
      );
  }, [unfilteredAlignmentPlotData, selectedSpecies]);

  const [coveragePercentage, setCoveragePercentage] = useState<number>(0.9);


  const highlighted: Record<SliderStep, string[]> | null = useMemo(() => {
    if (!alignmentData?.ccreSequenceAlignmentQuery[0]?.sequence_alignment) return null;
    const length = alignmentData.ccreSequenceAlignmentQuery[0].sequence_alignment[0].length;

    const highlightedLists: Record<SliderStep, string[]> = {} as Record<SliderStep, string[]>;

    for (const step of SLIDER_STEPS) {
      const percentage = parseFloat(step);
      highlightedLists[step] = SPECIES_ORDER_IN_API_RETURN.filter((species) => {
        const gapFilteredLength = unfilteredAlignmentPlotData[species]?.filter((bp) => bp !== "-").length ?? 0;
        return gapFilteredLength / length >= percentage;
      });
    }

    return highlightedLists;
  }, [alignmentData, unfilteredAlignmentPlotData]);

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Overview" value={0} />
          <Tab label="Coverage across 241 Mammals" value={1} />
        </TabList>
      </Box>
      <StyledTabPanel value={0}>
        {entity.assembly == "GRCh38" && dataCcre && (
          <Table
            label={`Conservation`}
            loading={loadingCcre}
            error={!!errorCcre}
            columns={conservationCols}
            rows={dataCcre}
            hideFooter
            emptyTableFallback={"No Conservation data found"}
            sx={{ mb: 2 }}
          />
        )}
        <Table
          label={`Orthologous cCREs in ${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}`}
          loading={loading}
          error={!!error}
          columns={cols}
          rows={ortholog}
          emptyTableFallback={"No Orthologous cCREs found"}
        />
      </StyledTabPanel>
      <StyledTabPanel value={1} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="caption">
          For more information about this data, please visit{" "}
          <LinkComponent href={"https://zoonomiaproject.org/"} openInNewTab showExternalIcon>
            https://zoonomiaproject.org/
          </LinkComponent>
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent={"space-between"}
          alignItems={{ sm: "flex-end" }}
          spacing={{ xs: 0, sm: 2 }}
        >
          {/* wrapper flex child div to allow child Box to set negative margin for vertical alignment */}
          <div>
            <Box width={{ sm: 300 }} marginBottom={{ sm: -2 }}>
              <Typography variant="body2" display={"flex"} alignItems={"center"}>
                Sequence Coverage Threshold: {coveragePercentage * 100}%{"\u00A0"}
                <Tooltip
                  title="Highlights species whose aligned sequence covers x% of the cCRE region"
                  placement="right-end"
                >
                  <InfoOutline fontSize="small" />
                </Tooltip>
              </Typography>
              <Slider
                value={coveragePercentage}
                onChange={(_, newValue: number) => {
                  setCoveragePercentage(newValue);
                }}
                marks
                min={0.1}
                max={1}
                step={0.1}
                valueLabelFormat={(x) => `${x * 100}%`}
              />
            </Box>
          </div>
          <Box flexShrink={0} display={"flex"} flexBasis={{ xs: "row-reverse", sm: "row" }}>
            {!(selectedSpecies.size === SPECIES_ORDER_IN_API_RETURN.length) && (
              <IconButton onClick={() => setSelectedSpecies(allSpecies)} size="small">
                <SettingsBackupRestore />
              </IconButton>
            )}
            <Button variant="outlined" onClick={() => setSpeciesSelectOpen(true)} startIcon={<Tune />}>
              Filter Sequences ({selectedSpecies.size}/{SPECIES_ORDER_IN_API_RETURN.length})
            </Button>
          </Box>
        </Stack>
        {loadingAlignment || !highlighted ? (
          <CircularProgress />
        ) : (
          <PlotGridContainer>
            <PlotWrapper>
              <ParentSize>
                {({ width, height }) => (
                  <PhyloTree
                    width={width}
                    height={height}
                    data={phyloTreeRoot}
                    getColor={getColor}
                    getLabel={getLabel}
                    tooltipContents={PhyloTreeTooltip}
                    highlighted={highlighted[coveragePercentage.toFixed(1)]}
                    hovered={hovered}
                    onLeafHoverChange={setHovered}
                    defaultScaling="unscaled"
                  />
                )}
              </ParentSize>
            </PlotWrapper>
            <PlotWrapper style={{ padding: 8 }}>
              <ParentSize>
                {({ width, height }) => (
                  <SequenceAlignmentPlot
                    width={width}
                    height={height}
                    data={filteredAlignmentPlotData}
                    getLabel={getLabel}
                    getOrder={getOrder}
                    getOrderColor={getColor}
                    tooltipContents={SeqAlignTooltipContents}
                    highlighted={highlighted[coveragePercentage.toFixed(1)]}
                    hovered={hovered}
                    onHoverChange={handleSeqPlotHoverChange}
                  />
                )}
              </ParentSize>
            </PlotWrapper>
          </PlotGridContainer>
        )}
        <SpeciesSelect
          open={speciesSelectOpen}
          onClose={() => setSpeciesSelectOpen(false)}
          species={speciesCoverageData}
          selectedSpecies={selectedSpecies}
          onSelectionChange={setSelectedSpecies}
        />
      </StyledTabPanel>
    </TabContext>
  );
};
