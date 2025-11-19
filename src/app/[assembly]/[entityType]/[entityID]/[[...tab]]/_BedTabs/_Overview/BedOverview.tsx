"use client";
import { Stack } from "@mui/system";
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { decodeRegions } from "common/utility";
import { useMemo, useState } from "react";
import { GenomicRange } from "common/types/generated/graphql";
import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel, Table } from "@weng-lab/ui-components";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { LinkComponent } from "common/components/LinkComponent";
import Image from "next/image";
import Link from "next/link";

const BedOverview = ({ entity }: EntityViewComponentProps) => {
  const [selected, setSelected] = useState<GenomicRange[]>([]);

  const CcreIconPath = "/assets/CcreIcon.svg";
  const GeneIconPath = "/assets/GeneIcon.svg";
  const VariantIconPath = "/assets/VariantIcon.svg";

  const regions: GenomicRange[] = useMemo(() => {
    if (typeof window === "undefined") return null;
    const encoded = sessionStorage.getItem(entity.entityID);
    return decodeRegions(encoded);
  }, [entity.entityID]);

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) => (
    <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>
  );

  const columns: GridColDef<GenomicRange>[] = [
    {
      ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef<GenomicRange>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
      sortable: true,
      hideable: false,
      renderHeader: StopPropagationWrapper,
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
    },
    {
      field: "start",
      headerName: "Start",
      valueFormatter: (value: number) => value.toLocaleString(),
    },
    {
      field: "end",
      headerName: "End",
      valueFormatter: (value: number) => value.toLocaleString(),
    },
    {
      field: "link",
      headerName: "New Tab",
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (_, row) => {
        return `${row.chromosome}:${row.start}-${row.end}`;
      },
      renderCell: (params) => {
        return (
          <LinkComponent href={`/${entity.assembly}/ccre/${params.value}`}>
            <IconButton size="small">
              <OpenInNew fontSize="small" />
            </IconButton>
          </LinkComponent>
        );
      },
    },
  ];

  const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
    if (newRowSelectionModel.type === "include") {
      const newIds = Array.from(newRowSelectionModel.ids);
      const selectedRows = newIds.map((id) => regions.find((row) => row.start === id));
      setSelected(selectedRows);
    } else {
      // if type is exclude, it's always with 0 ids (aka select all)
      setSelected(regions);
    }
  };

  const rowSelectionModel: GridRowSelectionModel = useMemo(() => {
    return { type: "include", ids: new Set(selected.map((x) => x.start)) };
  }, [selected]);

  return (
    <Stack spacing={1}>
      <Grid container spacing={2}>
        {/* Table */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Table
            showToolbar
            rows={regions || []}
            columns={columns}
            loading={regions === null}
            label={`Uploaded Regions`}
            emptyTableFallback={"No Regions Uploaded"}
            divHeight={{ maxHeight: "600px" }}
            checkboxSelection
            getRowId={(row: GenomicRange) => row.start}
            onRowSelectionModelChange={handleRowSelectionModelChange}
            rowSelectionModel={rowSelectionModel}
            keepNonExistentRowsSelected
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <InfoCard
              icon={CcreIconPath}
              label="Overlapping cCREs"
              value={42}
              path={`/${entity.assembly}/${entity.entityType}/${entity.entityID}/ccres`}
            />
            <InfoCard
              icon={GeneIconPath}
              label="Overlapping Genes"
              value={7}
              path={`/${entity.assembly}/${entity.entityType}/${entity.entityID}/genes`}
            />
            <InfoCard
              icon={VariantIconPath}
              label="Overlapping Variants"
              value={128}
              path={`/${entity.assembly}/${entity.entityType}/${entity.entityID}/variants`}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

const InfoCard = ({ icon, label, value, path }: { icon: string; label: string; value: number; path: string }) => (
  <Box
    component={Link}
    href={path}
    sx={{
      p: 2,
      borderRadius: 2,
      boxShadow: 2,
      textAlign: "center",
      bgcolor: "background.paper",
      textDecoration: "none",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      transformOrigin: "center",
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: 6,
        zIndex: 2,
      },
    }}
  >
    <Image src={icon} alt={label} width={60} height={60} />
    <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>{label}</Typography>
    <Typography sx={{ fontSize: "2rem", fontWeight: 600, color: "text.primary" }}>{value}</Typography>
  </Box>
);

export default BedOverview;
