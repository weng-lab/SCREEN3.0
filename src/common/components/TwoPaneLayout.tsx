import { BarChart, CloseFullscreenRounded, TableChartRounded } from "@mui/icons-material"
import { Stack, Box, Typography, Tabs, Tab, TabOwnProps, IconButton, TooltipClassKey, Tooltip } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"

export type TwoPanePlotConfig = {
  tabTitle: string;
  icon?: TabOwnProps["icon"];
  plotComponent: React.ReactNode;
};

export type TwoPaneLayoutProps = {
  TableComponent: React.ReactNode
  plots: TwoPanePlotConfig[]
}

const TwoPaneLayout = ({ TableComponent, plots }: TwoPaneLayoutProps) => {
  const [tab, setTab] = useState<number>(0)
  const [tableOpen, setTableOpen] = useState(true)
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState<number | null>(null);

  //listens for changes in the size of the table component and passes that height into the figure container
  useEffect(() => {
    if (!tableRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          if (entry.contentRect.height > 0) {
            setTableHeight(entry.contentRect.height);
          }
        }
      }
    });

    observer.observe(tableRef.current);

    return () => observer.disconnect();
  }, []);

  const handleSetTab = (_, newTab: number) => {
    setTab(newTab)
  }

  const handleToggleTable = () => {
    setTableOpen(!tableOpen)
  }

  const plotTabs = useMemo(() => plots.map((x) => ({ tabTitle: x.tabTitle, icon: x.icon })), [plots]);
  const figures = useMemo(() => plots.map((x) => ({ title: x.tabTitle, component: x.plotComponent })), [plots]);
  
  const TableIconButton = () => {
    return (
      <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
        {/* Using negative margin instead of 'edge' prop since, edge gives -12px padding instead of needed -8px for actual alignment */}
        <IconButton onClick={handleToggleTable} sx={{ mx: -1 }}>
          <TableChartRounded color="primary" />
        </IconButton>
      </Tooltip>
    )
  }

  //  Handles unavailable index being selected due to hidden plot
  useEffect(() => {
    if (tab > plots.length - 1) {
      setTab(plots.length - 1);
    }
  }, [plots, tab]);

  const tabValue = tab > plots.length - 1 ? plots.length - 1 : tab

  return (
    <Stack spacing={2} direction={{ xs: "column", lg: "row" }} id="two-pane-layout">
      {tableOpen &&
        <Box flexGrow={0} width={{ xs: '100%', lg: tableOpen ? '35%' : 'initial' }} id="table-container">
          <Stack direction={"row"} alignItems={"center"} gap={1} mb={2}>
            <TableIconButton />
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              Table View
            </Typography>
            <Tooltip title={`${tableOpen ? "Hide" : "Show"} Table`}>
              {/* Using negative margin instead of 'edge' prop since, edge gives -12px padding instead of needed -8px for actual alignment */}
              <IconButton onClick={handleToggleTable} sx={{ mx: -1 }}>
                <CloseFullscreenRounded color="primary" />
              </IconButton>
            </Tooltip>
            {/* Used to force this container to have the same height as the below tabs. Prevents layout shift when closing the table */}
            <Tab sx={{visibility: "hidden", minWidth: 0, px: 0}}/>
          </Stack>
          <div ref={tableRef} style={{ height: "60vh"}}>
            {TableComponent}
          </div>
        </Box>
      }
      <Box flex="1 1 0" minWidth={0} id="tabs_figure_container">
        <Stack direction={"row"} alignItems={"center"} mb={2} gap={2}>
          {!tableOpen &&
            <TableIconButton />
          }
          <Tabs value={tabValue} onChange={handleSetTab} id="plot_tabs">
            {plotTabs.map((tab, i) =>
              // minHeight: 48px is initial value for tabs without icon. With icon it's 72 which is way too tall
              <Tab label={tab.tabTitle} key={i} icon={tab.icon} iconPosition="start" sx={{minHeight: '48px'}} />)
            }
          </Tabs>
        </Stack>
        {figures.map((Figure, i) =>
          <Box 
            display={tabValue === i ? "block" : "none"} 
            key={i} id={"figure_container"}
            //use table height unless its not open, then set px height for umap so it doesnt slowly resize
            height={tableOpen ? tableHeight : Figure.title === "UMAP" ? "700px" : "100%"}
            maxHeight={Figure.title !== "Bar Plot" ? "700px" : "none"}
            minHeight={"580px"}
          >
            {Figure.component}
          </Box>
        )}
      </Box>
    </Stack>
  )
}

export default TwoPaneLayout