"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { BarChart, ScatterPlot } from "@mui/icons-material";
import { mohdClient } from "common/apollo/mohd-client";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGeneData } from "common/hooks/useGeneData";
import { gql } from "common/types/generated";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { useTablePlotSync } from "common/hooks/useTablePlotSync";
import type { Mohd_Rna_TpmQuery } from "common/types/generated/graphql";
import type { MohdRnaSeqRow, MohdRnaSeqScale } from "./MohdRnaSeqTypes";
import MohdRnaSeqTable from "./MohdRnaSeqTable";
import MohdRnaSeqBarPlot from "./MohdRnaSeqBarPlot";
import MohdRnaSeqUMAP from "./MohdRnaSeqUMAP";
import MohdInfoBanner from "common/components/MohdInfoBanner";

const MOHD_RNA_SEQ_QUERY = gql(`
  query MOHD_RNA_TPM($gene_ids: [String!]!) {
    rna_tpm(gene_ids: $gene_ids) {
      gene_id
      samples {
        value
        metadata {
          kit
          sample_id
          sex
          site
          status
          umap_x
          umap_y
        }
      }
    }
  }
`);

function buildRows(data: Mohd_Rna_TpmQuery | undefined): MohdRnaSeqRow[] {
  const result = data?.rna_tpm?.[0];
  if (!result) return [];
  return result.samples.map((s) => ({
    value: s.value,
    umap_x: s.metadata.umap_x ?? 0,
    umap_y: s.metadata.umap_y ?? 0,
    kit: s.metadata.kit,
    sample_id: s.metadata.sample_id,
    sex: s.metadata.sex,
    site: s.metadata.site,
    status: s.metadata.status,
  }));
}

const MohdRnaSeq = ({ entity }: EntityViewComponentProps) => {
  const geneData = useGeneData({ name: entity.entityID, assembly: entity.assembly });

  const { data, loading, error } = useQuery(MOHD_RNA_SEQ_QUERY, {
    variables: { gene_ids: [geneData?.data?.id.split(".")[0]] },
    client: mohdClient,
    skip: !geneData.data,
  });

  const [scale, setScale] = useState<MohdRnaSeqScale>("linear");

  const rows = useMemo(() => buildRows(data), [data]);

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows,
    getRowId: (r) => r.sample_id,
  });

  return (
    <>
      <MohdInfoBanner />
      <TwoPaneLayout
        TableComponent={
          <MohdRnaSeqTable
            rows={rows}
            tableProps={tableProps}
            loading={loading || geneData.loading}
            error={!!error || !!geneData.error}
            scale={scale}
          />
        }
        plots={[
          {
            tabTitle: "Bar Plot",
            icon: <BarChart />,
            plotComponent: (
              <MohdRnaSeqBarPlot
                sortedFilteredData={sortedFilteredData}
                selected={selected}
                toggleSelection={toggleSelection}
                getRowId={getRowId}
                scale={scale}
                setScale={setScale}
              />
            ),
          },
          {
            tabTitle: "UMAP",
            icon: <ScatterPlot />,
            plotComponent: (
              <MohdRnaSeqUMAP
                rows={rows}
                selected={selected}
                setSelected={setSelected}
                toggleSelection={toggleSelection}
                getRowId={getRowId}
                loading={loading || geneData.loading}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default MohdRnaSeq;
