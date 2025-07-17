"use client";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  List,
  ListItem,
  ListItemText,
  FormGroup,
  Checkbox,
  IconButton,
  Button,
  Paper,
  Divider,
  Typography,
  Breadcrumbs,
  Tooltip,
} from "@mui/material";
import CellLineageTree, { cellTypeConfig, getCellImagePath, NodeInfo } from "common/components/CellLineageTree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import MultiSelect from "./MultiSelect";
import Image from "next/image";
import { BarChartOutlined, Close, Download, Info, NavigateNext, Sync } from "@mui/icons-material";
import { gql } from "types/generated";
import { useLazyQuery } from "@apollo/client";
import { AssayEnum } from "types/generated/graphql";
import NewUpSetPlot, { UpSetPlotDatum } from "app/lineage/UpSetPlot";
import { v4 as uuidv4 } from "uuid";
import { downloadSVG } from "common/utility";
import MuiLink from "common/components/MuiLink";
import { LinkComponent } from "common/components/LinkComponent";

type Assay = "DNase" | "ATAC";

export type CCRE_CLASS = "CA-CTCF" | "CA-TF" | "CA-H3K4me3" | "TF" | "CA" | "pELS" | "dELS" | "PLS";

const GET_UPSET_COUNTS = gql(`
  query GetIcreCounts(
    $targetedcelltypes: [String!]!
    $icreclasses: [String!]
    $assay: AssayEnum!
  ) {
    upsetploticrecounts(
      targetedcelltypes: $targetedcelltypes
      icreclasses: $icreclasses
      assay: $assay
    ) {
      count
      includedCelltypes
      excludedCelltypes
    }
  }
`);

const GET_UPSET_FILE = gql(`
  query getSetFile(
    $celltypes: [[String]]
    $excludecelltypes: [[String]]
    $allcelltypes: [[String]]
    $dnasecelltypes: [[String]]
    $dnaseexcludecelltypes: [[String]]
    $dnaseallcelltypes: [[String]]
    $uuid: String!
    $group: [String!]
  ) {
    createicresFilesQuery(
      celltypes: $celltypes
      excludecelltypes: $excludecelltypes
      allcelltypes: $allcelltypes
      dnasecelltypes: $dnasecelltypes
      dnaseexcludecelltypes: $dnaseexcludecelltypes
      dnaseallcelltypes: $dnaseallcelltypes
      uuid: $uuid
      group: $group
    )
  }
`);

const ccreClasses: {
  label: string;
  class: CCRE_CLASS;
}[] = [
  {
    label: "Chromatin Accessible with CTCF",
    class: "CA-CTCF",
  },
  {
    label: "Chromatin Accessible with TF",
    class: "CA-TF",
  },
  {
    label: "Chromatin Accessible with H3K4me3",
    class: "CA-H3K4me3",
  },
  {
    label: "Chromatin Accessible Only",
    class: "CA",
  },
  {
    label: "TF",
    class: "TF",
  },
  {
    label: "Proximal Enhancer",
    class: "pELS",
  },
  {
    label: "Distal Enhancer",
    class: "dELS",
  },
  {
    label: "Promoter",
    class: "PLS",
  },
];

type SelectedCelltype = NodeInfo & {
  /**
   * Stimulated data exists for cell in current assay
   */
  hasStim: boolean;
  /**
   * Unstimulated data exists for cell in current assay
   */
  hasUnstim: boolean;
  /**
   * checkbox value
   */
  stim: boolean;
  /**
   * checkbox value
   */
  unstim: boolean;
};

