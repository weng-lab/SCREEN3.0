"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GridColDef, GridRenderCellParams, Table } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { gql } from "common/types/generated";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { CircularProgress, Slider, styled, Tab, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
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
} from "./utils";
import { capitalizeFirstLetter } from "common/utility";
import { InfoOutline } from "@mui/icons-material";

type orthologRow = {
  accession: string;
  chrom: string;
  start: number;
  stop: number;
};

export const ORTHOLOG_QUERY = gql(`
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

export const SEQ_ALIGNMENT_QUERY = gql(`
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

const phyloTreeRoot = formatNode(data241);

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

  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);

  const handleSetSelectedSpecies = useCallback((newSelected: string[]) => {
    setSelectedSpecies(newSelected);
  }, []);

  const handleBranchClick = useCallback((leafIds: string[]) => {
    setSelectedSpecies((prev) => {
      //if every leaf id in previous state, filter them all out
      if (leafIds.every((id) => prev.includes(id))) {
        return prev.filter((id) => !leafIds.includes(id));
      } else if (prev.length === 241) { //if all selected, reset to none selected
        return [];
      } else {
        return [...prev.filter((id) => !leafIds.includes(id)), ...leafIds];
      }
    });
  }, []);

  const unfilteredAlignmentPlotData = useMemo(() => {
    if (!alignmentData?.ccreSequenceAlignmentQuery[0]?.sequence_alignment) return {};
    return makeAlignmentPlotData(
      alignmentData.ccreSequenceAlignmentQuery[0].sequence_alignment,
      SPECIES_ORDER_IN_API_RETURN,
      sortSpeciesByTreeOrder
    );
  }, [alignmentData]);

  const filteredAlignmentPlotData = useMemo(() => {
    if (!selectedSpecies.length) return unfilteredAlignmentPlotData;
    else
      return Object.fromEntries(
        Object.entries(unfilteredAlignmentPlotData).filter(([species, _]) => selectedSpecies.includes(species))
      );
  }, [unfilteredAlignmentPlotData, selectedSpecies]);

  const [coveragePercentage, setCoveragePercentage] = useState<number>(0.9);

  const SLIDER_STEPS = useMemo(
    () => ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"] as const,
    []
  );
  type SliderStep = (typeof SLIDER_STEPS)[number];

  const highlighted: Record<SliderStep, string[]> | null = useMemo(() => {
    if (!alignmentData?.ccreSequenceAlignmentQuery[0]?.sequence_alignment) return null;
    const length = alignmentData.ccreSequenceAlignmentQuery[0].sequence_alignment[0].length;

    const highlightedLists: Record<SliderStep, string[]> = {} as Record<SliderStep, string[]>;

    for (const step of SLIDER_STEPS) {
      const percentage = parseFloat(step);
      highlightedLists[step] = SPECIES_ORDER_IN_API_RETURN.filter((species) => {
        const gapFilteredLength = unfilteredAlignmentPlotData[species].filter((bp) => bp !== "-").length;
        return gapFilteredLength / length >= percentage;
      });
    }

    return highlightedLists;
  }, [SLIDER_STEPS, alignmentData, unfilteredAlignmentPlotData]);

  const handleSliderChange = (event: Event, newValue: number) => {
    setCoveragePercentage(newValue);
  };

  const [hovered, setHovered] = useState<string[]>([]);

  const handlePhyloTreeHoverChange = (newHovered: string[]) => {
    setHovered(newHovered);
  };

  const handleSeqPlotHoverChange = (newHovered: string | null) => {
    setHovered(newHovered ? [newHovered] : []);
  };

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
            //showToolbar={false}
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
      <StyledTabPanel value={1}>
        <Typography variant="caption">
          For more information about this data, please visit{" "}
          <LinkComponent href={"https://zoonomiaproject.org/"} openInNewTab showExternalIcon>
            https://zoonomiaproject.org/
          </LinkComponent>
        </Typography>
        <Typography variant="body2" display={"flex"} alignItems={"center"} mt={2}>
          Sequence Coverage Threshold: {coveragePercentage * 100}%{"\u00A0"}
          <Tooltip title="Highlights species whose aligned sequence covers x% of the cCRE region" placement="right-end">
            <InfoOutline fontSize="small" />
          </Tooltip>
        </Typography>
        <Slider
          value={coveragePercentage}
          onChange={handleSliderChange}
          marks
          min={0.1}
          max={1}
          step={0.1}
          valueLabelFormat={(x) => `${x * 100}%`}
          sx={{ maxWidth: 300 }}
        />
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
                    onLeafHoverChange={handlePhyloTreeHoverChange}
                    onBranchClick={handleBranchClick}
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
      </StyledTabPanel>
    </TabContext>
  );
};
