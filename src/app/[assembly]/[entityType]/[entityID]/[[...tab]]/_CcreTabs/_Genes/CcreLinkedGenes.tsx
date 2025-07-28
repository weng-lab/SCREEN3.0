import { Grid2 as Grid, Skeleton, Stack, Typography } from "@mui/material";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "./columns";
import LinkedElements, { TableDef } from "common/components/linkedElements/linkedElements";
import { useQuery } from "@apollo/client";
import { calcDistRegionToRegion } from "common/utility";
import { GenomicRange } from "types/globalTypes";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { gql } from "types/generated";
import { LinkComponent } from "common/components/LinkComponent";
import useClosestgenes from "common/hooks/useClosestGenes";



export default function CcreLinkedGenes({ accession, coordinates }: { accession: string; coordinates: GenomicRange }) {
  
  const { data: linkedGenes, loading, error } = useLinkedGenes(accession);
  const { data: closestGenes, loading: closestGeneLoading, error: closestGeneError} = useClosestgenes(accession, "GRCh38");
  
  if (loading || closestGeneLoading) {
    const NUM_TABLES = 5;
    return (
      <Grid container spacing={2}>
        {[...Array(NUM_TABLES)].map((_, i) => (
          <Grid size={12} key={i}>
            <Skeleton variant="rounded" width="100%" height={100} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error || closestGeneError) {
    return <Typography>Error: {error?.message || closestGeneError?.message}</Typography>;
  }

  // make types for the data
  const HiCLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.assay === "Intact-HiC")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const ChIAPETLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const crisprLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.method === "CRISPR")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const eqtlLinked = linkedGenes
    .filter((x: LinkedGeneInfo) => x.method === "eQTLs")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));

  const tables: TableDef<LinkedGeneInfo>[] = [
    {
      tableTitle: "Intact Hi-C Loops",
      rows: HiCLinked,
      columns: IntactHiCLoopsCols,
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: "No intact Hi-C loops overlap this cCRE and the promoter of a gene",
    },
    {
      tableTitle: "ChIA-PET Interactions",
      rows: ChIAPETLinked,
      columns: ChIAPETCols,
      sortColumn: "score",
      sortDirection: "desc",
      emptyTableFallback: "No ChIA-PET interactions overlap this cCRE and the promoter of a gene",
    },
    {
      tableTitle: "CRISPRi-FlowFISH",
      rows: crisprLinked,
      columns: CrisprFlowFISHCols,
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: "This cCRE was not targeted in a CRISPRi-FlowFISH experiment",
    },
    {
      tableTitle: "eQTLs",
      rows: eqtlLinked,
      columns: eQTLCols,
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: "This cCRE does not overlap a variant associated with significant changes in gene expression",
    },
  ];

 
  const closestGenesCols: CustomDataGridColDef<(typeof closestGenes)[number]>[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params: any) =>
        params.value.startsWith("ENSG") ? (
          <i>{params.value}</i>
        ) : (
          <LinkComponent href={`/GRCh38/gene/${params.value}`}>
            <i>{params.value}</i>
          </LinkComponent>
        ),
    },
    { field: "type", headerName: "Type" },
    { field: "chromosome", headerName: "Chromosome" },
    { field: "start", headerName: "Start", type: "number" },
    { field: "stop", headerName: "End", type: "number" },
    { field: "distance", headerName: "Distance", type: "number" },
  ];

  return (
    <Stack spacing={2}>
      <CustomDataGrid
        rows={closestGenes}
        columns={closestGenesCols}
        hideFooter
        tableTitle="Closest Genes"
        emptyTableFallback={"No closest genes found"}
      />
      <LinkedElements tables={tables} />
    </Stack>
  );
}