export default function CellLineagePage() {
  const [selectedAssay, setSelectedAssay] = useState<Assay>("ATAC");
  const [selectedCelltypes, setSelectedCelltypes] = useState<SelectedCelltype[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<{ label: string; class: CCRE_CLASS }[]>(ccreClasses);
  const [previousSelections, setPreviousSelections] = useState<{
    cells: string[];
    classes: { label: string; class: CCRE_CLASS }[];
    assay: Assay;
  }>({
    cells: [],
    classes: [],
    assay: "ATAC",
  });
  const selectedCelltypeNames = useMemo(() => selectedCelltypes.map((x) => x.celltype), [selectedCelltypes]);
  const selectedCellsWithStim = useMemo(
    () =>
      selectedCelltypes.reduce((prev: string[], current: SelectedCelltype) => {
        const x = [...prev];
        if (current.stim) x.push(current.celltype + "-Stim");
        if (current.unstim) x.push(current.celltype + "-Unstim");
        return x;
      }, []),
    [selectedCelltypes]
  );

  const svgRef = useRef<SVGSVGElement>(null);

  const handleAssayChange = (assay: Assay) => {
    setSelectedCelltypes([]);
    setSelectedAssay(assay);
  };

  /**
   * Toggles a cell between selected/unselected.
   */
  const handleNodeClick = useCallback(
    (node: NodeInfo) => {
      if (selectedCelltypeNames.includes(node.celltype)) {
        setSelectedCelltypes(selectedCelltypes.filter((x) => x.celltype !== node.celltype));
      } else {
        const hasStim = cellTypeConfig[node.celltype][selectedAssay].Stim;
        const hasUnstim = cellTypeConfig[node.celltype][selectedAssay].Unstim;
        setSelectedCelltypes([
          ...selectedCelltypes,
          {
            ...node,
            hasStim,
            stim: hasStim,
            hasUnstim,
            unstim: hasUnstim,
          },
        ]);
      }
    },
    [selectedAssay, selectedCelltypeNames, selectedCelltypes]
  );

  const handleChangeStim = useCallback(
    (cell: SelectedCelltype, modify: "stim" | "unstim", checked: boolean) => {
      const newSelected = [...selectedCelltypes];
      newSelected.find((x) => x.celltype === cell.celltype)[modify] = checked;
      setSelectedCelltypes(newSelected);
    },
    [selectedCelltypes]
  );

  const [getUpSetData, { data: UpSetData, loading: UpSetLoading, error: UpSetError }] = useLazyQuery(GET_UPSET_COUNTS);
  const [getUpSetFile, { data: FileData, loading: FileLoading, error: FileError }] = useLazyQuery(GET_UPSET_FILE);

  const handleGenerateUpSet = useCallback(() => {
    if (selectedCellsWithStim.length < 2) {
      window.alert("Please select at least 2 cells");
      return;
    }
    if (selectedCellsWithStim.length > 6) {
      window.alert("6 cell maximum for generating UpSet");
      return;
    }
    setPreviousSelections({
      cells: selectedCellsWithStim,
      classes: selectedClasses,
      assay: selectedAssay,
    }); // Update previous selections
    getUpSetData({
      variables: {
        assay: selectedAssay === "ATAC" ? AssayEnum.Atac : AssayEnum.Dnase,
        targetedcelltypes: selectedCellsWithStim,
        icreclasses: selectedClasses.length === ccreClasses.length ? undefined : selectedClasses.map((x) => x.class),
      },
    });
  }, [getUpSetData, selectedAssay, selectedCellsWithStim, selectedClasses]);

  const handleUpSetBarClick = useCallback(
    (grouping: UpSetPlotDatum & {
      unionCelltypes?: string[];
  }) => {
      const vars =
        selectedAssay === "ATAC"
          ? {
          allcelltypes: grouping.includedCelltypes?.length
            ? grouping.includedCelltypes.map((x) => [x])
            : undefined,
          excludecelltypes: grouping.excludedCelltypes?.length
            ? grouping.excludedCelltypes.map((x) => [x])
            : undefined,
          celltypes: grouping.unionCelltypes?.length
            ? grouping.unionCelltypes.map((x) => [x])
            : undefined,
        } : {
          dnaseallcelltypes: grouping.includedCelltypes?.length
            ? grouping.includedCelltypes.map((x) => [x])
            : undefined,
          dnaseexcludecelltypes: grouping.excludedCelltypes?.length
            ? grouping.excludedCelltypes.map((x) => [x])
            : undefined,
          dnasecelltypes: grouping.unionCelltypes?.length
            ? grouping.unionCelltypes.map((x) => [x])
            : undefined,
        };
      getUpSetFile({
        variables: {
          ...vars,
          group: selectedClasses.length === ccreClasses.length ? undefined : selectedClasses.map((x) => x.class),
          uuid: uuidv4(),
        },
      }).then((x) => {
        fetch(x.data.createicresFilesQuery)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.blob(); // Get the response body as a Blob
          })
          .then((blob) => {
            const a = document.createElement("a");
            const blobUrl = URL.createObjectURL(blob);
            a.href = blobUrl;
            let filename: string;
            if (grouping.unionCelltypes) {
              filename = `Union(${grouping.unionCelltypes.join(",")}).bed`;
            } else {
              filename = `Intersect(${grouping.includedCelltypes.join(",")})Exclude(${
                grouping.excludedCelltypes?.join(",") ?? "none"
              })Classes(${
                selectedClasses.length === ccreClasses.length ? "all" : selectedClasses.map((x) => x.class).join(",")
              }).bed`;
            }
            a.download = filename;
            a.click();
            URL.revokeObjectURL(blobUrl);
          })
          .catch((error) => {
            console.error("Error fetching the file:", error);
          });
      });
    },
    [getUpSetFile, selectedAssay, selectedClasses]
  );

  const AssayRadio = () => (
    <FormControl>
      <FormLabel id="assay-radio">Intersect active iCREs identified by:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="assay-radio"
        value={selectedAssay}
        onChange={(_, value) => handleAssayChange(value as Assay)}
      >
        <FormControlLabel value="ATAC" control={<Radio />} label="ATAC" />
        <FormControlLabel value="DNase" control={<Radio />} label="DNase" />
      </RadioGroup>
    </FormControl>
  );

  const selectedCellsTooltip = "Select between 2 and 6 cells to generate UpSet plot. The 'U' and 'S' checkboxes represent the unstimulated and stimulated versions of the cell (if available). Stimulated and Unstimulated versions of the cell are intersected separately."

  const SelectedCellsList = () => (
    <Stack id="Selected-Cells" sx={{ width: "100%" }}>
      <Typography variant="h5" mb={1}>
        Currently Selected{' '}
        <Tooltip title={selectedCellsTooltip}>
          <Info color="primary" sx={{ verticalAlign: "text-top" }} />
        </Tooltip>
      </Typography>
      <Divider />
      <List disablePadding sx={{ width: { xs: "100%", lg: "500px" } }}>
        {selectedCelltypes.length > 0 ? (
          selectedCelltypes.map((cell, i) => (
            <div key={i}>
              <ListItem disablePadding sx={{ paddingY: 0.5 }}>
                <IconButton onClick={() => handleNodeClick(cell)}>
                  <Close />
                </IconButton>
                <Image width={40} height={40} src={getCellImagePath(cell.celltype)} alt={cell.celltype + " Image"} />
                <ListItemText sx={{ paddingX: 1 }}>
                  {!cell.stim && !cell.unstim ? <s>{cell.celltype}</s> : cell.celltype}
                </ListItemText>
                <FormGroup row sx={{ flexShrink: 0 }}>
                  <FormControlLabel
                    disabled={!cell.hasStim}
                    control={
                      <Checkbox
                        size="small"
                        checked={cell.stim}
                        onChange={(_, checked) => handleChangeStim(cell, "stim", checked)}
                      />
                    }
                    label="Stim"
                  />
                  <FormControlLabel
                    disabled={!cell.hasUnstim}
                    control={
                      <Checkbox
                        size="small"
                        checked={cell.unstim}
                        onChange={(_, checked) => handleChangeStim(cell, "unstim", checked)}
                      />
                    }
                    label="Unstim"
                  />
                </FormGroup>
              </ListItem>
              <Divider sx={{ width: "100%" }} />
            </div>
          ))
        ) : (
          <Typography variant="subtitle2" mt={1}>
            Select between 2 and 6 cells. Stimulated and Unstimulated counted separately
          </Typography>
        )}
      </List>
    </Stack>
  );

  const GenerateUpSetButton = () => (
    <Button
      loading={UpSetLoading}
      loadingPosition="end"
      disabled={
        selectedCelltypes.length === 0 ||
        (JSON.stringify(selectedCellsWithStim) === JSON.stringify(previousSelections.cells) &&
          JSON.stringify(selectedClasses) === JSON.stringify(previousSelections.classes) &&
          selectedAssay === previousSelections.assay)
      }
      endIcon={UpSetData ? <Sync /> : <BarChartOutlined />}
      variant="contained"
      onClick={handleGenerateUpSet}
    >
      <span>
        {UpSetLoading
          ? "Generating"
          : selectedCelltypes.length === 0
          ? "Select Cells to Generate UpSet"
          : `${UpSetData ? "Reg" : "G"}enerate UpSet`}
      </span>
    </Button>
  );

  const DownloadUpSetButton = () => (
    <Button
      variant="text"
      endIcon={<Download />}
      sx={{ textTransform: "none" }}
      onClick={() => downloadSVG(svgRef, `UpSet(${selectedCellsWithStim.join(",")}).svg`)}
    >
      Download UpSet Plot
    </Button>
  );

  const Header = () => (
    <div id="Page-Header">
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumbs" sx={{mb: 1}}>
        <LinkComponent key="1" color="inherit" href="/">
          Home
        </LinkComponent>
        <Typography>Cell Lineage</Typography>
      </Breadcrumbs>
      <Typography variant="h4">Immune cCRE Activity by Cell Type</Typography>
      <Typography>Generate an UpSet plot comparing iCRE activity in selected cell types</Typography>
    </div>
  );

  return (
    <Stack m={2} spacing={2}>
      <Header />
      <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
        <Stack border={"1px solid #e0e0e0"} borderRadius={1} p={2} flexGrow={1} spacing={1}>
          <Typography variant="h5">Select Cells</Typography>
          <Divider />
          <AssayRadio />
          <CellLineageTree
            width={900}
            height={1100}
            onNodeClicked={handleNodeClick}
            getCellSelected={(cellNode) => selectedCelltypeNames.some(selectedCell => selectedCell === cellNode.data.celltype)}
            getCellDisabled={(cellNode) => !cellTypeConfig[cellNode.data.celltype][selectedAssay].Stim && !cellTypeConfig[cellNode.data.celltype][selectedAssay].Unstim}
          />
        </Stack>
        <Stack border={"1px solid #e0e0e0"} borderRadius={1} p={2} flexGrow={1} spacing={2}>
          <SelectedCellsList />
          <MultiSelect
            options={ccreClasses}
            value={selectedClasses}
            onChange={(_, value) => {
              setSelectedClasses(value);
            }}
            placeholder="Classes"
            limitTags={2}
          />
          <Stack direction="row" spacing={2}>
            <GenerateUpSetButton />
            {UpSetData && <DownloadUpSetButton />}
          </Stack>
          {UpSetData && (
            <NewUpSetPlot
              width={700}
              height={500}
              data={UpSetData.upsetploticrecounts}
              onBarClicked={handleUpSetBarClick}
              reference={svgRef}
              loadingDownload={FileLoading}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
