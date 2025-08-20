
import TwoPaneLayout from "../../../../../../../common/components/TwoPaneLayout";
import { useState } from "react";
import { BarChart } from "@mui/icons-material";
import VariantEnrichmentTable from "./VariantEnrichmentTable";
import { GWASEnrichment, useGWASEnrichmentData } from "common/hooks/useGWASEnrichmentData";
import VariantEnrichmentBarPlot from "./VariantEnrichmentBarPlot";
import { BarData } from "common/components/VerticalBarPlot";

export type VariantEnrichmentProps = {
  study_name: string;  
};
const VariantEnrichment = ({ study_name }: VariantEnrichmentProps) => {
    const { data: dataGWASEnrichment, loading: loadingGWASEnrichment, error: errorGWASEnrichment } = useGWASEnrichmentData({ study: study_name });
    const [selected, setSelected] = useState<GWASEnrichment[]>([]);
    const [sortedFilteredData, setSortedFilteredData] = useState<GWASEnrichment[]>([]);
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
            <VariantEnrichmentTable
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
              plotComponent: dataGWASEnrichment && dataGWASEnrichment.length> 0 ? (
                <VariantEnrichmentBarPlot 
                data={{ data: dataGWASEnrichment, loading: loadingGWASEnrichment, error: errorGWASEnrichment }} 
                selected={selected}
                sortedFilteredData={sortedFilteredData}              
                onBarClicked={handleBarClick}
                />
                
                
              ): <></>,
            }
          ]}
        />
        </>
      );
}

export default VariantEnrichment;