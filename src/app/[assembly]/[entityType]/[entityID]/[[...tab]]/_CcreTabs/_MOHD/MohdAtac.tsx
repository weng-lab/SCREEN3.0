"use client";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import { mohdClient } from "common/apollo/mohd-client";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { gql } from "common/types/generated";
import { TwoPaneLayout, useTablePlotSync } from "@weng-lab/ui-components";
import usePlotDownload from "common/hooks/usePlotDownload";
import type { Mohd_Atac_ZScoresQuery } from "common/types/generated/graphql";
import type { MohdAtacRow } from "./MohdAtacTypes";
import MohdAtacTable from "./MohdAtacTable";
import MohdAtacBarPlot from "./MohdAtacBarPlot";
import MohdAtacViolinPlot from "./MohdAtacViolinPlot";
import MohdAtacUMAP from "./MohdAtacUMAP";
import MohdInfoBanner from "common/components/MohdInfoBanner";

const MOHD_ATAC_QUERY = gql(`
  query MOHD_ATAC_ZScores($accessions: [String!]!) {
    atac_zscore(accessions: $accessions) {
      samples {
        value
        metadata {
          umap_y
          umap_x
          opc_id
          protocol
          sample_id
          sex
          site
          status
        }
      }
      accession
    }
  }
`);

function buildRows(data: Mohd_Atac_ZScoresQuery | undefined): MohdAtacRow[] {
  const result = data?.atac_zscore?.[0];
  if (!result) return [];
  return result.samples.map((s) => ({
    value: s.value,
    umap_x: s.metadata.umap_x ?? 0,
    umap_y: s.metadata.umap_y ?? 0,
    opc_id: s.metadata.opc_id,
    protocol: s.metadata.protocol,
    sample_id: s.metadata.sample_id,
    sex: s.metadata.sex,
    site: s.metadata.site,
    status: s.metadata.status,
  }));
}

const MohdAtac = ({ entity }: EntityViewComponentProps) => {
  const { data, loading, error } = useQuery(MOHD_ATAC_QUERY, {
    variables: { accessions: [entity.entityID] },
    client: mohdClient,
  });

  const rows = useMemo(() => buildRows(data), [data]);

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows,
    getRowId: (r) => r.sample_id,
  });

  const { ref: barRef, ...barDownload } = usePlotDownload();
  const { ref: violinRef, ...violinDownload } = usePlotDownload();
  const { ref: umapRef, ...umapDownload } = usePlotDownload();

  return (
    <>
      <MohdInfoBanner />
      <TwoPaneLayout
        direction={{ xs: "column", lg: "row" }}
        TableComponent={<MohdAtacTable rows={rows} tableProps={tableProps} loading={loading} error={!!error} />}
        plots={[
          {
            tabTitle: "Bar Plot",
            icon: <BarChart />,
            plotComponent: (
              <MohdAtacBarPlot
                ref={barRef}
                sortedFilteredData={sortedFilteredData}
                selected={selected}
                toggleSelection={toggleSelection}
                getRowId={getRowId}
              />
            ),
            ...barDownload,
          },
          {
            tabTitle: "Violin Plot",
            icon: <CandlestickChart />,
            plotComponent: (
              <MohdAtacViolinPlot
                ref={violinRef}
                rows={rows}
                selected={selected}
                setSelected={setSelected}
                toggleSelection={toggleSelection}
                getRowId={getRowId}
              />
            ),
            ...violinDownload,
          },
          {
            tabTitle: "UMAP",
            icon: <ScatterPlot />,
            plotComponent: (
              <MohdAtacUMAP
                ref={umapRef}
                rows={rows}
                selected={selected}
                setSelected={setSelected}
                toggleSelection={toggleSelection}
                getRowId={getRowId}
                loading={loading}
              />
            ),
            ...umapDownload,
          },
        ]}
      />
    </>
  );
};

export default MohdAtac;
