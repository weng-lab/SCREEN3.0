import { useMemo, useState } from "react";
import { Button, Stack, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Typography } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Download } from "@mui/icons-material";
import {
  allColsHidden,
  BiosampleTable,
  columns as biosampleColumns,
  EncodeBiosample,
  initialTableState,
  useEncodeBiosampleData,
  useTablePlotSync,
} from "@weng-lab/ui-components";
import { GridColumnVisibilityModel, type GridFilterModel, type GridSortModel } from "@mui/x-data-grid-premium";
import BiosampleUMAP from "common/components/BiosampleUMAP/BiosampleUMAP";
import {
  lifeStageField,
  sampleTypeField,
  tissueField,
  type CategoryField,
} from "common/components/BiosampleUMAP/fields";
import { UMAP_QUERY } from "../queries";
import AssemblyControls, { Selected } from "./AssemblyControls";
import DownloadModal from "./DownloadModal";

const assemblies: Array<"Human" | "Mouse"> = ["Human", "Mouse"];

/** A biosample with its place on the assay's UMAP, and its experiment for the assay. */
type UmapBiosample = EncodeBiosample & { umap: [number, number]; experimentAccession: string | null };

const FIELDS: CategoryField<UmapBiosample>[] = [
  tissueField("ontology"),
  sampleTypeField("sampleType"),
  lifeStageField("lifeStage"),
];

const RADIUS = { base: 2, selected: 3 };

const nameOf = (biosample: { name: string }) => biosample.name;
const getX = (biosample: UmapBiosample) => biosample.umap[0];
const getY = (biosample: UmapBiosample) => biosample.umap[1];

const TooltipBody = (biosample: UmapBiosample) => (
  <>
    <Typography>
      <b>Biosample:</b> {biosample.displayname}
    </Typography>
    <Typography>
      <b>Organ/Tissue:</b> {biosample.ontology}
    </Typography>
    <Typography>
      <b>Sample Type:</b> {biosample.sampleType}
    </Typography>
    <Typography>
      <b>Life Stage:</b> {biosample.lifeStage}
    </Typography>
    {biosample.experimentAccession && (
      <Typography>
        <b>Experiment:</b> {biosample.experimentAccession}
      </Typography>
    )}
  </>
);

/** The table's search reaches its hidden columns, as BiosampleTable's own initial state has it. */
const INITIAL_FILTERS: GridFilterModel = { items: [], quickFilterExcludeHiddenColumns: false };

/** BiosampleTable's own initial sort. */
const INITIAL_SORT: GridSortModel = [...initialTableState.sorting.sortModel];

const NO_BIOSAMPLES: EncodeBiosample[] = [];

// Only the accession column for the selected assay is shown, everything else is hidden.
const assayColumnVisibility = (selected: Selected): GridColumnVisibilityModel => ({
  ...allColsHidden,
  assays: true,
  [`${selected.assay.toLowerCase()}_experiment_accession`]: true,
});

const biosampleHasAssay = (biosample: EncodeBiosample, assay: Selected["assay"]) => {
  switch (assay) {
    case "DNase":
      return !!biosample.dnase_experiment_accession;
    case "H3K4me3":
      return !!biosample.h3k4me3_experiment_accession;
    case "H3K27ac":
      return !!biosample.h3k27ac_experiment_accession;
    case "CTCF":
      return !!biosample.ctcf_experiment_accession;
  }
};

const UMAP_INITIAL_STATE = { minimap: { open: true }, controls: { selectionType: "pan" } } as const;

