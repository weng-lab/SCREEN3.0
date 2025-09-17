import { GridColDef } from "@weng-lab/ui-components";
import { Assay, BiosampleRow } from "./BiosampleActivity";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import TwoPaneLayout, { TwoPanePlotConfig } from "common/components/TwoPaneLayout";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import AssayTable from "./AssayTable";
import AssayBarPlot from "./AssayBarPlot";
import { AnyOpenEntity } from "common/EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";
import AssayViolinPlot from "./AssayViolinPlot";
import AssayUMAP from "./AssayUMAP";

export type AssayViewProps = {
  rows: BiosampleRow[];
  columns: GridColDef[];
  assay: Assay;
  entity: AnyOpenEntity
};

export type SharedAssayViewPlotProps = AssayViewProps & {
  selected: BiosampleRow[];
  setSelected: Dispatch<SetStateAction<BiosampleRow[]>>;
  sortedFilteredData: BiosampleRow[];
  setSortedFilteredData: Dispatch<SetStateAction<BiosampleRow[]>>
};

const AssayView = (props: AssayViewProps) => {
  const [selected, setSelected] = useState<BiosampleRow[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<BiosampleRow[]>([]);

  const sharedAssayViewPlotProps: SharedAssayViewPlotProps = useMemo(
    () => ({
      selected,
      setSelected,
      sortedFilteredData,
      setSortedFilteredData,
      ...props,
    }),
    [props, selected, sortedFilteredData]
  ); 

  const plots: TwoPanePlotConfig[] = useMemo(() => {
    const plots = [
      {
        tabTitle: "Bar Plot",
        icon: <BarChart />,
        plotComponent: <AssayBarPlot {...sharedAssayViewPlotProps} />,
      },
      {
        tabTitle: "Violin Plot",
        icon: <CandlestickChart />,
        plotComponent: <AssayViolinPlot {...sharedAssayViewPlotProps} />,
      },
    ];
    if (!(props.assay === "atac")) {
      plots.push({
        tabTitle: "UMAP",
        icon: <ScatterPlot />,
        plotComponent: <AssayUMAP {...sharedAssayViewPlotProps} />,
      });
    }
    return plots
  }, [props.assay, sharedAssayViewPlotProps]);

  return (
    <TwoPaneLayout
      TableComponent={<AssayTable {...sharedAssayViewPlotProps} />}
      plots={plots}
    />
  );
};

export default AssayView;
