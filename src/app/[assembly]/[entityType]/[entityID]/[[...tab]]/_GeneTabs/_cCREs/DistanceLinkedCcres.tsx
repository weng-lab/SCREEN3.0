"use client";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { useCcreData, UseCcreDataParams } from "common/hooks/data/ccre";
import { UseGeneDataReturn } from "common/hooks/data/gene";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, TableColDef } from "@weng-lab/ui-components";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useMemo, useState, useRef } from "react";
import CalculateNearbyCCREsPopper, { formatTssOffset } from "../_Gene/CalcNearbyCCREs";
import { Assembly, GenomicRange } from "common/types/globalTypes";
import { InfoOutlineRounded } from "@mui/icons-material";
import { calcDistCcreToTSS } from "common/utils";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";
import { useCcresWithGeneInClosest3 } from "common/hooks/data/ccre";
import { useDistanceAnchor } from "common/hooks/ui";

export type Transcript = {
  id: string;
  name: string;
  strand: string;
  coordinates: {
    chromosome: string;
    start: number;
    end: number;
  };
};

export type DistanceLinkMethod = "body" | "tss" | "3gene"

// Signed bp offsets relative to the TSS: negative = upstream, positive = downstream
export type TssRange = [number, number];

function getTssWindows(transcripts: Transcript[], range: TssRange): GenomicRange[] {
  if (!transcripts || transcripts.length === 0) return [];

  const [low, high] = range;

  return transcripts.map((t) => {
    const isPlus = t.strand === "+";
    const tss = isPlus ? t.coordinates.start : t.coordinates.end;
    // Map the signed upstream/downstream range onto genomic coords, flipping for the minus strand
    const a = isPlus ? tss + low : tss - high;
    const b = isPlus ? tss + high : tss - low;
    return {
      chromosome: t.coordinates.chromosome,
      start: Math.max(0, Math.min(a, b)), // prevent negative start
      end: Math.max(a, b),
    };
  });
}

