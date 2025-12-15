"use client";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { InfoOutlineRounded } from "@mui/icons-material";
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
import { useState } from "react";
import { useCompuLinkedcCREs } from "common/hooks/useCompuLinkedcCREs";
import { formatCoord, sharedColumns } from "../../_GwasTabs/_Gene/GWASStudyGenes";
import SelectCompuGenesMethod from "../../_GwasTabs/_Gene/SelectCompuGenesMethod";

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
  const [method, setMethod] = useState<string>("rE2G_(DNase_only)");
  const { data, loading, error } = useLinkedCcres({ geneid: geneData?.data.id });

  const {
    data: dataCompucCREs,
    loading: loadingCompucCREs,
    error: errorCompucCREs,
  } = useCompuLinkedcCREs({
    geneid: geneData ? [geneData?.data.id.split(".")[0]] : [],
    method,
  });

  //Not really sure how this works, but only way to anchor the popper since the extra toolbarSlot either gets unrendered or unmouted after
  //setting the anchorEl to the button
  const [virtualAnchor, setVirtualAnchor] = useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);

  const handleClickClose = () => {
    if (virtualAnchor) {
      setVirtualAnchor(null);
    }
  };

  const handleMethodSelected = (method: string) => {
    setMethod(method);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (virtualAnchor) {
      // If already open, close it
      setVirtualAnchor(null);
    } else {
      // Open it, store the current position
      const rect = event.currentTarget.getBoundingClientRect();
      setVirtualAnchor({
        getBoundingClientRect: () => rect,
      });
    }
  };

  const CompuLinkedcCREs_columns: GridColDef<(typeof dataCompucCREs)[number]>[] = [
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
    {
      label: `Computational Predictions by ${method.replaceAll("_", " ")}`,
      rows: dataCompucCREs,
      columns: CompuLinkedcCREs_columns,
      sortColumn: "score",
      sortDirection: "desc",
      emptyTableFallback:
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
            {loadingCompucCREs ? <Typography>Fetching Computational Linked cCREs by {method}</Typography> : <Typography>No Computational Predictions</Typography>}
          </Stack>
          <Tooltip title="Advanced Filters">
            <Button variant="outlined" onClick={handleClick}>
              Change Method
            </Button>
          </Tooltip>
        </Stack>
      ,
      toolbarSlot: <Tooltip title="Advanced Filters">
        <Button variant="outlined" onClick={handleClick}>
          Change Method
        </Button>
      </Tooltip>
    }
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
          open={Boolean(virtualAnchor)}
          setOpen={handleClickClose}
          onMethodSelect={handleMethodSelected}
        />
      </Box>
    </>
  );
}
