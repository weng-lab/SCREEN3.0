"use client"
import React from "react"
import { useQuery } from "@apollo/client"
import { Table } from "@weng-lab/ui-components"
import { Link, Stack } from "@mui/material"
import { gql } from "types/generated/gql"
import { LinkComponent } from "common/components/LinkComponent"
import { EntityViewComponentProps } from "common/EntityDetails/entityTabsConfig"
import { useCcreData } from "common/hooks/useCcreData"
import { GenomicRange } from "types/globalTypes"

export const FUNCTIONAL_DATA_QUERY = gql(`
query functionalCharacterizationQuery($coordinates: [GenomicRangeInput!],$assembly: String!) {
  functionalCharacterizationQuery(assembly: $assembly, coordinates: $coordinates) {
    tissues
    element_id
    assay_result
    chromosome
    stop
    start
  }
}
`)

export const MPRA_FUNCTIONAL_DATA_QUERY = gql(`
query MPRA_FCC($coordinates: [GenomicRangeInput!]) {
  mpraFccQuery(coordinates: $coordinates) {
    celltype
    chromosome
    stop
    start
    assay_type
    element_location
    series
    strand
    log2fc
    experiment    
    barcode_location
  }
}
`)

export const CRISPR_FUNCTIONAL_DATA_QUERY = gql(`
  query crisprFccQuery($accession: [String]!) {
    crisprFccQuery(accession: $accession) {
      rdhs
      log2fc
      fdr      
      pvalue
      experiment
    }
  }
`)

export const CAPRA_SOLO_FUNCTIONAL_DATA_QUERY = gql(`
query capraFccSoloQuery($accession: [String]!) {
  capraFccSoloQuery(accession: $accession) {
    rdhs
    log2fc
    fdr
    dna_rep1
    rna_rep1
    rna_rep2
    rna_rep3
    pvalue
    experiment
  }
}
`)

export const CAPRA_DOUBLE_FUNCTIONAL_DATA_QUERY = gql(`
query capraFccDoubleQuery($accession: [String]!) {
  capraFccDoubleQuery(accession: $accession) {
    rdhs_p1
    rdhs_p2
    log2fc
    fdr
    dna_rep1
    rna_rep1
    rna_rep2
    rna_rep3
    pvalue
    experiment
  }
}
`)

export const CCRE_RDHS_QUERY = gql(`
query rdhs($rDHS: [String!],$assembly: String!) {
  cCREQuery(assembly: $assembly, rDHS: $rDHS) {
    accession
  }
}
`)

type CAPRA_ExperimentInfo = {
  lab: string;
  cellType: string;
};

type CRISPR_ExperimentInfo = {
  lab: string;
  cellType: string;
  design: string;
};

// Define the map where experiment is the key
const capra_experimentMap: Record<string, CAPRA_ExperimentInfo> = {
  "ENCSR064KUD": { lab: "Kevin White, UChicago", cellType: "HCT116" },
  "ENCSR135NXN": { lab: "Kevin White, UChicago", cellType: "HepG2" },
  "ENCSR547SBZ": { lab: "Kevin White, UChicago", cellType: "MCF-7" },
  "ENCSR661FOW": { lab: "Tim Reddy, Duke", cellType: "K562" },
  "ENCSR858MPS": { lab: "Kevin White, UChicago", cellType: "K562" },
  "ENCSR895FDL": { lab: "Kevin White, UChicago",  cellType: "A549" },
  "ENCSR983SZZ": { lab: "Kevin White, UChicago", cellType: "SH-SY5Y" }
};

const crispr_experimentMap: Record<string, CRISPR_ExperimentInfo> = {
  "ENCSR179FSH": { design: "proliferation CRISPRi screen (dCas9-KRAB)", lab: "Tim Reddy, Duke", cellType: "OCI-AML2" },
  "ENCSR274OEB": { design: "proliferation CRISPRi screen (dCas9-KRAB)", lab: "Tim Reddy, Duke", cellType: "K562" },
  "ENCSR295VER": { design: "roliferation CRISPRi screen (dCas9-KRAB-WSR7EEE)", lab: "Will Greenleaf, Stanford", cellType: "K562" },
  "ENCSR369UFO": { design: "proliferation CRISPRi screen (dCas9-RYBP)", lab: "Will Greenleaf, Stanford", cellType: "K562" },
  "ENCSR372CKT": { design: "proliferation CRISPRi screen (dCas9-ZNF705-KRAB)", lab: "Will Greenleaf, Stanford", cellType: "K562" },
  "ENCSR381RDB": { design: "proliferation CRISPRi screen (dCas9-RYBP)", lab: "Will Greenleaf, Stanford",  cellType: "K562" },
  "ENCSR386FFV": { design: "proliferation CRISPRi screen (dCas9-KRAB-WSR7EEE)", lab: "Will Greenleaf, Stanford", cellType: "K562" },
  "ENCSR427OCU": { design: "proliferation CRISPRi screen (dCas9-KRAB-MGA1-MGA2)", lab: "Will Greenleaf, Stanford", cellType: "K562" },
  "ENCSR446RYW": { design: "proliferation CRISPRi screen (dCas9-KRAB)", lab: "Will Greenleaf, Stanford", cellType: "K562" },
  "ENCSR690DTG": { design: "proliferation CRISPRi screen (dCas9-KRAB)", lab: "Tim Reddy, Duke", cellType: "K562" },
  "ENCSR997ZOY": { design: "proliferation CRISPRi screen (dCas)", lab: "Will Greenleaf, Stanford", cellType: "K562" }
};

