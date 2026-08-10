"use client";
import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { Table } from "@weng-lab/ui-components";
import { Stack } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useCcre } from "common/hooks/data/ccre";
import { GenomicRange } from "common/types/globalTypes";
import { CapraDoubleCols, CapraDoubleRow, CapraSoloCols, CrisprCols, MouseTransgenicCols, MpraCols } from "./columns";
import {
  CAPRA_DOUBLE_FUNCTIONAL_DATA_QUERY,
  CAPRA_SOLO_FUNCTIONAL_DATA_QUERY,
  CCRE_RDHS_QUERY,
  CRISPR_FUNCTIONAL_DATA_QUERY,
  FUNCTIONAL_DATA_QUERY,
  MPRA_FUNCTIONAL_DATA_QUERY,
} from "./queries";

export const FunctionalCharacterization = ({ entity }: EntityViewComponentProps) => {
  const { data: dataCcre, loading: loadingCoords } = useCcre({
    assembly: entity.assembly,
    accession: entity.entityID,
  });

  const coordinates: GenomicRange = dataCcre?.coordinates;

  const isMouse = entity.assembly === "mm10";

  const {
    loading: loadingMouseTransgenic,
    error: errorMouseTransgenic,
    data: dataMouseTransgenic,
  } = useQuery(FUNCTIONAL_DATA_QUERY, {
    variables: {
      assembly: entity.assembly.toLowerCase(),
      coordinates,
    },
    skip: !coordinates,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const {
    loading: loadingMPRA,
    error: errorMPRA,
    data: dataMPRA,
  } = useQuery(MPRA_FUNCTIONAL_DATA_QUERY, {
    variables: {
      coordinates,
    },
    skip: isMouse || !coordinates,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const {
    loading: loadingCrispr,
    error: errorCrispr,
    data: dataCrispr,
  } = useQuery(CRISPR_FUNCTIONAL_DATA_QUERY, {
    variables: {
      accession: [entity.entityID],
    },
    skip: isMouse,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const {
    loading: loadingCapraSolo,
    error: errorCapraSolo,
    data: dataCapraSolo,
  } = useQuery(CAPRA_SOLO_FUNCTIONAL_DATA_QUERY, {
    variables: {
      accession: [entity.entityID],
    },
    skip: isMouse,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const {
    loading: loadingCapraDouble,
    error: errorCapraDouble,
    data: dataCapraDouble,
  } = useQuery(CAPRA_DOUBLE_FUNCTIONAL_DATA_QUERY, {
    variables: {
      accession: [entity.entityID],
    },
    skip: isMouse,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  // Double fragments identify their two halves by rDHS, so resolve every rDHS to its cCRE accession to link out to
  const capraDoubleRdhs = useMemo(
    () => [...new Set((dataCapraDouble?.capraFccDoubleQuery ?? []).flatMap((c) => [c.rdhs_p1, c.rdhs_p2]))],
    [dataCapraDouble]
  );

  const {
    loading: loadingCapraRdhs,
    error: errorCapraRdhs,
    data: dataCapraRdhs,
  } = useQuery(CCRE_RDHS_QUERY, {
    variables: {
      assembly: "GRCh38",
      rDHS: capraDoubleRdhs,
    },
    skip: capraDoubleRdhs.length === 0,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  /** Keyed on the rDHS echoed back by the query, so the mapping doesn't depend on the order results come back in */
  const accessionByRdhs = useMemo(
    () => new Map(dataCapraRdhs?.cCREQuery.map((ccre) => [ccre.rDHS, ccre.accession] as const)),
    [dataCapraRdhs]
  );

  const capraDoubleRows: CapraDoubleRow[] = useMemo(
    () =>
      (dataCapraDouble?.capraFccDoubleQuery ?? []).map((c) => ({
        ...c,
        ccrep1: accessionByRdhs.get(c.rdhs_p1),
        ccrep2: accessionByRdhs.get(c.rdhs_p2),
      })),
    [dataCapraDouble, accessionByRdhs]
  );

  return (
    <Stack spacing={2}>
      <Table
        label={`Mouse Transgenic Enhancer Assays`}
        emptyTableFallback={"No Mouse Transgenic Enhancer Assays"}
        columns={MouseTransgenicCols}
        rows={dataMouseTransgenic?.functionalCharacterizationQuery}
        loading={loadingCoords || loadingMouseTransgenic}
        error={!!errorMouseTransgenic}
        initialState={{ sorting: { sortModel: [{ field: "element_id", sort: "desc" }] } }}
      />
      {entity.assembly === "GRCh38" && (
        <>
          <Table
            label={`MPRA (Region Centric)`}
            emptyTableFallback={"No MPRA (Region Centric) Data"}
            columns={MpraCols}
            rows={dataMPRA?.mpraFccQuery}
            loading={loadingCoords || loadingMPRA}
            error={!!errorMPRA}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
            divHeight={{ maxHeight: "400px" }}
          />
          <Table
            label={`STARR-seq (CAPRA quantification) Solo Fragments`}
            emptyTableFallback={"No STARR-seq (CAPRA quantification) Solo Fragments"}
            columns={CapraSoloCols}
            rows={dataCapraSolo?.capraFccSoloQuery}
            loading={loadingCapraSolo}
            error={!!errorCapraSolo}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
            divHeight={{ maxHeight: "400px" }}
          />
          <Table
            label={`STARR-seq (CAPRA quantification) Double Fragments`}
            emptyTableFallback={"No STARR-seq (CAPRA quantification) Double Fragments"}
            columns={CapraDoubleCols}
            rows={capraDoubleRows}
            loading={loadingCapraDouble || loadingCapraRdhs}
            error={!!errorCapraDouble || !!errorCapraRdhs}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
            divHeight={{ maxHeight: "400px" }}
          />
          <Table
            label={`CRISPR Perturbation Data`}
            emptyTableFallback={"No CRISPR Perturbation Data"}
            columns={CrisprCols}
            rows={dataCrispr?.crisprFccQuery}
            loading={loadingCrispr}
            error={!!errorCrispr}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
            divHeight={{ maxHeight: "400px" }}
          />
        </>
      )}
    </Stack>
  );
};
