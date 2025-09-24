import { useQuery } from "@apollo/client";
import { Grid, Skeleton, Stack, Box } from "@mui/material";
import { toScientificNotationElement } from "common/utility";
import { gql } from "types/generated";
import { useEntityMetadataReturn } from "common/hooks/useEntityMetadata";
import { Assembly } from "types/globalTypes";
import { LinkComponent } from "./LinkComponent";
import {
  GridColDef,
  Table
} from "@weng-lab/ui-components";
import { AnyEntityType } from "common/EntityDetails/entityTabsConfig";

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

export default function EQTLs<T extends AnyEntityType>({
  data,
  entityType,
  assembly,
}: {
  entityType: AnyEntityType;
  data: useEntityMetadataReturn<T>["data"];
  assembly: Assembly;
}) {
  let variables: Record<string, any> = {};
  let gtexTitle: string;
  let onekTitle: string;

  //Change query variables and table title based on element type
  if (entityType === "gene") {
    const geneData = data as useEntityMetadataReturn<"gene">["data"];
    variables = { genes: [geneData.name] };
    gtexTitle = `GTEX whole-blood eQTLs for ${geneData.name}`;
    onekTitle = `OneK1K eQTLs for ${geneData.name}`;
  } else if (entityType === "ccre") {
    const ccreData = data as useEntityMetadataReturn<"ccre">["data"];
    variables = { ccre: [ccreData.info.accession] };
    gtexTitle = `GTEX whole-blood eQTLs for ${ccreData.info.accession}`;
    onekTitle = `OneK1K eQTLs for ${ccreData.info.accession}`;
  } else {
    const snpData = data as useEntityMetadataReturn<"variant">["data"];
    variables = { snps: [snpData.id] };
    gtexTitle = `GTEX whole-blood eQTLs for ${snpData.id}`;
    onekTitle = `OneK1K eQTLs for ${snpData.id}`;
  }

  const {
    loading,
    error,
    data: eqtlData,
  } = useQuery(EQTL_QUERY, {
    variables,
    skip: !data,
  });

  const gtexRows = eqtlData?.immuneeQTLsQuery.filter((i) => i.study === "GTEX");
  const oneK1KRows = eqtlData?.immuneeQTLsQuery.filter((i) => i.study === "OneK1K");

  const gtexColumns: GridColDef<(typeof gtexRows)[number]>[] = [];

  gtexColumns.push({
    field: "variant_id",
    headerName: "Variant Name",
  });

  if (entityType === "gene" || entityType === "ccre") {
    gtexColumns.push({
      field: "rsid",
      headerName: "rsID",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/${assembly}/variant/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  if (entityType === "variant" || entityType === "ccre") {
    gtexColumns.push({
      field: "genename",
      headerName: "Gene",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/${assembly}/gene/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  if (entityType === "gene" || entityType === "ccre") {
    gtexColumns.push(
      { field: "chromosome", headerName: "Chromosome" },
      { field: "position", headerName: "Position" },
      { field: "ref", headerName: "Ref" },
      { field: "alt", headerName: "Alt" }
    );
  }

  gtexColumns.push(
    {
      field: "slope",
      headerName: "Slope",
      display: "flex",
      renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
    },
    {
      field: "pval_nominal",
      headerName: "Nominal P",
      display: "flex",
      renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
    }
  );

  if (entityType === "gene" || entityType === "variant") {
    gtexColumns.push({
      field: "ccre",
      headerName: "ccre",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/${assembly}/ccre/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  const oneK1KColumns: GridColDef<(typeof gtexRows)[number]>[] = [];

  if (entityType === "gene" || entityType === "ccre") {
    oneK1KColumns.push(
      {
        field: "rsid",
        headerName: "rsID",
        renderCell: (params) => <LinkComponent href={`/${assembly}/variant/${params.value}`}>{params.value}</LinkComponent>,
      },
      {
        field: "chromosome",
        headerName: "Chromosome",
      },
      {
        field: "position",
        headerName: "Position",
      }
    );
  }

  if (entityType === "variant" || entityType === "ccre") {
    oneK1KColumns.push({
      field: "genename",
      headerName: "Gene",
      renderCell: (params) => <LinkComponent href={`/${assembly}/gene/${params.value}`}>{params.value}</LinkComponent>,
    });
  }

  if (entityType === "gene" || entityType === "ccre") {
    oneK1KColumns.push(
      {
        field: "ref",
        headerName: "A1",
      },
      {
        field: "alt",
        headerName: "A2",
      }
    );
  }

  oneK1KColumns.push(
    {
      field: "fdr",
      headerName: "FDR",
      display: "flex",
      renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
    },
    {
      field: "spearmans_rho",
      headerName: "Spearman's rho",
      display: "flex",
      renderCell: (params) => toScientificNotationElement(params.value, 2, { variant: "body2" }),
    },
    {
      field: "celltype",
      headerName: "Celltype",
    }
  );

  if (entityType === "gene" || entityType === "variant") {
    oneK1KColumns.push({
      field: "ccre",
      headerName: "ccre",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/${assembly}/ccre/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  if (loading) {
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={300} />
        </Grid>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={300} />
        </Grid>
      </Grid>
    );
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ flex: "1 1 auto" }}>
        <Table
          columns={gtexColumns}
          rows={gtexRows}
          label={gtexTitle}
          initialState={{
            sorting: {
              sortModel: [{ field: "pval_nominal", sort: "asc" }],
            },
          }}
          emptyTableFallback={"No GTEX whole-blood eQTLs found"}
          divHeight={{height: "400px"}}
        />
      </Box>
      <Box sx={{ flex: "1 1 auto" }}>
        <Table
          columns={oneK1KColumns}
          rows={oneK1KRows}
          label={onekTitle}
          initialState={{
            sorting: {
              sortModel: [{ field: "fdr", sort: "asc" }],
            },
          }}
          emptyTableFallback={"No OneK1K eQTLs found"}
          divHeight={{height: "400px"}}
        />
      </Box>
    </Stack>
  );
}
