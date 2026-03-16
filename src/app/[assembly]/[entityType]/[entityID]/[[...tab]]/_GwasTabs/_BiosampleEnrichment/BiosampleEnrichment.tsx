"use client";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { BarChart } from "@mui/icons-material";
import BiosampleEnrichmentTable from "./BiosampleEnrichmentTable";
import { GWASEnrichment, useGWASEnrichmentData } from "common/hooks/useGWASEnrichmentData";
import BiosampleEnrichmentBarPlot from "./BiosampleEnrichmentBarPlot";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASStudyMetaData } from "common/hooks/useGWASStudyMetadata";
import { useTablePlotSync } from "common/hooks/useTablePlotSync";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { Alert } from "@mui/material";

const emptyRows: GWASEnrichment[] = [];

const gwasCols: TableColDef[] = [
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
  },
];

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

  const { selected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows: dataGWASEnrichment ?? emptyRows,
    getRowId: (r) => r.accession,
  });

  return (
    <>
      <Table
        label={`GWAS Study Metadata`}
        columns={gwasCols}
        rows={dataGWASMetadata}
        loading={loadingGWASMetadata}
        error={!!errorGWASMetadata}
      />
      {!loadingGWASEnrichment && dataGWASEnrichment?.length === 0 && (
        <Alert severity="info">There is no biosample enrichment data for this study</Alert>
      )}
      {(loadingGWASEnrichment || (dataGWASEnrichment && dataGWASEnrichment.length > 0)) && (
        <TwoPaneLayout
          TableComponent={
            <BiosampleEnrichmentTable
              enrichmentdata={{ data: dataGWASEnrichment, loading: loadingGWASEnrichment, error: errorGWASEnrichment }}
              tableProps={tableProps}
            />
          }
          plots={[
            {
              tabTitle: "Bar Plot",
              icon: <BarChart />,
              plotComponent: (
                <BiosampleEnrichmentBarPlot
                  selected={selected}
                  sortedFilteredData={sortedFilteredData}
                  toggleSelection={toggleSelection}
                  getRowId={getRowId}
                  study={entity.entityID}
                />
              ),
            },
          ]}
        />
      )}
    </>
  );
};

export default BiosampleEnrichment;
