"use client";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import useLinkedGenes, { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { ChIAPETCols, CrisprFlowFISHCols, eQTLCols, IntactHiCLoopsCols } from "./columns";
import LinkedElements, { TableDef } from "common/components/linkedElements";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import useClosestGenes from "common/hooks/useClosestGenes";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useCompuLinkedGenes } from "common/hooks/useCompuLinkedGenes";
import { useState } from "react";
import { formatCoord, sharedColumns } from "../../_GwasTabs/_Gene/GWASStudyGenes";
import { InfoOutlineRounded } from "@mui/icons-material";
import SelectCompuGenesMethod from "../../_GwasTabs/_Gene/SelectCompuGenesMethod";

export default function CcreLinkedGenes({ entity }: EntityViewComponentProps) {
  const isHuman = entity.assembly === "GRCh38";
  const [method, setMethod] = useState<string>("rE2G_(DNase_only)");

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

  const {
    data: dataCompuGenes,
    loading: loadingCompuGenes,
    error: errorCompuGenes,
  } = useCompuLinkedGenes({
    accessions: [entity.entityID],
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

  const CompuLinkedGenes_columns: GridColDef<(typeof dataCompuGenes)[number]>[] = [
    {
      field: "fileaccession",
      headerName: "File",
      renderCell: (params) => (
        <LinkComponent href={`https://www.encodeproject.org/file/${params.value}`} openInNewTab showExternalIcon>
          {params.value}
        </LinkComponent>
      ),
    },
    sharedColumns.genename,
    {
      field: "geneid",
      headerName: "Gene ID",
    },
    sharedColumns.genetype,
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
    {
      label: `Computational Predictions by ${method.replaceAll("_", " ")}`,
      rows: dataCompuGenes,
      columns: CompuLinkedGenes_columns,
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
            {loadingCompuGenes ? <Typography>Fetching Computational Linked Genes by {method}</Typography> : <Typography>No Computational Predictions</Typography>}
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
    </Stack>
  );
}
