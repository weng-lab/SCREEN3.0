import { Stack } from "@mui/material";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "./columns";
import LinkedElements, { TableDef } from "common/components/linkedElements";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import useClosestGenes from "common/hooks/useClosestGenes";
import { EntityViewComponentProps } from "common/entityTabsConfig";

export default function CcreLinkedGenes({ entity }: EntityViewComponentProps) {
  const isHuman = entity.assembly === "GRCh38";

  const {
    data: linkedGenes,
    loading: loadingLinkedGenes,
    error: errorLinkedGenes,
  } = useLinkedGenes([entity.entityID], !isHuman);

  const {
    data: dataClosest,
    loading: loadingClosest,
    error: errorClosest,
  } = useClosestGenes(entity.entityID, entity.assembly);

  // make types for the data
  const HiCLinked = linkedGenes
    ?.filter((x: LinkedGeneInfo) => x.assay === "Intact-HiC")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const ChIAPETLinked = linkedGenes
    ?.filter((x: LinkedGeneInfo) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const crisprLinked = linkedGenes
    ?.filter((x: LinkedGeneInfo) => x.method === "CRISPR")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));
  const eqtlLinked = linkedGenes
    ?.filter((x: LinkedGeneInfo) => x.method === "eQTLs")
    .map((x: LinkedGeneInfo, index: number) => ({
      ...x,
      id: index.toString(),
    }));

  const tables: TableDef<LinkedGeneInfo>[] = [
    {
      label: "Intact Hi-C Loops",
      rows: HiCLinked,
      columns: IntactHiCLoopsCols,
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: "No intact Hi-C loops overlap this cCRE and the promoter of a gene",
      loading: loadingLinkedGenes,
      error: !!errorLinkedGenes,
    },
    {
      label: "ChIA-PET Interactions",
      rows: ChIAPETLinked,
      columns: ChIAPETCols,
      sortColumn: "score",
      sortDirection: "desc",
      emptyTableFallback: "No ChIA-PET interactions overlap this cCRE and the promoter of a gene",
      loading: loadingLinkedGenes,
      error: !!errorLinkedGenes,
    },
    {
      label: "CRISPRi-FlowFISH",
      rows: crisprLinked,
      columns: CrisprFlowFISHCols,
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: "This cCRE was not targeted in a CRISPRi-FlowFISH experiment",
      loading: loadingLinkedGenes,
      error: !!errorLinkedGenes,
    },
    {
      label: "eQTLs",
      rows: eqtlLinked,
      columns: eQTLCols,
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: "This cCRE does not overlap a variant associated with significant changes in gene expression",
      loading: loadingLinkedGenes,
      error: !!errorLinkedGenes,
    },
  ];

  const closestGenesCols: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params: any) =>
        params.value.startsWith("ENSG") ? (
          <i>{params.value}</i>
        ) : (
          <LinkComponent href={`/${entity.assembly}/gene/${params.value}`}>
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
      <Table
        rows={dataClosest}
        columns={closestGenesCols}
        label="Closest Genes"
        emptyTableFallback={"No closest genes found"}
        loading={loadingClosest}
        error={!!errorClosest}
      />
      {isHuman && <LinkedElements tables={tables} />}
    </Stack>
  );
}
