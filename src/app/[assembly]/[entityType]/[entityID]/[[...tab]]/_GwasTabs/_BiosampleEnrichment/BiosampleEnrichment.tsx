"use client";
import { BarChart } from "@mui/icons-material";
import BiosampleEnrichmentTable from "./BiosampleEnrichmentTable";
import { GWASEnrichment, useGWASEnrichmentData } from "common/hooks/data/gwas";
import BiosampleEnrichmentBarPlot from "./BiosampleEnrichmentBarPlot";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASStudy } from "common/hooks/data/gwas";
import { Table, TableColDef, TwoPaneLayout, useTablePlotSync } from "@weng-lab/ui-components";
import { Alert, Box } from "@mui/material";
import { usePlotDownload } from "common/hooks/ui";
import { useMeasuredHeightVar } from "common/hooks/ui/useMeasuredHeightVar";
import { twoPaneHeights } from "common/components/EntityDetails/entityPageHeight";

const emptyRows: GWASEnrichment[] = [];

// The study metadata table and the gap under it sit over the panes. Measured since its toolbar can wrap.
const METADATA_ID = "gwas-study-metadata";
const PANE_HEIGHTS = twoPaneHeights("calc(var(--gwas-study-metadata-height, 162px) + 16px)");

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
  } = useGWASStudy({ studyid: entity.entityID });

  const { selected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows: dataGWASEnrichment ?? emptyRows,
    getRowId: (r) => r.accession,
    initialSort: [{ field: "fc", sort: "desc" }],
  });

  const { ref: barRef, ...barDownload } = usePlotDownload();

  useMeasuredHeightVar(`#${METADATA_ID}`, "--gwas-study-metadata-height");

  return (
    <>
      <Box id={METADATA_ID}>
        <Table
          label={`GWAS Study Metadata`}
          columns={gwasCols}
          rows={dataGWASMetadata ? [dataGWASMetadata] : []}
          loading={loadingGWASMetadata}
          error={!!errorGWASMetadata}
          autoHeight
          hideFooter
        />
      </Box>
      {!loadingGWASEnrichment && dataGWASEnrichment?.length === 0 && (
        <Alert severity="info">There is no biosample enrichment data for this study</Alert>
      )}
      {(loadingGWASEnrichment || (dataGWASEnrichment && dataGWASEnrichment.length > 0)) && (
        <TwoPaneLayout
          direction={{ xs: "column", lg: "row" }}
          {...PANE_HEIGHTS}
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
                  ref={barRef}
                  selected={selected}
                  sortedFilteredData={sortedFilteredData}
                  toggleSelection={toggleSelection}
                  getRowId={getRowId}
                  study={entity.entityID}
                />
              ),
              ...barDownload,
            },
          ]}
        />
      )}
    </>
  );
};

export default BiosampleEnrichment;
