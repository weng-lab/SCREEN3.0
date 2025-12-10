"use client";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { useRef, useState } from "react";
import { BarChart } from "@mui/icons-material";
import BiosampleEnrichmentTable from "./BiosampleEnrichmentTable";
import { GWASEnrichment, useGWASEnrichmentData } from "common/hooks/useGWASEnrichmentData";
import { BarData, DownloadPlotHandle } from "@weng-lab/visualization";
import BiosampleEnrichmentBarPlot from "./BiosampleEnrichmentBarPlot";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASStudyMetaData } from "common/hooks/useGWASStudyMetadata";
import { Table } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
const BiosampleEnrichment = ({ entity }: EntityViewComponentProps) => {
  const {
    data: dataGWASEnrichment,
    loading: loadingGWASEnrichment,
    error: errorGWASEnrichment,
  } = useGWASEnrichmentData({ study: entity.entityID });

  const {
    data: dataGWASMetadata,
    loading: loadingGWASMetadata,
    error: errorGWASMetadata,
  } = useGWASStudyMetaData({ studyid: [entity.entityID], entityType: "gwas" });


  const [selected, setSelected] = useState<GWASEnrichment[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<GWASEnrichment[]>([]);

  const lollipopRef = useRef<DownloadPlotHandle>(null);

  const handleSelectionChange = (selected: GWASEnrichment[]) => {
    setSelected(selected);
  };

  const handleBarClick = (bar: BarData<GWASEnrichment>) => {
    if (selected.some((x) => x.accession === bar.metadata.accession)) {
      setSelected(selected.filter((x) => x.accession !== bar.metadata.accession));
    } else setSelected([...selected, bar.metadata]);
  };

  return (
    <>
      <Table
        label={`GWAS Study Metadata`}
        columns={[
          {
            headerName: "Platform",
            field: "platform",
          },
          {
            headerName: "Initial sample size",
            field: "initial_sample_size",

          },
          {
            headerName: "Replication sample size",
            field: "replication_sample_size",
          }
        ]}
        rows={dataGWASMetadata}
        loading={loadingGWASMetadata}
        error={!!errorGWASMetadata}
      />
      {dataGWASEnrichment && dataGWASEnrichment.length > 0 && <TwoPaneLayout
        TableComponent={
          <BiosampleEnrichmentTable
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
                  study={entity.entityID}
                />
              ) : (
                <></>
              ),
            ref: lollipopRef,
          },
        ]}
      />}
    </>
  );
};

export default BiosampleEnrichment;
