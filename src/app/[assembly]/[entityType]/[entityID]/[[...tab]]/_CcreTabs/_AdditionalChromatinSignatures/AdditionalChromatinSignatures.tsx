"use client";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GridColDef, Table } from "@weng-lab/ui-components";
import { Box, Stack, Tab } from "@mui/material";
import { useCcreData } from "common/hooks/useCcreData";
import { GenomicRange } from "common/types/globalTypes";
import { gql } from "common/types/generated/gql";
import { LinkComponent } from "common/components/LinkComponent";
import { CHROM_HMM_STATES, getChromHmmStateDisplayname, useChromHMMData } from "common/hooks/useChromHmmData";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ProportionsBar, getProportionsFromArray } from "@weng-lab/visualization";
import { chromHmmStateDetails } from "common/components/gbview/constants";

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

const chromHmmCols: GridColDef[] = [
  {
    headerName: "Organ/Tissue",
    field: "tissue",
  },
  {
    headerName: "Biosample",
    field: "biosample",
  },
  {
    headerName: "State",
    field: "state",
    renderCell: (params) => <b style={{ color: params.row.color }}>{getChromHmmStateDisplayname(params.value)}</b>,
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
];

const entexCols: GridColDef[] = [
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
      <LinkComponent href={`https://www.encodeproject.org/experiments/${params.value}`} openInNewTab showExternalIcon>
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
];

const entexActiveCols: GridColDef[] = [
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
];

export const AdditionalChromatinSignatures = ({ entity }: EntityViewComponentProps) => {
  const [tab, setTab] = useState<number>(1);

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

  const {
    data: dataEntex,
    loading: loadingEntex,
    error: errorEntex,
  } = useQuery(ENTEx_QUERY, {
    variables: { accession: entity.entityID },
  });

  const {
    data: dataAnnotations,
    loading: loadingAnnotations,
    error: errorAnnotations,
  } = useQuery(ENTEx_Active_Annotations_QUERY, {
    variables: { coordinates },
    skip: !coordinates,
  });

  const { tracks, processedTableData, loading, error } = useChromHMMData(coordinates);

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={(_, newValue) => setTab(newValue)} aria-label="ChromHMM ENTEx tabs">
          <Tab label="ChromHMM States" value={1} />
          <Tab label="ENTEx Data" value={2} />
        </TabList>
      </Box>
      <TabPanel value={1} sx={{ p: 0 }}>
        <ProportionsBar
          label="ChromHMM State Proportions, All Tissues:"
          data={getProportionsFromArray(processedTableData, "state", CHROM_HMM_STATES)}
          getColor={(key) => chromHmmStateDetails[key].color}
          formatLabel={(key) => getChromHmmStateDisplayname(key)}
          loading={loading || !!error}
          tooltipTitle="ChromHMM State Proportions, All Tissues"
          style={{ marginBottom: "8px" }}
        />
        <Table
          label={`ChromHMM States`}
          columns={chromHmmCols}
          rows={processedTableData}
          loading={loading}
          error={!!error}
          divHeight={{ height: "600px" }}
          initialState={{ sorting: { sortModel: [{ field: "tissue", sort: "asc" }] } }}
        />
      </TabPanel>
      <TabPanel value={2} sx={{ p: 0 }}>
        <Stack spacing={2}>
          <Table
            label={`ENTEx`}
            columns={entexCols}
            rows={dataEntex?.entexQuery}
            loading={loadingEntex}
            error={!!errorEntex}
            initialState={{ sorting: { sortModel: [{ field: "hap1_allele_ratio", sort: "asc" }] } }}
          />
          <Table
            label={`ENTEx Active Annotations`}
            columns={entexActiveCols}
            rows={dataAnnotations?.entexActiveAnnotationsQuery}
            loading={loadingAnnotations}
            error={!!errorAnnotations}
            initialState={{ sorting: { sortModel: [{ field: "tissue", sort: "asc" }] } }}
          />
        </Stack>
      </TabPanel>
    </TabContext>
  );
};
