import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GridColDef, Table } from "@weng-lab/ui-components";
import { gql } from "common/types/generated";
import { LinkComponent } from "common/components/LinkComponent";
import { AnyOpenEntity } from "common/OpenEntitiesContext";
import { useConservationData } from "common/hooks/useConservationData";

const ORTHOLOG_QUERY = gql(`
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

const ConservationAndOrthologTables = ({ entity }: { entity: AnyOpenEntity }) => {
  const {
    data: dataConservation,
    loading: loadingConservation,
    error: errorConservation,
  } = useConservationData({
    assembly: entity.assembly,
    accession: [entity.entityID],
  });

  const {
    data: dataOrtholog,
    loading: loadingOrtholog,
    error: errorOrtholog,
  } = useQuery(ORTHOLOG_QUERY, {
    variables: {
      assembly: entity.assembly === "GRCh38" ? "grch38" : "mm10",
      accession: entity.entityID,
    },
  });

  const orthologRows = useMemo(() => {
    if (dataOrtholog && dataOrtholog.orthologQuery.length > 0) {
      return dataOrtholog.orthologQuery[0].ortholog.map((ccre) => ({
        accession: ccre.accession,
        chrom: ccre.chromosome,
        start: ccre.start,
        stop: ccre.stop,
      }));
    }
    return [];
  }, [dataOrtholog]);

  const orthologCols: GridColDef<(typeof orthologRows)[number]>[] = useMemo(
    () => [
      {
        headerName: "Accession",
        field: "accession",
        renderCell: (params) => (
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
    ],
    [entity.assembly]
  );

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
            metric: metric,
            primates: dataConservation[0][`primates_43_${metric.toLowerCase()}`],
            mammals: dataConservation[0][`mammals_241_${metric.toLowerCase()}`],
            vertebrates: dataConservation[0][`vertebrates_100_${metric.toLowerCase()}`],
          }))}
          hideFooter
          emptyTableFallback={"No Conservation data found"}
          sx={{ mb: 2 }}
        />
      )}
      <Table
        label={`Orthologous cCREs in ${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}`}
        loading={loadingOrtholog}
        error={!!errorOrtholog}
        columns={orthologCols}
        rows={orthologRows}
        emptyTableFallback={"No Orthologous cCREs found"}
      />
    </>
  );
};

export default ConservationAndOrthologTables;