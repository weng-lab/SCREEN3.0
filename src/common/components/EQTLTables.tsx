"use client";
import { useQuery } from "@apollo/client/react";
import { Stack } from "@mui/material";
import { ScientificNotation } from "common/utils";
import { gql } from "common/types/generated";
import { GetimmuneeQtLsQueryQuery, GetimmuneeQtLsQueryQueryVariables } from "common/types/generated/graphql";
import { LinkComponent } from "./LinkComponent";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { Assembly } from "common/types/globalTypes";

const EQTL_QUERY = gql(`
query getimmuneeQTLsQuery($genes: [String], $snps: [String],$ccre: [String]) {
  immuneeQTLsQuery(genes: $genes, snps: $snps, ccre: $ccre) {
    rsid
    genename
    study
    fdr
    celltype
    ref
    chromosome
    position
    alt
    variant_id    
    pval_nominal
    ccre
    slope
    spearmans_rho
  }
} 
`);

type EQTLRow = GetimmuneeQtLsQueryQuery["immuneeQTLsQuery"][number];
type EQTLColumn = TableColDef<EQTLRow>;
type EntityType = EntityViewComponentProps["entity"]["entityType"];

// eQTL rows carry "." where the source data has no value; those cells are plain text, not links
const linkUnlessMissing = (href: (value: string) => string): EQTLColumn["renderCell"] =>
  // Named so react/display-name is satisfied — the renderCell result is treated as a component
  function LinkCell(params) {
    return params.value === "." ? (
      <>{params.value}</>
    ) : (
      <LinkComponent href={href(params.value)}>{params.value}</LinkComponent>
    );
  };

const scientific: EQTLColumn["renderCell"] = (params) => ScientificNotation(params.value, 2, { variant: "body2" });

const gtexColumns = (entityType: EntityType, assembly: Assembly): EQTLColumn[] => {
  const showVariantCols = entityType === "gene" || entityType === "ccre";
  return [
    { field: "variant_id", headerName: "Variant Name" },
    ...(showVariantCols
      ? [{ field: "rsid", headerName: "rsID", renderCell: linkUnlessMissing((v) => `/${assembly}/variant/${v}`) }]
      : []),
    ...(entityType === "variant" || entityType === "ccre"
      ? [{ field: "genename", headerName: "Gene", renderCell: linkUnlessMissing((v) => `/${assembly}/gene/${v}`) }]
      : []),
    ...(showVariantCols
      ? [
          { field: "chromosome", headerName: "Chromosome" },
          { field: "position", headerName: "Position" },
          { field: "ref", headerName: "Ref" },
          { field: "alt", headerName: "Alt" },
        ]
      : []),
    { field: "slope", headerName: "Slope", display: "flex", renderCell: scientific },
    { field: "pval_nominal", headerName: "Q Value", display: "flex", renderCell: scientific },
    { field: "celltype", headerName: "Celltype", valueGetter: (_, row) => row.celltype.replaceAll("_", " ") },
    ...(entityType === "gene" || entityType === "variant"
      ? [{ field: "ccre", headerName: "cCRE", renderCell: linkUnlessMissing((v) => `/${assembly}/ccre/${v}`) }]
      : []),
  ];
};

const oneK1KColumns = (entityType: EntityType, assembly: Assembly): EQTLColumn[] => {
  const showVariantCols = entityType === "gene" || entityType === "ccre";
  return [
    ...(showVariantCols
      ? [
          {
            field: "rsid",
            headerName: "rsID",
            renderCell: (params) => (
              <LinkComponent href={`/${assembly}/variant/${params.value}`}>{params.value}</LinkComponent>
            ),
          },
          { field: "chromosome", headerName: "Chromosome" },
          { field: "position", headerName: "Position" },
        ]
      : []),
    ...(entityType === "variant" || entityType === "ccre"
      ? [
          {
            field: "genename",
            headerName: "Gene",
            renderCell: (params) => (
              <LinkComponent href={`/${assembly}/gene/${params.value}`}>{params.value}</LinkComponent>
            ),
          },
        ]
      : []),
    ...(showVariantCols
      ? [
          { field: "ref", headerName: "A1" },
          { field: "alt", headerName: "A2" },
        ]
      : []),
    { field: "fdr", headerName: "FDR", display: "flex", renderCell: scientific },
    { field: "spearmans_rho", headerName: "Spearman's rho", display: "flex", renderCell: scientific },
    { field: "celltype", headerName: "Celltype" },
    ...(entityType === "gene" || entityType === "variant"
      ? [{ field: "ccre", headerName: "cCRE", renderCell: linkUnlessMissing((v) => `/${assembly}/ccre/${v}`) }]
      : []),
  ];
};

const queryVariables = (entityType: EntityType, entityID: string): GetimmuneeQtLsQueryQueryVariables => {
  if (entityType === "gene") return { genes: [entityID] };
  if (entityType === "ccre") return { ccre: [entityID] };
  return { snps: [entityID] };
};

export default function EQTLs({ entity }: EntityViewComponentProps) {
  const { entityID, entityType, assembly } = entity;

  const {
    loading,
    error,
    data: eqtlData,
  } = useQuery(EQTL_QUERY, {
    variables: queryVariables(entityType, entityID),
    skip: !entity,
  });

  const gtexRows = eqtlData?.immuneeQTLsQuery.filter((i) => i.study === "GTEX");
  const oneK1KRows = eqtlData?.immuneeQTLsQuery.filter((i) => i.study === "OneK1K");

  return (
    <Stack spacing={2}>
      <Table
        columns={gtexColumns(entityType, assembly)}
        rows={gtexRows}
        loading={loading}
        error={!!error}
        label={`GTEx eQTLs for ${entityID}`}
        initialState={{
          sorting: {
            sortModel: [{ field: "pval_nominal", sort: "asc" }],
          },
        }}
        emptyTableFallback={"No GTEx eQTLs found"}
        divHeight={{ maxHeight: "400px" }}
      />
      <Table
        columns={oneK1KColumns(entityType, assembly)}
        rows={oneK1KRows}
        loading={loading}
        error={!!error}
        label={`OneK1K eQTLs for ${entityID}`}
        initialState={{
          sorting: {
            sortModel: [{ field: "fdr", sort: "asc" }],
          },
        }}
        emptyTableFallback={"No OneK1K eQTLs found"}
        divHeight={{ maxHeight: "400px" }}
      />
    </Stack>
  );
}
