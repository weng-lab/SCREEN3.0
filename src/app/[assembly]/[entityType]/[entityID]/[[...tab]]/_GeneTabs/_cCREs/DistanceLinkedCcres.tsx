"use client";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { useCcreData, UseCcreDataParams } from "common/hooks/useCcreData";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, TableColDef } from "@weng-lab/ui-components";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useMemo, useState, useRef } from "react";
import CalculateNearbyCCREsPopper from "../_Gene/CalcNearbyCCREs";
import { Assembly, GenomicRange } from "common/types/globalTypes";
import { InfoOutlineRounded } from "@mui/icons-material";
import { calcDistCcreToTSS } from "common/utility";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";
import { gql } from "common/types/generated";
import { useQuery } from "@apollo/client/react";

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


const CCRES_BY_CLOSEST_GENE_QUERY = gql(`
  query getclosestGenetocCRE($geneid: [String]) {
    closestGenetocCRE(geneid: $geneid) {
      ccre
    }
  }
`);

function getTssWindows(transcripts: Transcript[], distance: number): GenomicRange[] {
  if (!transcripts || transcripts.length === 0) return [];

  return transcripts.map((t) => {
    const tss = t.strand === "+" ? t.coordinates.start : t.coordinates.end;
    return {
      chromosome: t.coordinates.chromosome,
      start: Math.max(0, tss - distance), // prevent negative start
      end: tss + distance,
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
  const [distance, setDistance] = useState<number>(10000);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);


  const handleMethodChange = (method: DistanceLinkMethod) => {
    setCalcMethod(method);
  };

  const handleDistanceChange = (distance: number) => {
    setDistance(distance);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  // This gets cCREs whose closest 3 genes includes the input gene. Skip unless calcMethod is 3gene
  const {
    data: dataCcresByClosestGenes,
    loading: loadingCcresByClosestGenes,
    error: errorCcresByClosestGenes,
  } = useQuery(CCRES_BY_CLOSEST_GENE_QUERY, {
    variables: { geneid: geneData.data?.id.split(".")[0] },
    skip: !geneData.data || calcMethod !== "3gene",
  });

  const useCcreDataParams = useMemo(() => {
    switch (calcMethod) {
      case "3gene": // query with accessions from dataCcresByClosestGenes
        return {
          accessions: dataCcresByClosestGenes?.closestGenetocCRE.map((x) => x.ccre) ?? [],
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
      case "tss": // query with regions made using TSS + distance padding
        return {
          coordinates: getTssWindows(geneData.data?.transcripts, distance),
          assembly,
          skip: !geneData.data?.transcripts,
        };
    }
  }, [calcMethod, dataCcresByClosestGenes, geneData, distance]) satisfies UseCcreDataParams ;

  const { data, loading, error } = useCcreData(useCcreDataParams);

  const distanceLinkedCcres = data?.map((ccre) => {
    const ccreCoords = ccre.coordinates;

    const nearestTranscript = calcDistCcreToTSS(
      ccreCoords,
      geneData.data.transcripts,
      geneData.data.strand as "+" | "-",
    );

    //We also need to be aware that the 3gene method is only valid in human

    return {
      ccre: ccre.accession,
      ...ccreCoords,
      group: ccre.group,
      distance: nearestTranscript.distance,
      direction: nearestTranscript.direction,
      tss: nearestTranscript.transcriptId,
    };
  });

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
      renderCell: (params) => {
        if (params.value == null) {
          return "";
        }

        const direction = params.row.distance === 0 ? "" : params.row.direction === "Upstream" ? "-" : "+"
        
        return (
          <span>
            {direction}
            {params.value.toLocaleString()}
          </span>
        );
      },
    },
  ];

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
      </Stack>
    ),
    []
  );

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

  const labelTooltip = useMemo(
    () => (
      <>
        {calcMethod === "tss" && (
          <Typography component="span" variant="subtitle2">
            (Within {distance} bp of TSS of <i>{geneData.data?.name}</i>)
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
    [calcMethod, distance, geneData.data?.name]
  );

  return (
    <Box width={"100%"}>
      <Table
        rows={distanceLinkedCcres}
        columns={cols}
        label={"Nearby cCREs"}
        loading={geneData.loading || loading || loadingCcresByClosestGenes}
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
        distance={distance}
        geneName={geneData.data?.name}
        calcMethod={calcMethod}
        handleDistanceChange={handleDistanceChange}
        handleMethodChange={handleMethodChange}
        assembly={assembly}
      />
    </Box>
  );
}