export default function DistanceLinkedCcres({
  geneData,
  assembly,
}: {
  geneData: UseGeneDataReturn<{ name: string; assembly: Assembly }>;
  assembly: Assembly;
}) {
  const [calcMethod, setCalcMethod] = useState<DistanceLinkMethod>("tss");
  const [range, setRange] = useState<TssRange>([-10000, 10000]);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { anchor, tooltip: distanceTooltip } = useDistanceAnchor();


  const handleMethodChange = (method: DistanceLinkMethod) => {
    setCalcMethod(method);
  };

  const handleRangeChange = (range: TssRange) => {
    setRange(range);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  // This gets cCREs whose closest 3 genes includes the input gene. Skip unless calcMethod is 3gene
  const {
    data: dataCcresByClosestGenes,
    loading: loadingCcresByClosestGenes,
    error: errorCcresByClosestGenes,
  } = useCcresWithGeneInClosest3({
    gene: geneData.data?.name,
    assembly,
    skip: calcMethod !== "3gene" || !geneData.data?.name,
  });

  const useCcreDataParams = useMemo(() => {
    switch (calcMethod) {
      case "3gene": // query with accessions from dataCcresByClosestGenes
        return {
          accessions: dataCcresByClosestGenes,
          assembly,
          skip: !dataCcresByClosestGenes,
        };
      case "body": // query with gene body
        if (!geneData.data) {
          return {
            coordinates: [],
            assembly,
            skip: true,
          };
        }
        const { __typename, ...coordinates } = geneData.data.coordinates;
        return {
          coordinates: [coordinates],
          assembly,
        };
      case "tss": // query with regions made using TSS + signed upstream/downstream range
        return {
          coordinates: getTssWindows(geneData.data?.transcripts, range),
          assembly,
          skip: !geneData.data?.transcripts,
        };
    }
  }, [calcMethod, dataCcresByClosestGenes, geneData, range]) satisfies UseCcreDataParams ;

  const { data, loading, error } = useCcreData(useCcreDataParams);
  const isCcreDataLoading = !useCcreDataParams.skip && loading;
  const isClosestGenesLoading = calcMethod === "3gene" && loadingCcresByClosestGenes;

  // useDistanceAnchor speaks middleAnchor/edgeAnchor; calcDistCcreToTSS speaks middle/closest
  const tssAnchor = anchor === "middleAnchor" ? "middle" : "closest";

  // Recomputed when the anchor toggles: distance, direction, and which TSS is closest can all change
  const distanceLinkedCcres = useMemo(() => {
    if (!data) return undefined;
    return data.map((ccre) => {
      const ccreCoords = ccre.coordinates;

      const nearestTranscript = calcDistCcreToTSS(
        ccreCoords,
        geneData.data.transcripts,
        geneData.data.strand as "+" | "-",
        tssAnchor
      );

      return {
        ccre: ccre.accession,
        ...ccreCoords,
        group: ccre.group,
        distance: nearestTranscript.distance,
        direction: nearestTranscript.direction,
        tss: nearestTranscript.transcriptId,
      };
    });
  }, [data, geneData.data, tssAnchor]);

  const cols: TableColDef<typeof distanceLinkedCcres[number]>[] = [
    {
      field: "ccre",
      headerName: "Accession",
      renderCell: (params) => {
        return <LinkComponent href={`/${assembly}/ccre/${params.value}`}>{params.value}</LinkComponent>;
      },
    },
    {
      field: "group",
      headerName: "Class",
      ...ClassificationFormatting,
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
    },
    {
      field: "start",
      headerName: "Start",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "end",
      headerName: "End",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "tss",
      headerName: "Nearest TSS",
      renderHeader: () => (
        <>
          Nearest&nbsp;<i>{geneData?.data?.name}</i>&nbsp;TSS
        </>
      ),
    },
    {
      field: "distance",
      headerName: "Distance to TSS",
      type: "number",
      tooltip: distanceTooltip,
      valueFormatter: (value?: number) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "direction",
      headerName: "Position Relative to TSS",
      type: "singleSelect",
      valueOptions: ["Upstream", "Downstream", "Overlapping"],
      // distance 0 means the cCRE overlaps the TSS, so neither side applies
      valueGetter: (_, row) => (row.distance === 0 ? "Overlapping" : row.direction),
    },
  ];

  const toolbarExtra = useMemo(
    () => (
      <Tooltip title="Calculate Nearby cCREs by">
        <Button
          ref={buttonRef}
          onClick={() => setOpen(true)}
          variant="outlined"
          endIcon={<CalculateIcon />}
        >
          Change Method
        </Button>
      </Tooltip>
    ),
    []
  );

  const emptyTableFallback = useMemo(
    () => (
      <Stack
        direction={"row"}
        border={"1px solid #e0e0e0"}
        borderRadius={1}
        p={2}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} spacing={1}>
          <InfoOutlineRounded />
          <Typography>No Nearby cCREs Found</Typography>
        </Stack>
        {toolbarExtra}
      </Stack>
    ),
    [toolbarExtra]
  );

  const labelTooltip = useMemo(
    () => (
      <>
        {calcMethod === "tss" && (
          <Typography component="span" variant="subtitle2">
            (From {formatTssOffset(range[0])} to {formatTssOffset(range[1])}
            {range[1] !== 0 ? " of TSS" : ""} of <i>{geneData.data?.name}</i>)
          </Typography>
        )}
        {calcMethod === "3gene" && (
          <Typography component="span" variant="subtitle2">
            (<i>{geneData.data?.name}</i> is 1 of 3 closest genes to cCRE)
          </Typography>
        )}
        {calcMethod === "body" && (
          <Typography component="span" variant="subtitle2">
            (Within <i>{geneData.data?.name}</i> gene body)
          </Typography>
        )}
      </>
    ),
    [calcMethod, range, geneData.data?.name]
  );

  return (
    <Box width={"100%"}>
      <Table
        rows={distanceLinkedCcres}
        getRowId={(row) => row.ccre}
        columns={cols}
        label={"Nearby cCREs"}
        loading={geneData.loading || isCcreDataLoading || isClosestGenesLoading}
        initialState={{
          sorting: {
            sortModel: [{ field: "distance", sort: "asc" }],
          },
        }}
        emptyTableFallback={emptyTableFallback}
        divHeight={{ height: assembly === "GRCh38" ? "400px" : "600px" }}
        slotProps={{
          toolbar: {
            extra: toolbarExtra,
            labelTooltip: labelTooltip,
          },
        }}
      />
      <CalculateNearbyCCREsPopper
        open={open}
        anchorEl={buttonRef.current}
        handleClickAway={handleClickAway}
        range={range}
        calcMethod={calcMethod}
        handleRangeChange={handleRangeChange}
        handleMethodChange={handleMethodChange}
      />
    </Box>
  );
}
