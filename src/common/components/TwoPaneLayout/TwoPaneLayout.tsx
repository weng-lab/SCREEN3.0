import { CloseFullscreenRounded, TableChartRounded } from "@mui/icons-material";
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
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { theme } from "app/theme";
import { useMemo, useState } from "react";
import DownloadModal from "./DownloadModal";
import { DownloadPlotHandle } from "@weng-lab/visualization";
import FigurePanel from "./FigurePanel";

export type TwoPanePlotConfig = {
  tabTitle: string;
  icon?: TabOwnProps["icon"];
  plotComponent: React.ReactNode;
  ref?: React.RefObject<DownloadPlotHandle>;
};

export type TwoPaneLayoutProps = {
  TableComponent: React.ReactNode;
  plots: TwoPanePlotConfig[];
  isV40?: boolean;
};

const PANE_HEIGHT = { xs: "500px", lg: "600px" };

const TwoPaneLayout = ({ TableComponent, plots, isV40 = false }: TwoPaneLayoutProps) => {
  const [tab, setTab] = useState<number>(0);
  const [tableOpen, setTableOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSetTab = (_, newTab: number) => {
    setTab(newTab);
  };

  const handleToggleTable = () => {
    setTableOpen(!tableOpen);
  };

  const plotTabs = useMemo(() => plots.map((x) => ({ tabTitle: x.tabTitle, icon: x.icon })), [plots]);
  const figures = useMemo(() => plots.map((x) => ({ title: x.tabTitle, component: x.plotComponent })), [plots]);

  const tableIconButton = (
    <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
      <IconButton onClick={handleToggleTable} sx={{ mx: -1 }}>
        <TableChartRounded color="primary" />
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
    <IconButton color="primary" aria-label="download" size="small" onClick={() => setModalOpen(true)} disabled={isV40}>
      <DownloadIcon />
    </IconButton>
  ) : (
    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => setModalOpen(true)} disabled={isV40}>
      Download
    </Button>
  );

  const tabValue = Math.min(tab, plots.length - 1);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "minmax(0, 1fr)", lg: tableOpen ? "35% minmax(0, 1fr)" : "minmax(0, 1fr)" }}
      gridTemplateRows={{ xs: tableOpen ? "auto auto auto auto" : "auto auto", lg: "auto 1fr" }}
      gap={2}
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
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Table View
        </Typography>
        {hideTableButton}
      </Stack>

      {/* Tabs header — row 1 on lg (beside table header), row 3 on xs (below table content) */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gridRow={{ xs: tableOpen ? 3 : 1, lg: 1 }}
        gridColumn={{ xs: 1, lg: tableOpen ? 2 : 1 }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          {!tableOpen && tableIconButton}
          <Tabs value={tabValue} onChange={handleSetTab}>
            {plotTabs.map((tab, i) => (
              <Tab
                label={isXs ? "" : tab.tabTitle}
                key={i}
                icon={tab.icon}
                iconPosition="start"
                sx={{ minHeight: "48px" }}
                disabled={isV40}
              />
            ))}
          </Tabs>
        </Stack>
        {downloadButton}
      </Stack>

      {/* Table content — row 2 at all breakpoints */}
      <Box display={tableOpen ? "block" : "none"} gridRow={2} gridColumn={1} height={PANE_HEIGHT}>
        {TableComponent}
      </Box>

      {/* Plot content — row 2 on lg, row 4 on xs */}
      <Box
        gridRow={{ xs: tableOpen ? 4 : 2, lg: 2 }}
        gridColumn={{ xs: 1, lg: tableOpen ? 2 : 1 }}
        height={PANE_HEIGHT}
        minWidth={0}
      >
        <FigurePanel value={tabValue} figures={figures} />
        {modalOpen && (
          <DownloadModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            ref={plots[tabValue]?.ref?.current}
            plotTitle={plots[tabValue]?.tabTitle}
          />
        )}
      </Box>
    </Box>
  );
};

export default TwoPaneLayout;
