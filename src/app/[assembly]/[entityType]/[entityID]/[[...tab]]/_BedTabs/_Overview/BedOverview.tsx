"use client";
import { Stack } from "@mui/system";
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { decodeRegions } from "common/utility";
import { useMemo, useState } from "react";
import { GenomicRange } from "common/types/generated/graphql";
import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef, GridRowSelectionModel, Table } from "@weng-lab/ui-components";
import { Grid, IconButton } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { LinkComponent } from "common/components/LinkComponent";
import OverviewCards from "./OverviewCards";

const BedOverview = ({ entity }: EntityViewComponentProps) => {
  const [selected, setSelected] = useState<GenomicRange[]>([]);

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
      headerName: "Open in New Tab",
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
      <Grid container spacing={2} height={"600px"}>
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
        <Grid size={{ xs: 12, md: 4 }} height={"100%"}>
          <OverviewCards entity={entity} regions={regions} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default BedOverview;
