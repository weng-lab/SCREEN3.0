"use client";
import { Grid, Skeleton } from "@mui/material";
import { useLinkedCcres, useLinkedCcresReturn } from "common/hooks/useLinkedCcres";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "../../_CcreTabs/_Genes/columns";
import LinkedElements, { TableDef } from "common/components/linkedElements";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { usePathname } from "next/navigation";
import { Assembly } from "common/types/globalTypes";
import { GridColDef, GridRenderCellParams } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import { classificationFormatting } from "common/components/ClassificationFormatting";

export const accessionCol = (assembly: string): GridColDef => ({
  field: "accession",
  headerName: "Accession",
  renderCell: (params: GridRenderCellParams) => (
    <LinkComponent href={`/${assembly}/ccre/${params.value}`}>{params.value}</LinkComponent>
  ),
});

export default function ComputationalLinkedCcres({
  geneData,
}: {
  geneData: UseGeneDataReturn<{ name: string; assembly: Assembly }>;
}) {
  const pathname = usePathname();
  const assembly = pathname.split("/")[1];

  const { data, loading, error } = useLinkedCcres({ geneid: geneData?.data.id });

  const {
    data: dataCcres,
    loading: loadingCcres,
    error: errorCcres,
  } = useCcreData({
    accession: data?.map((acc) => acc.accession),
    assembly: assembly as Assembly,
    skip: !data,
  });

  const classByAccession = Object.fromEntries(dataCcres?.map((c) => [c.info.accession, c.pct]) ?? []);

  if (geneData.loading || loading || loadingCcres) {
    return (
      <Grid container spacing={2} width={"100%"}>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={300} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={300} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={300} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={300} />
        </Grid>
      </Grid>
    );
  }

  if (error || errorCcres) {
    throw new Error(JSON.stringify(error));
  }

  const HiCLinked = data
    .filter((x) => x.assay === "Intact-HiC")
    .map((x, index: number) => ({
      ...x,
      id: index.toString(),
      class: classByAccession[x.accession] ?? "Unclassifed",
    }));
  const ChIAPETLinked = data
    .filter((x) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET")
    .map((x, index: number) => ({
      ...x,
      id: index.toString(),
      class: classByAccession[x.accession] ?? "Unclassifed",
    }));
  const crisprLinked = data
    .filter((x) => x.method === "CRISPR")
    .map((x, index: number) => ({
      ...x,
      id: index.toString(),
      class: classByAccession[x.accession] ?? "Unclassifed",
    }));
  const eqtlLinked = data
    .filter((x) => x.method === "eQTLs")
    .map((x, index: number) => ({
      ...x,
      id: index.toString(),
      class: classByAccession[x.accession] ?? "Unclassifed",
    }));

  const tables: TableDef<useLinkedCcresReturn["data"][number]>[] = [
    {
      label: "Intact Hi-C Loops",
      rows: HiCLinked,
      columns: [
        accessionCol(assembly),
        {
          field: "class",
          headerName: "Classification",
          ...classificationFormatting,
        },
        ...IntactHiCLoopsCols.slice(2),
      ],
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: `No intact Hi-C loops overlap a cCRE and the promoter of this gene`,
    },
    {
      label: "ChIA-PET",
      rows: ChIAPETLinked,
      columns: [
        accessionCol(assembly),
        {
          field: "class",
          headerName: "Classification",
          ...classificationFormatting,
        },
        ...ChIAPETCols.slice(2),
      ],
      sortColumn: "score",
      sortDirection: "desc",
      emptyTableFallback: `No ChIA-PET interactions overlap a cCRE and the promoter of this gene`,
    },
    {
      label: "CRISPRi-FlowFISH",
      rows: crisprLinked,
      columns: [
        accessionCol(assembly),
        {
          field: "class",
          headerName: "Classification",
          ...classificationFormatting,
        },
        ...CrisprFlowFISHCols.slice(2),
      ],
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: `No cCREs targeted in a CRISPRi-FlowFISH experiment were linked to this gene`,
    },
    {
      label: "eQTLs",
      rows: eqtlLinked,
      columns: [
        accessionCol(assembly),
        {
          field: "class",
          headerName: "Classification",
          ...classificationFormatting,
        },
        ...eQTLCols.slice(2),
      ],
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: `No cCREs overlap variants associated with significant changes in expression of this gene`,
    },
  ];

  return <LinkedElements tables={tables} />;
}
