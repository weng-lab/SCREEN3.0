import { Box, Button, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import useNearbycCREs from "common/hooks/useNearBycCREs";
import { useCcreData } from "common/hooks/useCcreData";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, GridColDef } from "@weng-lab/ui-components";
import CalculateIcon from '@mui/icons-material/Calculate';
import React, { useMemo, useState } from "react";
import CalculateNearbyCCREsPopper from "../_Gene/CalcNearbyCCREs";
import { usePathname } from "next/navigation";
import { Assembly } from "types/globalTypes";
import { InfoOutlineRounded } from "@mui/icons-material";

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

export default function DistanceLinkedCcres({
  geneData,
}: {
  geneData: UseGeneDataReturn<{ name: string }>;
}) {
  const pathname = usePathname()
  const assembly = pathname.split("/")[1]

  const [calcMethod, setCalcMethod] = useState<"body" | "tss" | "3gene">("tss");
  const [distance, setDistance] = useState<number>(10000);

  const { data: dataNearby, loading: loadingNearby } = useNearbycCREs(geneData, calcMethod, assembly as Assembly, distance);

  const [virtualAnchor, setVirtualAnchor] = React.useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (virtualAnchor) {
      // If already open, close it
      setVirtualAnchor(null);
    } else {
      // Open it, store the current position
      const rect = event.currentTarget.getBoundingClientRect();
      setVirtualAnchor({
        getBoundingClientRect: () => rect,
      });
    }
  };

  const handleMethodChange = (method: "body" | "tss" | "3gene") => {
    setCalcMethod(method);
  }

  const handleDistanceChange = (distance: number) => {
    setDistance(distance);
  }

  const handleClickAway = () => {
    if (virtualAnchor) {
      setVirtualAnchor(null);
    }
  };

  const {
    data: dataCcreDetails,
    loading: loadingCcreDetails,
  } = useCcreData({ accession: dataNearby?.map((d) => d.ccre), assembly: "GRCh38" });

  const nearbyccres = dataNearby
    ?.map((d) => {
      let f = dataCcreDetails?.find((c) => c.info.accession === d.ccre);
      return {
        ...d,
        chromosome: f?.chrom,
        start: f?.start,
        end: f?.start + f?.len,
        group: f?.pct,
        distance: Math.abs(f?.start - d.start) || 0,
      };
    })

  const cols: GridColDef[] = [
    {
      field: "ccre",
      headerName: "Accession",
      renderCell: (params) => {
        return (
          <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
            {params.value}
          </LinkComponent>
        );
      },
    },
    {
      field: "group",
      headerName: "Class",
      renderCell: (params) => (
        <Tooltip
          title={
            <div>
              See{" "}
              <LinkComponent
                openInNewTab
                color="inherit"
                showExternalIcon
                href="https://screen.wenglab.org/about#classifications"
              >
                SCREEN
              </LinkComponent>{" "}
              for Class definitions
            </div>
          }
        >
          <span>{params.value}</span>
        </Tooltip>
      ),
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
      field: "distance",
      headerName: "Distance",
      renderHeader: () => (
        <>
          Distance from&nbsp;<i>{geneData.data.name}</i>
        </>
      ),
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
  ];

  return (
    <Box width={"100%"}>
      <Table
        rows={nearbyccres}
        columns={cols}
        label={"Nearby cCREs"}
        loading={geneData.loading || loadingNearby || loadingCcreDetails}
        initialState={{
          sorting: {
            sortModel: [{ field: "distance", sort: "asc" }],
          },
        }}
        emptyTableFallback={
          <Stack direction={"row"} border={"1px solid #e0e0e0"} borderRadius={1} p={2} alignItems={"center"} justifyContent={"space-between"}>
            <Stack direction={"row"} spacing={1}>
              <InfoOutlineRounded />
              <Typography>No Nearby cCREs Found</Typography>
            </Stack>
            <Tooltip title="Calculate Nearby cCREs by">
              <Button
                onClick={handleClick}
                variant="outlined"
                endIcon={<CalculateIcon />}
              >
                Change Method
              </Button>
            </Tooltip>
          </Stack>
        }
        divHeight={{ maxHeight: "400px" }}
        toolbarSlot={
          <Tooltip title="Calculate Nearby cCREs by">
            <Button
              onClick={handleClick}
              variant="outlined"
              endIcon={<CalculateIcon />}
            >
              Change Method
            </Button>
          </Tooltip>
        }
        labelTooltip={
          <>
            {calcMethod === "tss" && (
              <Typography component="span" variant="subtitle2">(Within {distance} bp of TSS of <i>{geneData.data.name}</i>)</Typography>
            )}
            {calcMethod === "3gene" && (
              <Typography component="span" variant="subtitle2">(<i>{geneData.data.name}</i> is 1 of 3 closest genes to cCRE)</Typography>
            )}
            {calcMethod === "body" && (
              <Typography component="span" variant="subtitle2">(Within <i>{geneData.data.name}</i> gene body)</Typography>
            )}
          </>
        }
      />
      <CalculateNearbyCCREsPopper
        open={Boolean(virtualAnchor)}
        anchorEl={virtualAnchor}
        handleClickAway={handleClickAway}
        distance={distance}
        geneName={geneData.data.name}
        calcMethod={calcMethod}
        handleDistanceChange={handleDistanceChange}
        handleMethodChange={handleMethodChange}
      />
    </Box>
  );
}