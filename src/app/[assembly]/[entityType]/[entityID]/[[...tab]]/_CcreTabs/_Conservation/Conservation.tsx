"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GridColDef, GridRenderCellParams, Table } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { gql } from "common/types/generated";
import { LinkComponent } from "common/components/LinkComponent";

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

  return (
    <Table
      label={`Orthologous cCREs in ${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}`}
      loading={loading}
      error={!!error}
      columns={cols}
      rows={ortholog}
      emptyTableFallback={"No Orthologous cCREs found"}
    />
  );
};
