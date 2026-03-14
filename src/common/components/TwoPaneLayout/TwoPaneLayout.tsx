import { CloseFullscreenRounded, DragHandle, TableChartRounded } from "@mui/icons-material";
import {
  Stack,
  Box,
  Typography,
  Tabs,
  Tab,
  TabOwnProps,
  IconButton,
  Tooltip,
  Button,
  useMediaQuery,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { theme } from "app/theme";
import React, { useMemo, useRef, useState } from "react";
import DownloadModal from "./DownloadModal";
import { DownloadPlotHandle } from "@weng-lab/visualization";
import FigurePanel from "./FigurePanel";

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") ref(value);
      else (ref as React.RefObject<T | null>).current = value;
    });
  };
}

export type TwoPanePlotConfig = {
  tabTitle: string;
  icon?: TabOwnProps["icon"];
  plotComponent: React.ReactNode;
  externalRef?: React.Ref<DownloadPlotHandle>;
};

export type TwoPaneLayoutProps = {
  TableComponent: React.ReactNode;
  plots: readonly TwoPanePlotConfig[];
};

const PANE_HEIGHT = { xs: "500px", lg: "max(60vh, 600px)" };

const TwoPaneLayout = ({ TableComponent, plots }: TwoPaneLayoutProps) => {
  const [tab, setTab] = useState<number>(0);
  const [tableOpen, setTableOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [leftPct, setLeftPct] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);
  // Captured when opening the modal so we don't read ref.current during render.
  const [activePlotHandle, setActivePlotHandle] = useState<DownloadPlotHandle | null>(null);

  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // Refs owned here since TwoPaneLayout controls the download modal.
  // Stored in state (not useRef) so they're safe to read during render for cloneElement.
  // Assumed static — plots.length must not change after mount.
  const [plotRefs] = useState(() => plots.map(() => React.createRef<DownloadPlotHandle>()));

  const handleSetTab = (_, newTab: number) => {
    setTab(newTab);
  };

  const handleToggleTable = () => {
    setTableOpen(!tableOpen);
  };

  const handleOpenDownload = () => {
    const handle = plotRefs[tabValue]?.current;
    if (handle) {
      setActivePlotHandle(handle);
      setModalOpen(true);
    }
  };

  const plotTabs = useMemo(() => plots.map((x) => ({ tabTitle: x.tabTitle, icon: x.icon })), [plots]);

  const figures = useMemo(
    () =>
      plots.map((x, i) => {
        const internalRef = plotRefs[i];
        const element = x.plotComponent as React.ReactElement<{ ref: React.Ref<DownloadPlotHandle> }>;
        const ref = x.externalRef ? mergeRefs(internalRef, x.externalRef) : internalRef;
        return {
          title: x.tabTitle,
          component: React.cloneElement(element, { ref }),
        };
      }),
    [plots, plotRefs]
  );

  const tableIconButton = (
    <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
      <IconButton onClick={handleToggleTable} sx={{ mx: -1 }}>
        <TableChartRounded color="primary" fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const hideTableButton = (
    <Tooltip title="Hide Table">
      <IconButton onClick={handleToggleTable} sx={{ mx: -1 }}>
        <CloseFullscreenRounded color="primary" />
      </IconButton>
    </Tooltip>
  );

  const downloadButton = isXs ? (
    <IconButton color="primary" aria-label="download" size="small" onClick={handleOpenDownload}>
      <DownloadIcon />
    </IconButton>
  ) : (
    <Button variant="text" startIcon={<DownloadIcon />} onClick={handleOpenDownload} sx={{ flexShrink: 0 }}>
      Download
    </Button>
  );

  const tabValue = Math.min(tab, plots.length - 1);

  const handleDividerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDividerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const newPct = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftPct(Math.min(75, Math.max(15, newPct)));
  };

  const handleDividerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <Box
      ref={containerRef}
      display="grid"
      gridTemplateColumns={(theme) => ({
        xs: "minmax(0, 1fr)",
        lg: tableOpen ? `${leftPct}% ${theme.spacing(2)} minmax(0, 1fr)` : "minmax(0, 1fr)",
      })}
      gridTemplateRows={{ xs: tableOpen ? "auto auto auto auto" : "auto auto", lg: "auto 1fr" }}
      rowGap={1}
      columnGap={{ xs: 2, lg: tableOpen ? 0 : 2 }}
    >
      {/* Table header — row 1 at all breakpoints */}
      <Stack
        display={tableOpen ? "flex" : "none"}
        direction="row"
        alignItems="center"
        gap={1}
        gridRow={1}
        gridColumn={1}
      >
        {tableIconButton}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Table View
        </Typography>
        {hideTableButton}
      </Stack>

      {/* Divider — only visible on lg when table is open */}
      {tableOpen && (
        <Box
          display={{ xs: "none", lg: "flex" }}
          alignItems="center"
          justifyContent="center"
          gridRow="1 / 3"
          gridColumn={2}
          sx={{ cursor: "col-resize" }}
          onPointerDown={handleDividerPointerDown}
          onPointerMove={handleDividerPointerMove}
          onPointerUp={handleDividerPointerUp}
        >
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              "& .MuiDivider-wrapperVertical": {
                padding: 0,
                display: "flex",
              },
              mx: "auto",
            }}
          >
            <DragHandle sx={{ transform: "rotate(90deg)", color: "divider" }} />
          </Divider>
        </Box>
      )}

      {/* Tabs header — row 1 on lg (beside table header), row 3 on xs (below table content) */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gridRow={{ xs: tableOpen ? 3 : 1, lg: 1 }}
        gridColumn={{ xs: 1, lg: tableOpen ? 3 : 1 }}
      >
        {!tableOpen && tableIconButton}
        <Tabs
          value={tabValue}
          variant="scrollable"
          onChange={handleSetTab}
          sx={{ flexGrow: 1, "& .MuiTabs-scrollButtons.Mui-disabled": { opacity: 0.3 } }}
        >
          {plotTabs.map((tab, i) => (
            <Tab
              label={isXs ? "" : tab.tabTitle}
              key={i}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: "48px" }}
            />
          ))}
        </Tabs>
        {downloadButton}
      </Stack>

      {/* Table content — row 2 at all breakpoints */}
      <Box display={tableOpen ? "block" : "none"} gridRow={2} gridColumn={1} height={PANE_HEIGHT}>
        {TableComponent}
      </Box>

      {/* Plot content — row 2 on lg, row 4 on xs */}
      <Box
        gridRow={{ xs: tableOpen ? 4 : 2, lg: 2 }}
        gridColumn={{ xs: 1, lg: tableOpen ? 3 : 1 }}
        height={PANE_HEIGHT}
        minWidth={0}
      >
        <FigurePanel value={tabValue} figures={figures} />
        {modalOpen && activePlotHandle && (
          <DownloadModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            plotHandle={activePlotHandle}
            plotTitle={plots[tabValue]?.tabTitle}
          />
        )}
      </Box>
    </Box>
  );
};

export default TwoPaneLayout;
