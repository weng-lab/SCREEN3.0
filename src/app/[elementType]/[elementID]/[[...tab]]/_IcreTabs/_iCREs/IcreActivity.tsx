import TwoPaneLayout from "../../../../../../common/components/TwoPaneLayout"
import { useState } from "react"
import { BarData } from "../../../../../../common/components/VerticalBarPlot"
import IcreActivityTable from "./IcreActivityTable"
import { useIcreActivity, UseIcreActivityReturn } from "common/hooks/useIcreActivity"
import IcreActivityBarPlot from "./IcreActivityBarPlot"
import IcreActivityUMAP from "./IcreActivityUMAP"
import { BarChart, CandlestickChart, ScatterPlot, SchemaRounded } from "@mui/icons-material"
import IcreActivityTree from "./IcreActivityTree"
import IcreActivityViolinPlot from "./IcreActivityViolinPlot"
import { Distribution, ViolinPoint } from "@weng-lab/psychscreen-ui-components"

export type IcreActivityProps = {
  accession: string,
}

export type PointMetadata = UseIcreActivityReturn["data"][number]

export type SharedIcreActivityPlotProps = {
  selected: PointMetadata[],
  iCREActivitydata: UseIcreActivityReturn,
  sortedFilteredData: PointMetadata[]
}

const IcreActivity = ({ accession }: IcreActivityProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([])
  const [sortedFilteredData, setSortedFilteredData] = useState<PointMetadata[]>([])

  const iCREActivitydata = useIcreActivity({ accession })

  const handlePointsSelected = (pointsInfo: PointMetadata[]) => {
    setSelected([...selected, ...pointsInfo])
  }

  const handleSelectionChange = (selected: PointMetadata[]) => {
    setSelected(selected)
  }

  const handleBarClick = (bar: BarData<PointMetadata>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter(x => x !== bar.metadata))
    } else setSelected([...selected, bar.metadata])
  }

  const handleViolinClick = (violin: Distribution<PointMetadata>) => {
    const metadataArray = violin.data.map((point) => point.metadata);
    if (selected.length === metadataArray.length && selected[0].lineage === metadataArray[0].lineage) {
      setSelected([]);
    } else setSelected(metadataArray);
  };

  const handleViolinPointClick = (point: ViolinPoint<PointMetadata>) => {
    if (selected.includes(point.metadata)) {
      setSelected(selected.filter((x) => x !== point.metadata));
    } else setSelected([...selected, point.metadata]);
  };

  return (
    <TwoPaneLayout
      TableComponent={
        <IcreActivityTable
          accession={accession}
          selected={selected}
          onSelectionChange={handleSelectionChange}
          sortedFilteredData={sortedFilteredData}
          setSortedFilteredData={setSortedFilteredData}
          iCREActivitydata={iCREActivitydata}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <IcreActivityBarPlot
              accession={accession}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              iCREActivitydata={iCREActivitydata}
              onBarClicked={handleBarClick}
            />
          ),
        },
        {
          tabTitle: "UMAP",
          icon: <ScatterPlot />,
          plotComponent: (
            <IcreActivityUMAP
              accession={accession}
              sortedFilteredData={sortedFilteredData}
              iCREActivitydata={iCREActivitydata}
              selected={selected}
              onSelectionChange={(points) => handlePointsSelected(points.map((x) => x.metaData))}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <IcreActivityViolinPlot
              accession={accession}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              iCREActivitydata={iCREActivitydata}
              onViolinClicked={handleViolinClick}
              onPointClicked={handleViolinPointClick}
            />
          ),
        },
        {
          tabTitle: "Activity in Cell Lineage",
          icon: <SchemaRounded sx={{ transform: "rotate(270deg)" }} />,
          plotComponent: (
            <IcreActivityTree
              accession={accession}
              sortedFilteredData={sortedFilteredData}
              iCREActivitydata={iCREActivitydata}
              selected={selected}
            />
          ),
        },
      ]}
    />
  );
}

export default IcreActivity