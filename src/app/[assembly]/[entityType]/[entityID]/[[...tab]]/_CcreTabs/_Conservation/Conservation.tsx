"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GridColDef, GridRenderCellParams, Table } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { gql } from "common/types/generated";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import { useConservationData } from "../../../../../../../common/hooks/useConservationData";

type orthologRow = {
  accession: string;
  chrom: string;
  start: number;
  stop: number;
};

export const ORTHOLOG_QUERY = gql(`
  query orthologTab($assembly: String!, $accession: [String!]) {
    orthologQuery(accession: $accession, assembly: $assembly) {
      assembly
      accession
      ortholog {
        stop
        start
        chromosome
        accession
      }
    }
  }
`);

export const Conservation = ({ entity }: EntityViewComponentProps) => {
  const { loading, error, data } = useQuery(ORTHOLOG_QUERY, {
    variables: {
      assembly: entity.assembly === "GRCh38" ? "grch38" : "mm10",
      accession: entity.entityID,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const {
    data: dataConservation,
    loading: loadingConservation,
    error: errorConservation,
  } = useConservationData({
    assembly: entity.assembly,
    accession: [entity.entityID],
  });

  const ortholog: orthologRow[] = [];
  if (data && data.orthologQuery.length > 0) {
    for (const ccre of data.orthologQuery[0].ortholog) {
      ortholog.push({
        accession: ccre.accession,
        chrom: ccre.chromosome,
        start: ccre.start,
        stop: ccre.stop,
      });
    }
  }

  const cols: GridColDef[] = [
    {
      headerName: "Accession",
      field: "accession",
      renderCell: (params: GridRenderCellParams) => (
        <LinkComponent href={`/${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}/ccre/${params.row.accession}`}>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      headerName: "Chromosome",
      field: "chrom",
    },
    {
      headerName: "Start",
      field: "start",
    },
    {
      headerName: "Stop",
      field: "stop",
    },
  ];

  const conservationCols: GridColDef[] = [
     {
      field: "metric",
      headerName: "",
      sortable: false,
    },
    {
      headerName: "Vertebrates (100)",
      field: "vertebrates",
      valueFormatter: (value: number) => value.toFixed(2),
    },
    {
      headerName: "Mammals (241)",
      field: "mammals",
      valueFormatter: (value: number) => value.toFixed(2),
    },
    {
      headerName: "Primates (43)",
      field: "primates",
      valueFormatter: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <>
      {entity.assembly == "GRCh38" && dataConservation && (
        <Table
          label={`Conservation`}
          loading={loadingConservation}
          error={!!errorConservation}
          columns={conservationCols}
          rows={["PhyloP", "PhastCons"].map((metric) => ({
            id: metric,
            metric: metric,
            primates: dataConservation[0][`primates_43_${metric?.toLowerCase()}`],
            mammals: dataConservation[0][`mammals_241_${metric?.toLowerCase()}`],
            vertebrates: dataConservation[0][`vertebrates_100_${metric?.toLowerCase()}`],
          }))}
          hideFooter
          //showToolbar={false}
          emptyTableFallback={"No Conservation data found"}
        />
      )}
      <Table
        label={`Orthologous cCREs in ${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}`}
        loading={loading}
        error={!!error}
        columns={cols}
        rows={ortholog}
        emptyTableFallback={"No Orthologous cCREs found"}
      />
    </>
  );
};
