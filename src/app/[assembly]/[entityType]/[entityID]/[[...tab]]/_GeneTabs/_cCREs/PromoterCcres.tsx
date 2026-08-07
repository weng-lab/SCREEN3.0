"use client";
import { Box } from "@mui/material";
import { UseGeneDataReturn } from "common/hooks/data/gene";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, TableColDef } from "@weng-lab/ui-components";
import React from "react";
import { Assembly } from "common/types/globalTypes";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";
import { useGenePromotersData } from "common/hooks/data/gene";

export default function PromoterCcres({
  geneData,
}: {
  geneData: UseGeneDataReturn<{ name: string; assembly: Assembly }>;
}) {
  const { data, loading, error } = useGenePromotersData({
    geneid: geneData.data ? [geneData?.data?.id.split(".")[0]] : [],
  });
  const cols: TableColDef[] = [
    {
      field: "accession",
      headerName: "Accession",
      renderCell: (params) => {
        return <LinkComponent href={`/GRCh38/ccre/${params.value}`}>{params.value}</LinkComponent>;
      },
    },
    {
      field: "ccre_group",
      headerName: "Class",
      ...ClassificationFormatting,
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
    },
    {
      field: "start",
      headerName: "Start",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "stop",
      headerName: "End",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
  ];

  return (
    <Box width={"100%"}>
      <Table
        rows={data || []}
        columns={cols}
        error={!!error}
        label={"Promoter cCREs"}
        loading={loading}
        emptyTableFallback={"No Promoter cCREs Found"}
      />
    </Box>
  );
}
