import { EntityViewComponentProps } from "common/EntityDetails/entityTabsConfig";
import { useQuery } from "@apollo/client";
import React from "react";
import { DataTable, Table } from "@weng-lab/ui-components";
import Grid from "@mui/material/Grid";
import { Box, CircularProgress, LinearProgress, Stack, Typography } from "@mui/material";
import { useCcreData } from "common/hooks/useCcreData";
import { GenomicRange } from "types/globalTypes";
import { gql } from "types/generated/gql";
import { LinkComponent } from "common/components/LinkComponent";
import { useChromHMMData } from "common/hooks/useChromHmmData";
import ClassProportionsBar from "../_cCRE/ClassProportionsBar";

const ENTEx_QUERY = gql(`
query ENTEXQuery($accession: String!){
  entexQuery(accession: $accession){
    assay
    accession
    hap1_count
    hap2_count
    hap1_allele_ratio
    p_betabinom
    experiment_accession
    tissue
    donor    
    imbalance_significance
  }
}
`);

const ENTEx_Active_Annotations_QUERY = gql(`
query entexActiveAnnotationsQuery( $coordinates: GenomicRangeInput! ) {
    entexActiveAnnotationsQuery(coordinates: $coordinates) {
        tissue
        assay_score
    }

}`);

export const AdditionalChromatinSignatures = ({ entity }: EntityViewComponentProps) => {
  const {
    data: dataCcre,
    loading: loadingCcre,
    error: errorCcre,
  } = useCcreData({ assembly: entity.assembly, accession: entity.entityID });

  const coordinates: GenomicRange = dataCcre && {
    chromosome: dataCcre?.chrom,
    start: dataCcre?.start,
    end: dataCcre?.start + dataCcre?.len,
  };

  const { data: dataEntex, loading: loadingEntex, error: errorEntex } = useQuery(ENTEx_QUERY, {
    variables: { accession: entity.entityID },
  });

  const { data: dataAnnotations, loading: loadingAnnotations, error: errorAnnotations } = useQuery(ENTEx_Active_Annotations_QUERY, {
    variables: { coordinates },
    skip: !coordinates
  });

  const { tracks, processedTableData, loading, error } = useChromHMMData(coordinates);

  console.log(tracks)

  return (
    <Stack spacing={2}>
      <Stack>
        
      {/* <Typography variant="caption">Classification Proportions, Core Collection:</Typography>
      <Box sx={{ marginBottom: "12px" }}>
        {loading ? (
          <LinearProgress />
        ) : (
          // <ClassProportionsBar
          // rows={coreCollection}
          // height={4}
          // width={width}
          // orientation="horizontal"
          // tooltipTitle="Classification Proportions, Core Collection"
          // />
          <></>
        )}
      </Box> */}
      <Table
        label={`ChromHMM States`}
        columns={[
          {
            headerName: "Tissue",
            field: "tissue",
          },
          {
            headerName: "Biosample",
            field: "biosample",
          },
          {
            headerName: "States",
            field: "name",
            renderCell: (params) => <b style={{ color: params.row.color }}>{params.value}</b>,
          },
          {
            headerName: "Chromosome",
            field: "chr",
          },
          {
            headerName: "Start",
            field: "start",
            type: "number",
          },
          {
            headerName: "End",
            field: "end",
            type: "number",
          },
        ]}
        rows={processedTableData}
        loading={loading}
        error={!!error}
        divHeight={{ height: "600px" }}
        initialState={{ sorting: { sortModel: [{ field: "tissue", sort: "asc" }] } }}
        />
      </Stack>
      <Table
        label={`ENTEx`}
        columns={[
          {
            headerName: "Tissue",
            field: "tissue",
            valueFormatter: (value: string) =>
              value
            .split("_")
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join(" "),
          },
          {
            headerName: "Assay",
            field: "assay",
            valueFormatter: (value: string) => value.replaceAll("_", ", "),
          },
          {
            headerName: "Donor",
            field: "donor",
          },
          {
            headerName: "Hap 1 Count",
            field: "hap1_count",
            type: "number",
          },
          {
            headerName: "Hap 2 Count",
            field: "hap2_count",
            type: "number",
          },
          {
            headerName: "Hap 1 Allele Ratio",
            field: "hap1_allele_ratio",
            type: "number",
            valueFormatter: (value: number) => value.toFixed(2),
          },
          {
            headerName: "Experiment Accession",
            field: "experiment_accession",
            renderCell: (params) => (
              <LinkComponent
                href={`https://www.encodeproject.org/experiments/${params.value}`}
                openInNewTab
                showExternalIcon
              >
                {params.value}
              </LinkComponent>
            ),
          },
          {
            headerName: "p Beta-Binomial",
            field: "p_betabinom",
            type: "number",
            valueFormatter: (value: number) => value.toFixed(2),
          },
          {
            headerName: "Imbalance Significance",
            field: "imbalance_significance",
            type: "number",
          },
        ]}
        rows={dataEntex?.entexQuery}
        loading={loadingEntex}
        error={!!errorEntex}
        initialState={{ sorting: { sortModel: [{ field: "hap1_allele_ratio", sort: "asc" }] } }}
      />
      <Table
        label={`ENTEx Active Annotations`}
        columns={[
          {
            headerName: "Tissue",
            field: "tissue",
            valueFormatter: (value: string) =>
              value
                .split("_")
                .map((s) => s[0].toUpperCase() + s.slice(1))
                .join(" "),
          },
          {
            headerName: "Supporting Assays",
            field: "assay_score",
            valueFormatter: (value: string) =>
              value
                .split("|")
                .map((s) => s.split(":")[0])
                .join(", "),
          },
        ]}
        rows={dataAnnotations?.entexActiveAnnotationsQuery}
        loading={loadingAnnotations}
        error={!!errorAnnotations}
        initialState={{ sorting: { sortModel: [{ field: "tissue", sort: "asc" }] } }}
      />
    </Stack>
  );
};
