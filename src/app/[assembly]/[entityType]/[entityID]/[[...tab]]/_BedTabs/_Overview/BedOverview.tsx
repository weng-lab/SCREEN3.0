"use client";
import { Stack } from "@mui/system";
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { decodeRegions } from "common/utility";
import { useMemo } from "react";
import { GenomicRange } from "common/types/generated/graphql";
import {
  // GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  // GridRowSelectionModel,
  Table,
  // useGridApiRef,
} from "@weng-lab/ui-components";
import { Grid, IconButton } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { LinkComponent } from "common/components/LinkComponent";
import OverviewCards from "./OverviewCards";
// import AutoSortSwitch from "common/components/AutoSortSwitch";
import { useCcreData } from "common/hooks/useCcreData";
import { useSnpData } from "common/hooks/useSnpData";
import { useGeneData } from "common/hooks/useGeneData";

type RegionRow = GenomicRange & {
  numCcres: number;
  numGenes: number;
  numSnps: number;
};

const BedOverview = ({ entity }: EntityViewComponentProps) => {
  // const [autoSort, setAutoSort] = useState<boolean>(true);
  // const [selected, setSelected] = useState<RegionRow[]>([]);

  const regions: GenomicRange[] = useMemo(() => {
    if (typeof window === "undefined") return null;
    const encoded = sessionStorage.getItem(entity.entityID);
    return decodeRegions(encoded);
  }, [entity.entityID]);

  const { data: dataCcres, loading: loadingCcres } = useCcreData({
    coordinates: regions,
    assembly: entity.assembly,
    nearbygeneslimit: 1,
    skip: regions === null,
  });

  const { data: dataSnps, loading: loadingSnps } = useSnpData({
    coordinates: regions,
    assembly: "GRCh38",
    skip: regions === null || entity.assembly === "mm10",
  });

  const { data: dataGenes, loading: loadingGenes } = useGeneData({ coordinates: regions, assembly: entity.assembly });

  // convert all coordiantes to Genomic Range for each query
  const ccresRanges: GenomicRange[] = useMemo(
    () =>
      dataCcres?.map((c) => ({
        chromosome: c.chrom,
        start: c.start,
        end: c.start + c.len,
      })) ?? [],
    [dataCcres]
  );

  const geneRanges: GenomicRange[] = useMemo(
    () =>
      dataGenes?.map((g) => ({
        chromosome: g.coordinates.chromosome,
        start: g.coordinates.start,
        end: g.coordinates.end,
      })) ?? [],
    [dataGenes]
  );

  const snpRanges: GenomicRange[] = useMemo(
    () =>
      dataSnps?.map((s) => ({
        chromosome: s.coordinates.chromosome,
        start: s.coordinates.start,
        end: s.coordinates.end,
      })) ?? [],
    [dataSnps]
  );

  // function to check if uploaded region overlaps a given entity's region
  const overlaps = (a: GenomicRange, b: GenomicRange) =>
    a.chromosome === b.chromosome && a.start <= b.end && b.start <= a.end;

  // generate rows with counts of overlapping entities
  const rows: RegionRow[] = useMemo(() => {
    if (!regions) return null;

    return regions.map((region) => ({
      ...region,
      numCcres: ccresRanges?.filter((c) => overlaps(region, c)).length,
      numGenes: geneRanges?.filter((g) => overlaps(region, g)).length,
      numSnps: snpRanges?.filter((s) => overlaps(region, s)).length,
    }));
  }, [regions, ccresRanges, geneRanges, snpRanges]);

  //This is used to prevent sorting from happening when clicking on the header checkbox
  // const StopPropagationWrapper = (params) => (
  //   <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
  //     <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
  //   </div>
  // );

  const columns: GridColDef<RegionRow>[] = [
    // {
    //   ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef<RegionRow>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
    //   sortable: true,
    //   hideable: false,
    //   renderHeader: StopPropagationWrapper,
    // },
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
      field: "numCcres",
      headerName: "Overlapping cCREs",
      aggregable: true,
      valueFormatter: (value: number) => value.toLocaleString(),
    },
    {
      field: "numGenes",
      headerName: "Overlapping Genes",
      valueFormatter: (value: number) => value.toLocaleString(),
    },
    {
      field: "numSnps",
      headerName: "Overlapping Variants",
      valueFormatter: (value: number) => value.toLocaleString(),
    },
    {
      field: "link",
      headerName: "Open in New Tab",
      sortable: false,
      valueGetter: (_, row) => {
        return `${row.chromosome}:${row.start}-${row.end}`;
      },
      renderCell: (params) => {
        return (
          <LinkComponent href={`/${entity.assembly}/region/${params.value}`}>
            <IconButton size="small">
              <OpenInNew fontSize="small" />
            </IconButton>
          </LinkComponent>
        );
      },
    },
  ];

  // const apiRef = useGridApiRef();

  // const AutoSortToolbar = useMemo(() => {
  //   return <AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />;
  // }, [autoSort]);

  // const handleRowSelectionModelChange = (newRowSelectionModel: GridRowSelectionModel) => {
  //   if (!rows) return;

  //   if (newRowSelectionModel.type === "include") {
  //     const newIds = Array.from(newRowSelectionModel.ids);
  //     const selectedRows = rows.filter((row) => newIds.includes(row.start));
  //     setSelected(selectedRows);
  //   } else {
  //     // type === "exclude"  → select all
  //     setSelected(rows);
  //   }
  // };

  // const rowSelectionModel: GridRowSelectionModel = useMemo(() => {
  //   return { type: "include", ids: new Set(selected.map((r) => r.start)) };
  // }, [selected]);

  // // handle auto sorting
  // useEffect(() => {
  //   const api = apiRef?.current;
  //   if (!api) return;
  //   if (!autoSort) {
  //     //reset sort if none selected
  //     api.setSortModel([]);
  //     return;
  //   }

  //   //sort by checkboxes if some selected, otherwise sort by tpm
  //   api.setSortModel(selected?.length > 0 ? [{ field: "__check__", sort: "desc" }] : []);
  // }, [apiRef, autoSort, selected]);

  // const totals = useMemo(() => {
  //   if (selected.length === 0) {
  //     return undefined;
  //   }
  //   return {
  //     ccres: selected.reduce((sum, r) => sum + r.numCcres, 0),
  //     genes: selected.reduce((sum, r) => sum + r.numGenes, 0),
  //     snps: selected.reduce((sum, r) => sum + r.numSnps, 0),
  //   };
  // }, [selected]);

  return (
    <Stack spacing={1}>
      <Grid container spacing={2} height={"600px"}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Table
            // apiRef={apiRef}
            showToolbar
            rows={rows || []}
            columns={columns}
            loading={regions === null || loadingCcres || loadingSnps || loadingGenes}
            label={`Uploaded Regions`}
            emptyTableFallback={"No Regions Uploaded"}
            divHeight={{ maxHeight: "600px" }}
            // checkboxSelection
            getRowId={(row: GenomicRange) => row.start}
            // onRowSelectionModelChange={handleRowSelectionModelChange}
            // rowSelectionModel={rowSelectionModel}
            keepNonExistentRowsSelected
            // toolbarSlot={AutoSortToolbar}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} height={"100%"}>
          <OverviewCards
            entity={entity}
            ccres={ccresRanges}
            loadingCcres={loadingCcres}
            genes={geneRanges}
            loadingGenes={loadingGenes}
            snps={snpRanges}
            loadingSnps={loadingSnps}
            // selectedTotals={totals}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default BedOverview;
