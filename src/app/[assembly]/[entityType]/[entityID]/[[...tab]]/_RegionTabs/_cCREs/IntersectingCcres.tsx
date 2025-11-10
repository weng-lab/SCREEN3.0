"use client";
import Image from "next/image";
import { Typography, Box, Button, Stack, IconButton, Tooltip } from "@mui/material";
import { useCcreData } from "common/hooks/useCcreData";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useState } from "react";
import { CancelRounded } from "@mui/icons-material";
import { RegistryBiosamplePlusRNA } from "../../../../../../../common/components/BiosampleTables/types";
import BiosampleSelectModal from "common/components/BiosampleSelectModal";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { parseGenomicRangeString } from "common/utility";
import { GROUP_COLOR_MAP } from "common/colors";
import { getProportionsFromArray, ProportionsBar } from "@weng-lab/visualization";
import { CCRE_CLASSES } from "common/consts";
import { classificationFormatting } from "common/components/ClassificationFormatting";

const IntersectingCcres = ({ entity }: EntityViewComponentProps) => {
  const [selectedBiosample, setSelectedBiosample] = useState<RegistryBiosamplePlusRNA | null>(null);

  const {
    data: dataCcres,
    loading: loadingCcres,
    error: errorCcres,
  } = useCcreData({
    coordinates: parseGenomicRangeString(entity.entityID),
    assembly: entity.assembly,
    nearbygeneslimit: 1,
    cellType: selectedBiosample ? selectedBiosample.name : undefined,
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
  const showAtac = selectedBiosample ? (selectedBiosample && selectedBiosample.atac ? true : false) : true;
  const showCTCF = selectedBiosample ? (selectedBiosample && selectedBiosample.ctcf ? true : false) : true;
  const showDNase = selectedBiosample ? (selectedBiosample && selectedBiosample.dnase ? true : false) : true;
  const showH3k27ac = selectedBiosample ? (selectedBiosample && selectedBiosample.h3k27ac ? true : false) : true;
  const showH3k4me3 = selectedBiosample ? (selectedBiosample && selectedBiosample.h3k4me3 ? true : false) : true;

  const handleBiosampleSelected = (biosample: RegistryBiosamplePlusRNA | null) => {
    setSelectedBiosample(biosample);
  };

  const columns: GridColDef<(typeof dataCcres)[number]>[] = [
    {
      field: "info.accession",
      headerName: "Accession",
      valueGetter: (_, row) => row.info.accession,
      renderCell: (params) => (
        <LinkComponent href={`/${entity.assembly}/ccre/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "pct",
      headerName: "Classification",
      ...classificationFormatting,
    },
    {
      field: "chrom",
      headerName: "Chromosome",
    },
    {
      field: "start",
      headerName: "Start",
      type: "number",
      valueFormatter: (value: number) => value?.toLocaleString(),
    },
    {
      field: "end",
      headerName: "End",
      type: "number",
      valueGetter: (_, row) => row.start + row.len,
      valueFormatter: (value: number) => value?.toLocaleString(),
    },
    ...(showDNase
      ? [
          {
            field: "dnase",
            headerName: "DNase",
            type: "number" as const,
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.dnase
                ? row.ctspecific.dnase_zscore.toFixed(2)
                : row.dnase_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showAtac
      ? [
          {
            field: "atac",
            headerName: "ATAC",
            type: "number" as const,
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.atac
                ? row.ctspecific.atac_zscore.toFixed(2)
                : row.atac_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showH3k4me3
      ? [
          {
            field: "h3k4me3",
            headerName: "H3K4me3",
            type: "number" as const,

            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.h3k4me3
                ? row.ctspecific.h3k4me3_zscore.toFixed(2)
                : row.promoter_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showH3k27ac
      ? [
          {
            field: "h3k27ac",
            headerName: "H3K27ac",
            type: "number" as const,
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.h3k27ac
                ? row.ctspecific.h3k27ac_zscore.toFixed(2)
                : row.enhancer_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showCTCF
      ? [
          {
            field: "ctcf",
            headerName: "CTCF",
            type: "number" as const,
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.ctcf
                ? row.ctspecific.ctcf_zscore.toFixed(2)
                : row.ctcf_zscore.toFixed(2),
          },
        ]
      : []),
    {
      field: "nearestgene",
      headerName: "Nearest Gene",
      valueGetter: (_, row) => `${row.nearestgenes[0].gene} - ${row.nearestgenes[0].distance.toLocaleString()} bp`,
      renderCell: (params) => (
        <span>
          <LinkComponent href={`/${entity.assembly}/gene/${params.row.nearestgenes[0].gene}`}>
            <i>{params.row.nearestgenes[0].gene}</i>
          </LinkComponent>
          &nbsp;- {params.row.nearestgenes[0].distance.toLocaleString()} bp
        </span>
      ),
    },
    {
      field: "isicre",
      headerName: "iCRE",
      valueGetter: (_, row) => row.isicre,
      renderCell: (params) => {
        return params.row.isicre ? (
          <LinkComponent href={`https://igscreen.vercel.app/icre/${params.row.info.accession}`} openInNewTab>
            <Image
              src="/igSCREEN_icon.png"
              alt="igSCREEN Helix"
              height={14}
              width={14}
              style={{ verticalAlign: "text-bottom" }} // try "sub" if you want it lower
            />
          </LinkComponent>
        ) : (
          <></>
        );
      },
    },
  ];

  return (
    <Stack spacing={1}>
      {selectedBiosample && (
        <Stack
          borderRadius={1}
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ backgroundColor: (theme) => theme.palette.secondary.light }}
          alignItems={"center"}
          width={"fit-content"}
        >
          <Typography sx={{ color: "#2C5BA0", pl: 1 }}>
            <b>Selected Biosample: </b>
            {" " +
              selectedBiosample.ontology.charAt(0).toUpperCase() +
              selectedBiosample.ontology.slice(1) +
              " - " +
              selectedBiosample.displayname}
          </Typography>
          <IconButton onClick={() => handleBiosampleSelected(null)}>
            <CancelRounded />
          </IconButton>
        </Stack>
      )}
      <ProportionsBar
        data={getProportionsFromArray(dataCcres, "pct", CCRE_CLASSES)}
        label="Classification Proportions"
        loading={loadingCcres || !!errorCcres}
        getColor={(key) => GROUP_COLOR_MAP.get(key).split(":")[1] ?? "black"}
        formatLabel={(key) => GROUP_COLOR_MAP.get(key).split(":")[0] ?? key}
        tooltipTitle="Classification Proportions, Core Collection"
        sortDescending
      />
      <Table
        showToolbar
        rows={dataCcres || []}
        columns={columns}
        loading={loadingCcres}
        error={!!errorCcres}
        label={`Intersecting cCREs`}
        emptyTableFallback={"No intersecting cCREs found in this region"}
        toolbarSlot={
          <Tooltip title="Advanced Filters">
            <Button variant="outlined" onClick={handleClick}>
              Select Biosample
            </Button>
          </Tooltip>
        }
        initialState={{ sorting: { sortModel: [{ field: "dnase", sort: "desc" }] } }}
        divHeight={{ maxHeight: "600px" }}
      />
      <Box
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation();
        }}
      >
        <BiosampleSelectModal
          assembly={entity.assembly}
          open={Boolean(virtualAnchor)}
          setOpen={handleClickClose}
          onChange={(selected) => handleBiosampleSelected(selected[0])}
          initialSelected={selectedBiosample ? [selectedBiosample] : []}
        />
      </Box>
    </Stack>
  );
};

export default IntersectingCcres;