export function DataMatrices() {
  const [selectedAssay, setSelectedAssay] = useState<Selected>({ assembly: "Human", assay: "DNase" });
  const [lifeStage, setLifeStage] = useState("all");

  const { data: biosamples, loading: biosamplesLoading } = useEncodeBiosampleData({
    assembly: selectedAssay.assembly === "Human" ? "GRCh38" : "mm10",
  });
  // The biosamples with the selected assay: the table's rows, and every one the UMAP can place.
  const tableRows = useMemo(
    () => (biosamples ?? NO_BIOSAMPLES).filter((biosample) => biosampleHasAssay(biosample, selectedAssay.assay)),
    [biosamples, selectedAssay.assay]
  );
  const { selected, setSelected, toggleSelection, tableProps, filters } = useTablePlotSync({
    rows: tableRows,
    getRowId: nameOf,
    initialSort: INITIAL_SORT,
    initialFilters: INITIAL_FILTERS,
  });

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(() =>
    assayColumnVisibility(selectedAssay)
  );

  const handleSetSelectedAssay = (newSelected: Selected) => {
    if (JSON.stringify(newSelected) !== JSON.stringify(selectedAssay)) {
      setSelected([]); // clear umap selection when assay changes
      setSelectedAssay(newSelected);
      // Note: this discards any manual column modifications the user made.
      setColumnVisibilityModel(assayColumnVisibility(newSelected));
    }
  };

  const { data: umapData, loading: umapLoading } = useQuery(UMAP_QUERY, {
    variables: {
      assembly: selectedAssay.assembly === "Human" ? "grch38" : "mm10",
      assay: selectedAssay.assay,
      a: selectedAssay.assay.toLowerCase(),
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const handleOpenDownloadModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const umapBiosamples: UmapBiosample[] = useMemo(() => {
    const placed = new Map(
      (umapData?.ccREBiosampleQuery.biosamples ?? []).map(({ name, umap_coordinates, experimentAccession }) => [
        name,
        { umap_coordinates, experimentAccession },
      ])
    );
    return tableRows.flatMap((biosample) => {
      const { umap_coordinates: umap, experimentAccession } = placed.get(biosample.name) ?? {};
      return umap && (lifeStage === "all" || lifeStage === biosample.lifeStage)
        ? [{ ...biosample, umap: [umap[0], umap[1]] as [number, number], experimentAccession }]
        : [];
    });
  }, [umapData, tableRows, lifeStage]);

  const selectedNames = useMemo(() => new Set(selected.map(nameOf)), [selected]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(0, 1100px) minmax(350px, 1fr)",
        },
        columnGap: { xs: 0, md: 4 },
        rowGap: 1,
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: {
            xs: "auto auto auto",
            md: "auto auto 1fr",
          },
          gap: 2,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            justifyContent: { md: "space-between" },
            flexWrap: "wrap",
          }}
        >
          {assemblies.map((assembly) => (
            <AssemblyControls
              key={assembly}
              assembly={assembly}
              selectedAssay={selectedAssay}
              setSelected={handleSetSelectedAssay}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "flex-end" },
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Stack>
              <InputLabel id="show-label">Show</InputLabel>
              <Select
                size="small"
                id="show"
                value={lifeStage}
                onChange={(event: SelectChangeEvent) => {
                  setLifeStage(event.target.value as "all" | "adult" | "embryonic");
                }}
                sx={{ width: 160 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="adult">Adult</MenuItem>
                <MenuItem value="embryonic">Embryonic</MenuItem>
              </Select>
            </Stack>
          </Box>
          <Button
            sx={{ ml: { xs: 0, md: "auto" }, height: 40, textTransform: "none", width: 160 }}
            variant="contained"
            endIcon={<Download />}
            onClick={handleOpenDownloadModal}
          >
            Download Data
          </Button>
        </Box>
        <Box
          sx={{
            minHeight: 500,
            minWidth: 0,
            p: 1,
            border: "2px solid",
            borderColor: "grey.400",
            borderRadius: 2,
          }}
        >
          <BiosampleUMAP
            rows={umapBiosamples}
            keyOf={nameOf}
            x={getX}
            y={getY}
            fields={FIELDS}
            noun="biosample"
            filters={filters}
            columns={biosampleColumns}
            selected={selectedNames}
            onPointClicked={toggleSelection}
            onLassoSelect={(picked) =>
              setSelected((prev) => [...prev, ...picked.filter(({ name }) => !selectedNames.has(name))])
            }
            tooltipBody={TooltipBody}
            radius={RADIUS}
            loading={umapLoading || biosamplesLoading}
            downloadFileName={`${selectedAssay.assembly}_${selectedAssay.assay}_UMAP`}
            initialState={UMAP_INITIAL_STATE}
            // Only human DNase will be animated, since it's shown first
            animationGroupSize={65}
          />
        </Box>
      </Box>
      <Box sx={{ minHeight: 0, overflow: "auto" }}>
        <BiosampleTable
          {...tableProps}
          label={"Find Biosamples"}
          assembly={selectedAssay.assembly === "Human" ? "GRCh38" : "mm10"}
          rows={tableRows}
          loading={biosamplesLoading}
          // BiosampleTable's own grouping and columns, sorted and filtered by useTablePlotSync
          initialState={{ ...initialTableState, ...tableProps.initialState }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          // temporary fix while other tables are not setup to group rows
          disableRowGrouping={false}
          divHeight={{ height: 750 }}
        />
      </Box>
      <DownloadModal openModal={openModal} handleCloseModal={handleCloseModal} selectedAssay={selectedAssay} />
    </Box>
  );
}
