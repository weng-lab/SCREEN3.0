import { useEffect, useMemo, useState, useRef } from "react";
import { Button, Stack, InputLabel, Select, MenuItem, SelectChangeEvent, Box } from "@mui/material";
import { useQuery } from "@apollo/client";
import { Download } from "@mui/icons-material";
import { allColsHidden, BiosampleTable, EncodeBiosample, GridColumnVisibilityModel } from "@weng-lab/ui-components";
import { ScatterPlot, Point } from "@weng-lab/visualization";
import { PointMetaData } from "../types";
import { tissueColors } from "../../../common/colors";
import { UMAP_QUERY } from "../queries";
import AssemblyControls, { Selected } from "./AssemblyControls";
import UmapLegend from "./UmapLegend";
import DownloadModal from "./DownloadModal";

const assemblies: Array<"Human" | "Mouse"> = ["Human", "Mouse"];

// Direct copy from old SCREEN
function colorMap(strings) {
  const counts = {};
  //Count the occurences of each tissue/sample
  strings.forEach((x) => (counts[x] = counts[x] ? counts[x] + 1 : 1));
  //Removes duplicate elements in the array
  strings = [...new Set(strings)];
  const colors = {};
  //For each tissue/sample type
  strings.forEach((x) => {
    colors[x] = tissueColors[x] ?? tissueColors.missing;
  });
  return [colors, counts];
}

export function DataMatrices() {
  const [selectedAssay, setSelectedAssay] = useState<Selected>({ assembly: "Human", assay: "DNase" });
  const [lifeStage, setLifeStage] = useState("all");
  const [colorBy, setColorBy] = useState<"ontology" | "sampleType">("ontology");

  const [selectedBiosamples, setSelectedBiosamples] = useState<string[]>([]);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const graphContainerRef = useRef(null);

  const handleSetSelectedAssay = (newSelected: Selected) => {
    if (JSON.stringify(newSelected) !== JSON.stringify(selectedAssay)) {
      setSelectedBiosamples([]); // clear umap selection when assay changes
      setSelectedAssay(newSelected);
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

  useEffect(() => {
    const graphElement = graphContainerRef.current;

    const handleWheel = (event: WheelEvent) => {
      // Prevent default scroll behavior when using the wheel in the graph
      event.preventDefault();
    };
    if (graphElement) {
      graphElement.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (graphElement) {
        graphElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const handleSetTableSelection = (biosamples: EncodeBiosample[]) => {
    setSelectedBiosamples(biosamples.map((x) => x.name));
  };

  const handleOpenDownloadModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const map = {
    position: {
      right: 50,
      bottom: 50,
    },
  };

  const fData = useMemo(() => {
    return (
      umapData &&
      umapData.ccREBiosampleQuery.biosamples
        .filter((x) => x.umap_coordinates)
        .filter((x) => lifeStage === "all" || lifeStage === x.lifeStage)
    );
  }, [umapData, lifeStage]);

  const [sampleTypeColors] = useMemo(
    () =>
      colorMap(
        (umapData &&
          umapData.ccREBiosampleQuery &&
          umapData.ccREBiosampleQuery.biosamples.filter((x) => x.umap_coordinates).map((x) => x.sampleType)) ||
          []
      ),
    [umapData]
  );
  const [ontologyColors] = useMemo(
    () =>
      colorMap(
        (umapData &&
          umapData.ccREBiosampleQuery &&
          //Check if umap coordinates exist, then map each entry to it's ontology (tissue type). This array of strings is passed to colorMap
          umapData.ccREBiosampleQuery.biosamples.filter((x) => x.umap_coordinates).map((x) => x.ontology)) ||
          []
      ),
    [umapData]
  );

  const handleSelectionChange = (selectedPoints: Point<PointMetaData>[]) => {
    const selected = selectedPoints.map((point) => point.x);
    const selectedBiosamples = fData
      .filter((biosample) => selected.includes(biosample.umap_coordinates[0]) && biosample.umap_coordinates)
      .map((biosample) => ({
        name: biosample.name,
        displayname: biosample.displayname,
        ontology: biosample.ontology,
        sampleType: biosample.sampleType,
        lifeStage: biosample.lifeStage,
        umap_coordinates: biosample.umap_coordinates!,
        experimentAccession: biosample.experimentAccession,
      }));
    setSelectedBiosamples(selectedBiosamples.map((x) => x.name));
  };

  const scatterData: Point<PointMetaData>[] = useMemo(() => {
    if (!fData) return [];

    return fData.map((x) => {
      const anySelected = selectedBiosamples.length > 0;
      const isSelected = selectedBiosamples.includes(x.name);

      return {
        x: x.umap_coordinates![0],
        y: x.umap_coordinates![1],
        r: anySelected && isSelected ? 3 : 2,
        color:
          !anySelected || isSelected
            ? (colorBy === "sampleType" ? sampleTypeColors : ontologyColors)[x[colorBy]]
            : "#aaaaaa",
        opacity: !anySelected || isSelected ? 1 : 0.1,
        shape: "circle",
        metaData: {
          name: x.displayname,
          accession: x.experimentAccession,
        },
      };
    });
  }, [fData, colorBy, sampleTypeColors, ontologyColors, selectedBiosamples]);

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

  const columnVisibilityModel: GridColumnVisibilityModel = useMemo(
    () => ({
      ...allColsHidden,
      assays: true,
      [`${selectedAssay.assay.toLowerCase()}_experiment_accession`]: true,
    }),
    [selectedAssay]
  );

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
              <InputLabel id="color-by-label">Color By</InputLabel>
              <Select
                size="small"
                id="color-by"
                value={colorBy}
                onChange={(event: SelectChangeEvent) => {
                  setColorBy(event.target.value as "ontology" | "sampleType");
                }}
                sx={{ width: 180 }}
              >
                <MenuItem value="ontology">Tissue/Organ</MenuItem>
                <MenuItem value="sampleType">Biosample Type</MenuItem>
              </Select>
            </Stack>
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
          <ScatterPlot
            pointData={scatterData}
            loading={umapLoading}
            selectable
            onSelectionChange={handleSelectionChange}
            miniMap={map}
            leftAxisLabel="UMAP-2"
            bottomAxisLabel="UMAP-1"
            initialState={{
              minimap: {
                open: true,
              },
              controls: {
                selectionType: "pan",
              },
            }}
            animation="scale"
            animationBuffer={0.01}
            //Only human DNAse will be animaited since its first shown
            animationGroupSize={65}
          />
        </Box>
      </Box>
      <Box sx={{ minHeight: 0, overflow: "auto" }}>
        <BiosampleTable
          label={"Find Biosamples"}
          assembly={selectedAssay.assembly === "Human" ? "GRCh38" : "mm10"}
          checkboxSelection
          onSelectionChange={handleSetTableSelection}
          selected={selectedBiosamples}
          prefilterBiosamples={(biosample) => biosampleHasAssay(biosample, selectedAssay.assay)}
          columnVisibilityModel={columnVisibilityModel}
          // temporary fix while other tables are not setup to group rows
          disableRowGrouping={false}
          divHeight={{ height: 750 }}
        />
      </Box>
      <Box sx={{ gridColumn: "1 / -1" }}>
        <UmapLegend
          scatterData={scatterData}
          colorBy={colorBy}
          sampleTypeColors={sampleTypeColors}
          ontologyColors={ontologyColors}
        />
      </Box>
      <DownloadModal openModal={openModal} handleCloseModal={handleCloseModal} selectedAssay={selectedAssay} />
    </Box>
  );
}
