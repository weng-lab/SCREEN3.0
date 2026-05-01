import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import { LinkComponent } from "common/components/LinkComponent";
import { Alert, CircularProgress, IconButton, Slider, styled, Tooltip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { ParentSize } from "@visx/responsive";
import { Nucleotide, PhyloTree, SequenceAlignmentPlot, TooltipData } from "@weng-lab/visualization";
import { capitalizeFirstLetter } from "common/utility";
import { InfoOutline, SettingsBackupRestore, Tune } from "@mui/icons-material";
import Button from "@mui/material/Button";
import SpeciesSelect from "./SpeciesSelect";
import {
  getColor,
  getColorLabel,
  getLabel,
  getOrder,
  getPrimateGroup,
  makeAlignmentPlotData,
  SPECIES_ORDER_IN_API_RETURN,
  SpeciesRow,
  phyloTreeRoot,
  allSpecies,
} from "./utils";
import { GenomicRange } from "common/types/globalTypes";
import { useCcreData } from "common/hooks/useCcreData";
import { AnyOpenEntity } from "common/OpenEntitiesContext";

const DEFAULT_RANGE: [number, number] = [0.9, 1];

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

type PlotTooltipProps = {
  speciesId: string;
  coverage: number;
  position?: {
    chromosome: string;
    relativePosition: number;
    absolutePosition: number;
    nucleotide: Nucleotide;
  };
};

const PlotTooltip = ({ speciesId, coverage, position }: PlotTooltipProps) => (
  <div
    style={{
      fontSize: 12,
    }}
  >
    <div style={{ fontWeight: 600 }}>{getLabel(speciesId)}</div>
    <div>{speciesId.replaceAll("_", " ")}</div>
    <div>{capitalizeFirstLetter(getOrder(speciesId).toLowerCase())}</div>
    {getPrimateGroup(speciesId) && <div>{getColorLabel(speciesId)}</div>}
    <div>{(coverage * 100).toFixed(1)}% coverage</div>
    {position && (
      <div>{`${position.chromosome}:${position.absolutePosition.toLocaleString()} (Pos ${position.relativePosition}) • ${position.nucleotide}`}</div>
    )}
  </div>
);

const SequenceCoverage = ({ entity }: { entity: AnyOpenEntity }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<Set<string>>(allSpecies);
  const [speciesSelectOpen, setSpeciesSelectOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<string[]>([]);
  const [displayRange, setDisplayRange] = useState<[number, number]>(DEFAULT_RANGE);
  const [appliedRange, setAppliedRange] = useState<[number, number]>(DEFAULT_RANGE);

  const handleSeqPlotHoverChange = useCallback((newHovered: string | null) => {
    setHovered(newHovered ? [newHovered] : []);
  }, []);

  const {
    data: dataCcre,
    loading: loadingCcre,
    error: errorCcre,
  } = useCcreData({
    assembly: entity.assembly,
    accession: entity.entityID,
  });

  const {
    data: dataSeq,
    loading: loadingSeq,
    error: errorSeq,
  } = useQuery(SEQ_ALIGNMENT_QUERY, {
    variables: {
      assembly: entity.assembly,
      accession: entity.entityID,
    },
    skip: entity.assembly === "mm10",
  });

  const hasSequenceAlignmentData = Boolean(dataSeq?.ccreSequenceAlignmentQuery[0]?.sequence_alignment)

  const coordinates: GenomicRange = useMemo(() => {
    if (!dataCcre) return null;
    return { chromosome: dataCcre.chrom, start: dataCcre.start, end: dataCcre.start + dataCcre.len };
  }, [dataCcre]);

  const unfilteredAlignmentPlotData = useMemo(() => {
    if (!hasSequenceAlignmentData) return null;
    return makeAlignmentPlotData(
      dataSeq.ccreSequenceAlignmentQuery[0].sequence_alignment,
      SPECIES_ORDER_IN_API_RETURN
    );
  }, [dataSeq, hasSequenceAlignmentData]);

  const filteredAlignmentPlotData = useMemo(() => {
    if (selectedSpecies.size === SPECIES_ORDER_IN_API_RETURN.length) return unfilteredAlignmentPlotData;
    else
      return Object.fromEntries(
        Object.entries(unfilteredAlignmentPlotData).filter(([species, _]) => selectedSpecies.has(species))
      );
  }, [unfilteredAlignmentPlotData, selectedSpecies]);

  const speciesCoverageData: SpeciesRow[] = useMemo(() => {
    if (!hasSequenceAlignmentData || !unfilteredAlignmentPlotData) {
      return [];
    }
    const totalLength = dataSeq.ccreSequenceAlignmentQuery[0].sequence_alignment[0].length;

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
  }, [dataSeq, hasSequenceAlignmentData, unfilteredAlignmentPlotData]);

  const highlightedSpecies = useMemo(
    () =>
      speciesCoverageData
        .filter((s) => s.coverage >= appliedRange[0] && s.coverage <= appliedRange[1])
        .map((s) => s.id),
    [speciesCoverageData, appliedRange]
  );

  const speciesInRangeCount = useMemo(
    () =>
      speciesCoverageData.filter(
        (s) => s.coverage >= displayRange[0] && s.coverage <= displayRange[1]
      ).length,
    [speciesCoverageData, displayRange]
  );

  const SeqAlignTooltip = useCallback(
    (tooltipData: TooltipData) => {
      return (
        <PlotTooltip
          speciesId={tooltipData.id}
          coverage={speciesCoverageData.find((x) => x.id === tooltipData.id).coverage}
          position={
            coordinates && tooltipData.position !== undefined
              ? {
                  chromosome: coordinates.chromosome,
                  relativePosition: tooltipData.position,
                  absolutePosition: coordinates.start + tooltipData.position,
                  nucleotide: tooltipData.basePair,
                }
              : undefined
          }
        />
      );
    },
    [coordinates, speciesCoverageData]
  );

  const PhyloTreeTooltip = useCallback(
    (id: string) => {
      return <PlotTooltip speciesId={id} coverage={speciesCoverageData.find((x) => x.id === id).coverage} />;
    },
    [speciesCoverageData]
  );

  if (entity.assembly !== "GRCh38")
    return <Alert severity="info">This feature is only available for Human cCREs</Alert>;

  if (loadingCcre || loadingSeq) return <CircularProgress />;
  if (errorCcre || errorSeq) return <Alert severity="error">Error fetching sequence coverage</Alert>;

  if (dataCcre?.chrom === "chrY")
    return <Alert severity="info">Sequence conservation data is not available for cCREs on the Y chromosome</Alert>;

  if (!hasSequenceAlignmentData) return <Alert severity="error">Error fetching sequence coverage</Alert>;

  return (
    <>
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
          <Box width={300} marginBottom={{ sm: -2 }}>
            <Typography variant="body2" display={"flex"} alignItems={"center"}>
              Coverage Highlight: {displayRange[0] * 100}%{"\u00A0\u2013\u00A0"}{displayRange[1] * 100}%{"\u00A0"}
              <Tooltip
                title="Highlights species whose aligned sequence covers a percentage of the cCRE region within the selected range"
                placement="right-end"
              >
                <InfoOutline fontSize="small" />
              </Tooltip>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {speciesInRangeCount} of {SPECIES_ORDER_IN_API_RETURN.length} species in range
            </Typography>
            <Slider
              value={displayRange}
              onChange={(_, v) => setDisplayRange(v as [number, number])}
              onChangeCommitted={(_, v) => setAppliedRange(v as [number, number])}
              min={0}
              max={1}
              step={0.1}
              size="small"
              valueLabelDisplay="auto"
              getAriaLabel={() => "Sequence coverage range"}
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
      <PlotGridContainer>
        <PlotWrapper>
          <ParentSize>
            {({ width, height }) => (
              <PhyloTree
                width={width}
                height={height}
                data={phyloTreeRoot}
                leafOrder={SPECIES_ORDER_IN_API_RETURN}
                getColor={getColor}
                getLabel={getLabel}
                tooltipContents={PhyloTreeTooltip}
                highlighted={highlightedSpecies}
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
                tooltipContents={SeqAlignTooltip}
                highlighted={highlightedSpecies}
                hovered={hovered}
                onHoverChange={handleSeqPlotHoverChange}
              />
            )}
          </ParentSize>
        </PlotWrapper>
      </PlotGridContainer>
      <SpeciesSelect
        open={speciesSelectOpen}
        onClose={() => setSpeciesSelectOpen(false)}
        species={speciesCoverageData}
        selectedSpecies={selectedSpecies}
        onSelectionChange={setSelectedSpecies}
      />
    </>
  );
};

export default SequenceCoverage;
