"use client";
import { Typography, Box, Button, Stack, IconButton, Tooltip } from "@mui/material";
import { Assembly, GenomicRange } from "types/globalTypes";
import { useCcreData } from "common/hooks/useCcreData";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useMemo, useState } from "react";
import ConfigureGBModal from "./ConfigureGBModal";
import { RegistryBiosample } from "app/_biosampleTables/types";
import { CancelRounded } from "@mui/icons-material";
import { usePathname } from "next/navigation";
const IntersectingCcres = ({ region, assembly }: { region: GenomicRange; assembly: string }) => {
  //const [open, setOpen] = useState(false);
  const [selectedBiosample, setSelectedBiosample] = useState<RegistryBiosample | null>(null);
  const pathName = usePathname();
  const entityId = pathName.split("/")[3];

  const biosample = useMemo<RegistryBiosample | null>(() => {
    if (selectedBiosample) {
      return selectedBiosample;
    } else if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`${entityId}-selectedBiosample`);
      if (stored) {
        return (JSON.parse(stored));
      }
    } else {
      return null;
    }
  }, [entityId, selectedBiosample]);

  const {
    data: dataCcres,
    loading: loadingCcres,
    error: errorCcres,
  } = useCcreData({
    coordinates: region,
    assembly: assembly as Assembly,
    nearbygeneslimit: 1,
    cellType: biosample ? biosample.name : undefined,
  });

  
  //Not really sure how this works, but only way to anchor the popper since the extra toolbarSlot either gets unrendered or unmouted after
  //setting the anchorEl to the button
  const [virtualAnchor, setVirtualAnchor] = useState<{
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

  const handleClickClose = () => {
    if (virtualAnchor) {
      setVirtualAnchor(null);
    }
  };
  const showAtac = biosample ? (biosample && biosample.atac ? true : false) : true;
  const showCTCF = biosample ? (biosample && biosample.ctcf ? true : false) : true;
  const showDNase = biosample ? (biosample && biosample.dnase ? true : false) : true;
  const showH3k27ac = biosample ? (biosample && biosample.h3k27ac ? true : false) : true;
  const showH3k4me3 = biosample ? (biosample && biosample.h3k4me3 ? true : false) : true;

  const handleBiosampleSelected = (biosample: RegistryBiosample | null) => {
    if (biosample) {
      setSelectedBiosample(biosample);
      sessionStorage.setItem(`${entityId}-selectedBiosample`, JSON.stringify(biosample));
    } else {
      setSelectedBiosample(undefined);
      sessionStorage.removeItem(`${entityId}-selectedBiosample`);
    }
  };

  const columns: GridColDef<(typeof dataCcres)[number]>[] = [
    {
      field: "info.accession",
      renderHeader: () => (
        <strong>
          <p>Accession</p>
        </strong>
      ),
      valueGetter: (_, row) => row.info.accession,
      renderCell: (params) => (
        <LinkComponent href={`/${assembly}/ccre/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "pct",
      renderHeader: () => (
        <strong>
          <p>Class</p>
        </strong>
      ),
      valueGetter: (_, row) =>
        row.pct === "PLS"
          ? "Promoter"
          : row.pct === "pELS"
          ? "Proximal Enhancer"
          : row.pct === "dELS"
          ? "Distal Enhancer"
          : row.pct,
    },
    {
      field: "chrom",
      renderHeader: () => (
        <strong>
          <p>Chromosome</p>
        </strong>
      ),
    },
    {
      field: "start",
      renderHeader: () => (
        <strong>
          <p>Start</p>
        </strong>
      ),
      valueGetter: (_, row) => row.start.toLocaleString(),
    },
    {
      field: "end",
      renderHeader: () => (
        <strong>
          <p>End</p>
        </strong>
      ),
      valueGetter: (_, row) => (row.start + row.len).toLocaleString(),
      sortComparator: (v1, v2) => v1 - v2,
    },
    ...(showDNase ?  [{
      field: biosample && biosample.dnase ? "ctspecific.dnase_zscore" : "dnase_zscore",
      renderHeader: () => (
        <strong>
          <p>DNase</p>
        </strong>
      ),
      valueGetter: (_, row) => biosample && biosample.dnase ? row.ctspecific.dnase_zscore.toFixed(2) :  row.dnase_zscore.toFixed(2),
    }]: []),
    ...(showAtac
      ? [
          {
            field: biosample && biosample.atac  ? "ctspecific.atac_zscore" : "atac_zscore" ,
            renderHeader: () => (
              <strong>
                <p>ATAC</p>
              </strong>
            ),
            valueGetter: (_, row) => biosample && biosample.atac  ? row.ctspecific.atac_zscore.toFixed(2) :  row.atac_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showCTCF
      ? [
          {
            field: biosample && biosample.ctcf  ? "ctspecific.ctcf_zscore" : "ctcf_zscore",
            renderHeader: () => (
              <strong>
                <p>CTCF</p>
              </strong>
            ),
            valueGetter: (_, row) =>  biosample && biosample.ctcf ? row.ctspecific.ctcf_zscore.toFixed(2) : row.ctcf_zscore.toFixed(2),
          },
        ]
      : []),
   ...(showH3k27ac ? [{
      field:  biosample && biosample.h3k27ac ? "ctspecific.h3k27ac_zscore": "enhancer_zscore" ,
      renderHeader: () => (
        <strong>
          <p>H3K27ac</p>
        </strong>
      ),
      valueGetter: (_, row) => biosample && biosample.h3k27ac ? row.ctspecific.h3k27ac_zscore.toFixed(2) :  row.enhancer_zscore.toFixed(2),
    }]: []),
   ...(showH3k4me3 ?  [{
      field: biosample && biosample.h3k4me3 ? "ctspecific.h3k4me3_zscore" :  "promoter_zscore",
      renderHeader: () => (
        <strong>
          <p>H3K4me3</p>
        </strong>
      ),
      valueGetter: (_, row) => biosample && biosample.h3k4me3 ? row.ctspecific.h3k4me3_zscore.toFixed(2) : row.promoter_zscore.toFixed(2),
    }]: []),
    {
      field: "nearestgene",
      renderHeader: () => (
        <strong>
          <p>Nearest&nbsp;Gene</p>
        </strong>
      ),
      valueGetter: (_, row) => `${row.nearestgenes[0].gene} - ${row.nearestgenes[0].distance.toLocaleString()} bp`,
      renderCell: (params) => (
        <span>
        <LinkComponent href={`/${assembly}/gene/${params.row.nearestgenes[0].gene}`}>
          <i>{params.row.nearestgenes[0].gene}</i>
        </LinkComponent>
        &nbsp;- {params.row.nearestgenes[0].distance.toLocaleString()} bp
        </span>
      ),
      
    },
  ];

  return errorCcres ? (
    <Typography>Error Fetching Ccres</Typography>
  ) : (
    <>
      
        {biosample && (
          <Stack
            borderRadius={1}
            direction={"row"}
            justifyContent={"space-between"}
            sx={{ backgroundColor: theme => theme.palette.secondary.light }}
            alignItems={"center"}
            width={"fit-content"}
          >
            <Typography
              sx={{ color: "#2C5BA0", pl: 1 }}
            >
              <b>Selected Biosample: </b>
              {" " + biosample.ontology.charAt(0).toUpperCase() +
                biosample.ontology.slice(1) +
                " - " +
                biosample.displayname}
            </Typography>
            <IconButton
              onClick={() => handleBiosampleSelected(null)}
            >
              <CancelRounded />
            </IconButton>
          </Stack>
        )}
      <Table
        showToolbar
        rows={dataCcres || []}
        columns={columns}
        loading={loadingCcres}
        label={`Intersecting cCREs`}
        emptyTableFallback={"No intersecting cCREs found in this region"}
        toolbarSlot={
          <Tooltip title="Advanced Filters">
            <Button variant="outlined" onClick={handleClick}>
            Select Biosample
            </Button>
          </Tooltip>
        }
      />
      <Box
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation();
        }}
      >
        
        <ConfigureGBModal
          assembly={assembly as Assembly}
          open={Boolean(virtualAnchor)}
          setOpen={handleClickClose}
          onBiosampleSelect={handleBiosampleSelected}
        />
      </Box>
    </>
  );
};

export default IntersectingCcres;
