"use client";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { InfoOutlineRounded } from "@mui/icons-material";
import { Grid, Skeleton } from "@mui/material";
import { useLinkedCcres, useLinkedCcresReturn } from "common/hooks/data/gene";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "../../_CcreTabs/_Genes/columns";
import LinkedElements, { TableDef } from "common/components/linkedElements";
import { UseGeneDataReturn } from "common/hooks/data/gene";
import { usePathname } from "next/navigation";
import { Assembly } from "common/types/globalTypes";
import { TableColDef } from "@weng-lab/ui-components";
import { GridRenderCellParams } from "@mui/x-data-grid-premium";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/data/ccre";
import { useState } from "react";
import { useCompuLinkedcCREs } from "common/hooks/data/gene";
import { formatCoord, sharedColumns } from "../../_GwasTabs/_Gene/columns";
import SelectCompuGenesMethod from "../../_GwasTabs/_Gene/SelectCompuGenesMethod";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";

const accessionCol = (assembly: string): TableColDef => ({
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
  const [method, setMethod] = useState<string>("rE2G_(DNase_only)");
  const { data, loading, error } = useLinkedCcres({ geneid: geneData?.data?.id });

  const { data: dataCompucCREs, loading: loadingCompucCREs } = useCompuLinkedcCREs({
    geneid: geneData.data ? [geneData?.data?.id.split(".")[0]] : [],
    method,
  });

  const [open, setOpen] = useState(false);

  const handleClickClose = () => {
    setOpen(false);
  };

  const handleMethodSelected = (method: string) => {
    setMethod(method);
  };

  const CompuLinkedcCREs_columns: TableColDef<(typeof dataCompucCREs)[number]>[] = [
    sharedColumns.accession,
    {
      field: "fileaccession",
      headerName: "File",
      renderCell: (params) => (
        <LinkComponent href={`https://www.encodeproject.org/file/${params.value}`} openInNewTab showExternalIcon>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "method",
      headerName: "Method",
      valueGetter: (_, row) => row.method.replaceAll("_", " "),
    },
    {
      field: "methodregion",
      headerName: "Method Region",
      valueGetter: (_, row) => formatCoord(row.methodregion),
    },
    {
      field: "celltype",
      headerName: "Biosample",
      valueGetter: (_, row) =>
        row.celltype
          .replaceAll("_", " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
    },
    {
      ...sharedColumns.score,
      valueGetter: (_, row) => row.score.toFixed(2),
    },
  ];

  const pathname = usePathname();
  const assembly = pathname.split("/")[1];

  const {
    data: dataCcres,
    loading: loadingCcres,
    error: errorCcres,
  } = useCcreData({
    accessions: data?.map((acc) => acc.accession) ?? [],
    assembly: assembly as Assembly,
    skip: !data,
  });

  const classByAccession = Object.fromEntries(dataCcres?.map((c) => [c.accession, c.group]) ?? []);

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

  type LinkedCcreRow = useLinkedCcresReturn["data"][number] & { id: string; class: string };

  const collectLinked = (predicate: (x: useLinkedCcresReturn["data"][number]) => boolean) =>
    data.reduce<LinkedCcreRow[]>((acc, x) => {
      if (predicate(x)) {
        acc.push({
          ...x,
          id: acc.length.toString(),
          class: classByAccession[x.accession] ?? "Unclassifed",
        });
      }
      return acc;
    }, []);

  const HiCLinked = collectLinked((x) => x.assay === "Intact-HiC");
  const ChIAPETLinked = collectLinked((x) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET");
  const crisprLinked = collectLinked((x) => x.method === "CRISPR");
  const eqtlLinked = collectLinked((x) => x.method === "eQTLs");

  const tables: TableDef<useLinkedCcresReturn["data"][number]>[] = [
    {
      label: "Intact Hi-C Loops",
      rows: HiCLinked,
      columns: [
        accessionCol(assembly),
        {
          field: "class",
          headerName: "Classification",
          ...ClassificationFormatting,
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
          ...ClassificationFormatting,
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
          ...ClassificationFormatting,
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
          ...ClassificationFormatting,
        },
        ...eQTLCols.slice(2),
      ],
      sortColumn: "p_val",
      sortDirection: "asc",
      emptyTableFallback: `No cCREs overlap variants associated with significant changes in expression of this gene`,
    },
    {
      label: `Computational Predictions by ${method.replaceAll("_", " ")}`,
      rows: dataCompucCREs,
      columns: CompuLinkedcCREs_columns,
      sortColumn: "score",
      sortDirection: "desc",
      emptyTableFallback: (
        <Stack
          direction={"row"}
          border={"1px solid #e0e0e0"}
          borderRadius={1}
          p={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} spacing={1}>
            <InfoOutlineRounded />
            {loadingCompucCREs ? (
              <Typography>Fetching Computational Linked cCREs by {method}</Typography>
            ) : (
              <Typography>No Computational Predictions</Typography>
            )}
          </Stack>
          <Tooltip title="Advanced Filters">
            <Button variant="outlined" onClick={() => setOpen(true)}>
              Change Method
            </Button>
          </Tooltip>
        </Stack>
      ),
      slotProps: {
        toolbar: {
          extra: (
            <Tooltip title="Advanced Filters">
              <Button variant="outlined" onClick={() => setOpen(true)}>
                Change Method
              </Button>
            </Tooltip>
          ),
        },
      },
    },
  ];

  return (
    <>
      <LinkedElements tables={tables} />
      <Box
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation();
        }}
      >
        <SelectCompuGenesMethod
          method={method}
          open={open}
          setOpen={handleClickClose}
          onMethodSelect={handleMethodSelected}
        />
      </Box>
    </>
  );
}
