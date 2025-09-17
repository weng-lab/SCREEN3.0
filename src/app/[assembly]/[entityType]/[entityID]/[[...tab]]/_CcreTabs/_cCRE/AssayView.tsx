import { GridColDef } from "@weng-lab/ui-components";
import { Assay, BiosampleRow } from "./BiosampleActivity";
import { Dispatch, SetStateAction, useState } from "react";
import TwoPaneLayout from "common/components/TwoPaneLayout";
import { BarChart, CandlestickChart } from "@mui/icons-material";
import AssayTable from "./AssayTable";
import AssayBarPlot from "./AssayBarPlot";
import { AnyOpenEntity } from "common/EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";
import AssayViolinPlot from "./AssayViolinPlot";

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

  const sharedAssayViewPlotProps: SharedAssayViewPlotProps = {
    selected,
    setSelected,
    sortedFilteredData,
    setSortedFilteredData,
    ...props
  };

  return (
    <TwoPaneLayout
      TableComponent={<AssayTable {...sharedAssayViewPlotProps} />}
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: <AssayBarPlot {...sharedAssayViewPlotProps} />,
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: <AssayViolinPlot {...sharedAssayViewPlotProps} />
        }
      ]}
    />
  );
};

export default AssayView;
