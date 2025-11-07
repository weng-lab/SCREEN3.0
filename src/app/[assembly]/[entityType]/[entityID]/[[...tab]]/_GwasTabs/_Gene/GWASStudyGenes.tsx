"use client";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Table } from "@weng-lab/ui-components";
import { Box, Button, Tooltip } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { toScientificNotationElement } from "common/utility";
import { useState } from "react";
import SelectCompuGenesMethod from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GwasTabs/_Gene/SelectCompuGenesMethod";

import useLinkedGenes from "common/hooks/useLinkedGenes";
import { useCompuLinkedGenes } from "common/hooks/useCompuLinkedGenes";
import { useGWASSnpsIntersectingcCREsData } from "common/hooks/useGWASSnpsIntersectingcCREsData";
import { EntityViewComponentProps } from "common/entityTabsConfig";

function formatCoord(str: string) {
  const [chrom, start, end] = str.split("_");
  return `${chrom}:${start}-${end}`;
}

// Shared column definitions
const sharedColumns: { [key: string]: GridColDef } = {
  accession: {
    field: "accession",
    headerName: "Accession",
    renderCell: (params) => (
      <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
        <i>{params.value}</i>
      </LinkComponent>
    ),
  },
  gene: {
    field: "gene",
    headerName: "Common Gene Name",
    renderCell: (params) => (
      <LinkComponent href={`/GRCh38/gene/${params.value}`}>
        <i>{params.value}</i>
      </LinkComponent>
    ),
  },
  genename: {
    field: "genename",
    headerName: "Common Gene Name",
    renderCell: (params) => (
      <LinkComponent href={`/GRCh38/gene/${params.value}`}>
        <i>{params.value}</i>
      </LinkComponent>
    ),
  },
  genetype: {
    field: "genetype",
    headerName: "Gene Type",
    valueGetter: (_, row) =>
      row.genetype === "lncRNA"
        ? row.genetype
        : row.genetype
            .replaceAll("_", " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
  },
  assay: {
    field: "assay",
    headerName: "Assay Type",
  },
  experiment_accession: {
    field: "experiment_accession",
    headerName: "Experiment ID",
    renderCell: (params) => (
      <LinkComponent href={`https://www.encodeproject.org/experiments/${params.value}`} openInNewTab showExternalIcon>
        {params.value}
      </LinkComponent>
    ),
  },
  displayname: {
    field: "displayname",
    headerName: "Biosample",
  },
  score: {
    field: "score",
    headerName: "Score",
    type: "number",
  },
  p_val: {
    field: "p_val",
    headerName: "P",
    renderHeader: () => (
      <p>
        <i>P&nbsp;</i>
      </p>
    ),
    renderCell: (params) => (
      <>
        {params.value === 0
          ? "0"
          : toScientificNotationElement(params.value, 2, {
              variant: "body2",
            })}
      </>
    ),
    type: "number",
  },
};

export const GWASStudyGenes = ({ entity }: EntityViewComponentProps) => {
  const [method, setMethod] = useState<string>("rE2G_(DNase_only)");

  const {
    data: dataGWASSNPscCREs,
    loading: loadingGWASSNPscCREs,
    error: errorGWASSNPscCREs,
  } = useGWASSnpsIntersectingcCREsData({ studyid: [entity.entityID] });

  const {
    data: dataGWASSnpscCREsGenes,
    loading: loadingGWASSnpscCREsGenes,
    error: errorGWASSnpscCREsGenes,
  } = useLinkedGenes(dataGWASSNPscCREs ? [...new Set(dataGWASSNPscCREs.map((g) => g.ccre))] : []);

  const {
    data: dataGWASSnpscCREsCompuGenes,
    loading: loadingGWASSnpscCREsCompuGenes,
    error: errorGWASSnpscCREsCompuGenes,
  } = useCompuLinkedGenes({
    accessions: dataGWASSNPscCREs ? [...new Set(dataGWASSNPscCREs.map((g) => g.ccre))] : [],
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

  const HiCLinked = dataGWASSnpscCREsGenes?.filter((x) => x.assay === "Intact-HiC");

  const ChIAPETLinked = dataGWASSnpscCREsGenes?.filter(
    (x) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET"
  );
  const crisprLinked = dataGWASSnpscCREsGenes?.filter((x) => x.method === "CRISPR");
  const eqtlLinked = dataGWASSnpscCREsGenes?.filter((x) => x.method === "eQTLs");
  const CompuLinkedGenes_columns: GridColDef<(typeof dataGWASSnpscCREsCompuGenes)[number]>[] = [
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

  const HiC_columns: GridColDef<(typeof HiCLinked)[number]>[] = [
    sharedColumns.accession,
    sharedColumns.gene,
    sharedColumns.genetype,
    sharedColumns.assay,
    sharedColumns.experiment_accession,
    sharedColumns.displayname,
    sharedColumns.score,
    sharedColumns.p_val,
  ];

  const eqtl_columns: GridColDef<(typeof eqtlLinked)[number]>[] = [
    sharedColumns.accession,
    sharedColumns.gene,
    sharedColumns.genetype,
    {
      field: "variantid",
      headerName: "Variant ID",
    },
    {
      field: "source",
      headerName: "Source",
    },
    {
      field: "tissue",
      headerName: "Tissue",
    },
    {
      field: "slope",
      headerName: "Slope",
    },
    sharedColumns.p_val,
  ];

  const CRISPR_columns: GridColDef<(typeof crisprLinked)[number]>[] = [
    sharedColumns.accession,
    sharedColumns.gene,
    sharedColumns.genetype,
    sharedColumns.assay,
    sharedColumns.experiment_accession,
    sharedColumns.displayname,
    {
      field: "effectsize",
      headerName: "Effect Size",
    },
    sharedColumns.p_val,
  ];

  const ChIA_PET_columns: GridColDef<(typeof ChIAPETLinked)[number]>[] = [
    sharedColumns.accession,
    sharedColumns.gene,
    sharedColumns.genetype,
    sharedColumns.assay,
    sharedColumns.experiment_accession,
    sharedColumns.score,
    sharedColumns.displayname,
  ];

  const errorLinked = !!(errorGWASSNPscCREs || errorGWASSnpscCREsGenes);
  const loadingLinked = loadingGWASSnpscCREsGenes || loadingGWASSNPscCREs;
  const errorCompu = !!(errorGWASSNPscCREs || errorGWASSnpscCREsCompuGenes);
  const loadingCompu = loadingGWASSnpscCREsGenes || loadingGWASSnpscCREsCompuGenes;

  return (
    <>
      <Table
        showToolbar
        rows={HiCLinked}
        columns={HiC_columns}
        loading={loadingLinked}
        error={errorLinked}
        label={`Intact Hi-C Loops`}
        emptyTableFallback={"No intact Hi-C loops overlaps cCREs identified by this GWAS"}
        initialState={{
          sorting: {
            sortModel: [{ field: "p_val", sort: "asc" }],
          },
        }}
        divHeight={{ height: "600px" }}
      />
      <Table
        showToolbar
        rows={ChIAPETLinked}
        columns={ChIA_PET_columns}
        loading={loadingLinked}
        error={errorLinked}
        label={`ChIA-PET Interactions`}
        emptyTableFallback={"No ChIA-PET Interactions overlaps cCREs identified by this GWAS"}
        initialState={{
          sorting: {
            sortModel: [{ field: "score", sort: "desc" }],
          },
        }}
        divHeight={{ height: "600px" }}
      />
      <Table
        showToolbar
        rows={crisprLinked}
        columns={CRISPR_columns}
        loading={loadingLinked}
        error={errorLinked}
        label={`CRISPRi-FlowFISH`}
        emptyTableFallback={"No cCREs identified by this GWAS were targeted in CRISPRi-FlowFISH experiments"}
        initialState={{
          sorting: {
            sortModel: [{ field: "p_val", sort: "asc" }],
          },
        }}
        divHeight={{ height: "600px" }}
      />
      <Table
        showToolbar
        rows={eqtlLinked}
        columns={eqtl_columns}
        loading={loadingLinked}
        error={errorLinked}
        label={`eQTLs`}
        emptyTableFallback={
          "No cCREs identified by this GWAS overlap a variant associated with significant changes in gene expression"
        }
        initialState={{
          sorting: {
            sortModel: [{ field: "p_val", sort: "asc" }],
          },
        }}
        divHeight={{ height: "600px" }}
      />
      <Table
        showToolbar
        rows={dataGWASSnpscCREsCompuGenes}
        columns={CompuLinkedGenes_columns}
        loading={loadingCompu}
        error={errorCompu}
        label={`Computational Predictions`}
        emptyTableFallback={"No Computational Predictions"}
        initialState={{
          sorting: {
            sortModel: [{ field: "score", sort: "desc" }],
          },
        }}
        labelTooltip={"Only one method can be shown at a time — select a method by clicking the button to the right"}
        toolbarSlot={
          <Tooltip title="Advanced Filters">
            <Button variant="outlined" onClick={handleClick}>
              Select Method
            </Button>
          </Tooltip>
        }
        divHeight={{ height: "600px" }}
      />
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
};
