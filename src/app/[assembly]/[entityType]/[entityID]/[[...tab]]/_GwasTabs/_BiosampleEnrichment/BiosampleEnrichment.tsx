import TwoPaneLayout from "../../../../../../../common/components/TwoPaneLayout/TwoPaneLayout";
import { useRef, useState } from "react";
import { BarChart } from "@mui/icons-material";
import BiosampleEnrichmentTable from "./BiosampleEnrichmentTable";
import { GWASEnrichment, useGWASEnrichmentData } from "common/hooks/useGWASEnrichmentData";
import { BarData, DownloadPlotHandle } from "@weng-lab/visualization";
import BiosampleEnrichmentBarPlot from "./BiosampleEnrichmentBarPlot";

export type BiosampleEnrichmentProps = {
  study_name: string;
};

const BiosampleEnrichment = ({ study_name }: BiosampleEnrichmentProps) => {
  const {
    data: dataGWASEnrichment,
    loading: loadingGWASEnrichment,
    error: errorGWASEnrichment,
  } = useGWASEnrichmentData({ study: study_name });
  const [selected, setSelected] = useState<GWASEnrichment[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<GWASEnrichment[]>([]);

  const lollipopRef = useRef<DownloadPlotHandle>(null);

  const handleSelectionChange = (selected: GWASEnrichment[]) => {
    setSelected(selected);
  };

  const handleBarClick = (bar: BarData<GWASEnrichment>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter((x) => x !== bar.metadata));
    } else setSelected([...selected, bar.metadata]);
  };
  return (
    <>
      <TwoPaneLayout
        TableComponent={
          <BiosampleEnrichmentTable
            //study_name={study_name}
            enrichmentdata={{ data: dataGWASEnrichment, loading: loadingGWASEnrichment, error: errorGWASEnrichment }}
            selected={selected}
            onSelectionChange={handleSelectionChange}
            sortedFilteredData={sortedFilteredData}
            setSortedFilteredData={setSortedFilteredData}
          />
        }
        plots={[
          {
            tabTitle: "Bar Plot",
            icon: <BarChart />,
            plotComponent:
              dataGWASEnrichment && dataGWASEnrichment.length > 0 ? (
                <BiosampleEnrichmentBarPlot
                  data={{ data: dataGWASEnrichment, loading: loadingGWASEnrichment, error: errorGWASEnrichment }}
                  selected={selected}
                  sortedFilteredData={sortedFilteredData}
                  onBarClicked={handleBarClick}
                  ref={lollipopRef}
                  study={study_name}
                />
              ) : (
                <></>
              ),
              ref: lollipopRef
          },
        ]}
      />
    </>
  );
};

export default BiosampleEnrichment;