export const FunctionalCharacterization = ({ entity }: EntityViewComponentProps) => {
  const {data: dataCcre, loading: loadingCcre, error: errorCcre} = useCcreData({assembly: entity.assembly, accession: entity.entityID})

  const coordinates: GenomicRange = dataCcre && {
    chromosome: dataCcre?.chrom,
    start: dataCcre?.start,
    end: dataCcre?.start + dataCcre?.len
  }

  const isMouse = entity.assembly === "mm10"

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

  //CCRE_RDHS_QUERY
  const {
    loading: loadingCapraRdhs,
    error: errorCapraRdhs,
    data: dataCapraRdhs,
  } = useQuery(CCRE_RDHS_QUERY, {
    variables: {
      assembly: "GRCh38",
      rDHS: [
        dataCapraDouble &&
          dataCapraDouble.capraFccDoubleQuery.length > 0 &&
          dataCapraDouble.capraFccDoubleQuery[0].rdhs_p1,
        dataCapraDouble &&
          dataCapraDouble.capraFccDoubleQuery.length > 0 &&
          dataCapraDouble.capraFccDoubleQuery[0].rdhs_p2,
      ],
    },
    skip:
      dataCapraDouble === undefined ||
      !dataCapraDouble ||
      (dataCapraDouble && dataCapraDouble.capraFccDoubleQuery.length === 0),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  return (
    <Stack spacing={2}>
      <Table
        label={`Mouse transgenic enhancer assays`}
        columns={[
          {
            headerName: "Chromosome",
            field: "chromosome",
          },
          {
            headerName: "Start",
            field: "start",
          },
          {
            headerName: "Stop",
            field: "stop",
          },
          {
            headerName: "Element Id",
            field: "element_id",
            renderCell: (params) => {
              return (
                <Link
                  href={`https://enhancer.lbl.gov/vista/element?vistaId=${params.value}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {params.value}
                </Link>
              );
            },
          },
          {
            headerName: "Assay Result",
            field: "assay_result",
          },
          {
            headerName: "Tissues [number of embryos positive/number of embryos negative]",
            field: "tissues",
          },
        ]}
        rows={dataMouseTransgenic?.functionalCharacterizationQuery}
        loading={loadingMouseTransgenic}
        error={!!errorMouseTransgenic}
        initialState={{ sorting: { sortModel: [{ field: "element_id", sort: "desc" }] } }}
      />
      {entity.assembly === "GRCh38" && (
        <>
          <Table
            label={`MPRA (region centric)`}
            columns={[
              {
                headerName: "Chromosome",
                field: "chromosome",
              },
              {
                headerName: "Start",
                field: "start",
              },
              {
                headerName: "Stop",
                field: "stop",
              },
              {
                headerName: "Strand",
                field: "strand",
              },
              {
                headerName: "Log₂(Fold Change)",
                field: "log2fc",
                renderCell: (params) => params.value?.toFixed(2),
              },
              {
                headerName: "Experiment",
                field: "experiment",
              },
              {
                headerName: "Cell Type",
                field: "celltype",
              },
              {
                headerName: "Assay Type",
                field: "assay_type",
              },
              {
                headerName: "Series",
                field: "series",
              },
              {
                headerName: "Location of element",
                field: "element_location",
              },
              {
                headerName: "Location of barcode",
                field: "barcode_location",
              },
            ]}
            rows={dataMPRA?.mpraFccQuery}
            loading={loadingMPRA}
            error={!!errorMPRA}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
          />
          <Table
            label={`STARR-seq (CAPRA quantification) Solo Fragments`}
            columns={[
              {
                headerName: "Experiment",
                field: "a",
                renderCell: (params) => (
                  <LinkComponent
                    href={`https://www.encodeproject.org/experiments/${params.row.experiment}`}
                    showExternalIcon
                    underline="always"
                  >
                    {params.row.experiment}
                  </LinkComponent>
                ),
              },
              {
                headerName: "Celltype",
                field: "b",
                renderCell: (params) => capra_experimentMap[params.row.experiment]?.cellType,
              },
              {
                headerName: "Lab",
                field: "c",
                renderCell: (params) => capra_experimentMap[params.row.experiment]?.lab,
              },
              {
                headerName: "DNA Rep1",
                field: "dna_rep1",
              },
              {
                headerName: "RNA Rep1",
                field: "rna_rep1",
              },
              {
                headerName: "RNA Rep2",
                field: "rna_rep2",
              },
              {
                headerName: "RNA Rep3",
                field: "rna_rep3",
              },
              {
                headerName: "Log₂(Fold Change)",
                field: "log2fc",
                renderCell: (params) => params.row.log2fc?.toFixed(2),
              },
              {
                headerName: "P-value",
                field: "pvalue",
                renderCell: (params) => (!params.row.pvalue ? "n/a" : params.row.pvalue.toFixed(2)),
              },
              {
                headerName: "FDR",
                field: "fdr",
                renderCell: (params) => (!params.row.fdr ? "n/a" : params.row.fdr.toFixed(2)),
              },
            ]}
            rows={dataCapraSolo?.capraFccSoloQuery}
            loading={loadingCapraSolo}
            error={!!errorCapraSolo}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
          />
          <Table
            label={`STARR-seq (CAPRA quantification) Double Fragments`}
            columns={[
              {
                headerName: "cCRE Pair",
                field: "ccrePair",
                renderCell: (params) => (
                  <>
                    <LinkComponent href={`/GRCh38/ccre/${params.row.ccrep1}`}>{params.row.ccrep1}</LinkComponent>-
                    <LinkComponent href={`/GRCh38/ccre/${params.row.ccrep2}`}>{params.row.ccrep2}</LinkComponent>
                  </>
                ),
              },
              {
                headerName: "Experiment",
                field: "a",
                renderCell: (params) => (
                  <LinkComponent
                    href={`https://www.encodeproject.org/experiments/${params.row.experiment}`}
                    showExternalIcon
                    underline="always"
                  >
                    {params.row.experiment}
                  </LinkComponent>
                ),
              },
              {
                headerName: "Celltype",
                field: "b",
                renderCell: (params) => capra_experimentMap[params.row.experiment]?.cellType,
              },
              {
                headerName: "Lab",
                field: "c",
                renderCell: (params) => capra_experimentMap[params.row.experiment]?.lab,
              },
              {
                headerName: "DNA Rep1",
                field: "dna_rep1",
              },
              {
                headerName: "RNA Rep1",
                field: "rna_rep1",
              },
              {
                headerName: "RNA Rep2",
                field: "rna_rep2",
              },
              {
                headerName: "RNA Rep3",
                field: "rna_rep3",
              },
              {
                headerName: "Log₂(Fold Change)",
                field: "log2fc",
                renderCell: (params) => params.row.log2fc?.toFixed(2),
              },
              {
                headerName: "P-value",
                field: "pvalue",
                renderCell: (params) => (!params.row.pvalue ? "n/a" : params.row.pvalue.toFixed(2)),
              },
              {
                headerName: "FDR",
                field: "fdr",
                renderCell: (params) => (!params.row.fdr ? "n/a" : params.row.fdr.toFixed(2)),
              },
            ]}
            rows={
              (dataCapraDouble &&
                dataCapraDouble.capraFccDoubleQuery.map((c) => ({
                  ...c,
                  ccrep1: dataCapraRdhs && dataCapraRdhs.cCREQuery.length > 0 && dataCapraRdhs.cCREQuery[0].accession,
                  ccrep2: dataCapraRdhs && dataCapraRdhs.cCREQuery.length > 0 && dataCapraRdhs.cCREQuery[1].accession,
                }))) ||
              []
            }
            loading={loadingCapraDouble || loadingCapraRdhs}
            error={!!errorCapraDouble || !!errorCapraRdhs}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
          />
          <Table
            label={`CRISPR perturbation data`}
            columns={[
              {
                headerName: "Experiment",
                field: "a",
                renderCell: (params) => (
                  <LinkComponent
                    href={`https://www.encodeproject.org/experiments/${params.row.experiment}`}
                    showExternalIcon
                    underline="always"
                  >
                    {params.row.experiment}
                  </LinkComponent>
                ),
              },
              {
                headerName: "Design",
                field: "b",
                renderCell: (params) => crispr_experimentMap[params.row.experiment]?.design,
              },
              {
                headerName: "Celltype",
                field: "c",
                renderCell: (params) => crispr_experimentMap[params.row.experiment]?.cellType,
              },
              {
                headerName: "Lab",
                field: "d",
                renderCell: (params) => crispr_experimentMap[params.row.experiment]?.lab,
              },
              {
                headerName: "Log₂(Fold Change)",
                field: "log2fc",
                renderCell: (params) => params.row.log2fc?.toFixed(2),
              },
              {
                headerName: "P-value",
                field: "pvalue",
                renderCell: (params) => (!params.row.pvalue ? "n/a" : params.row.pvalue.toFixed(2)),
              },
              {
                headerName: "FDR",
                field: "fdr",
                renderCell: (params) => (!params.row.fdr ? "n/a" : params.row.fdr.toFixed(2)),
              },
            ]}
            rows={dataCrispr?.crisprFccQuery}
            loading={loadingCrispr}
            error={!!errorCrispr}
            initialState={{
              sorting: { sortModel: [{ field: "log2fc", sort: "desc" }] },
            }}
          />
        </>
      )}
    </Stack>
  );
};
