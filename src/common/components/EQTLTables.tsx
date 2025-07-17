import { useQuery } from "@apollo/client";
import { Grid2, Skeleton, Stack, Box, Typography } from "@mui/material";
import { toScientificNotationElement } from "common/utility";
import { gql } from "types/generated";
import { useElementMetadataReturn } from "common/hooks/useElementMetadata";
import { GenomicElementType } from "types/globalTypes";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { LinkComponent } from "./LinkComponent";

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

export default function EQTLs<T extends GenomicElementType>({
  data,
  elementType,
}: {
  elementType: T;
  data: useElementMetadataReturn<T>["data"];
}) {
  let variables: Record<string, any> = {};
  let gtexTitle: string;
  let onekTitle: string;

  //Change query variables and table title based on element type
  if (elementType === "gene") {
    const geneData = data as useElementMetadataReturn<"gene">["data"];
    variables = { genes: [geneData.name] };
    gtexTitle = `GTEX whole-blood eQTLs for ${geneData.name}`;
    onekTitle = `OneK1K eQTLs for ${geneData.name}`;
  } else if (elementType === "icre") {
    const icreData = data as useElementMetadataReturn<"icre">["data"];
    variables = { ccre: [icreData.accession] };
    gtexTitle = `GTEX whole-blood eQTLs for ${icreData.accession}`;
    onekTitle = `OneK1K eQTLs for ${icreData.accession}`;
  } else {
    const snpData = data as useElementMetadataReturn<"variant">["data"];
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

  const gtexColumns: CustomDataGridColDef<(typeof gtexRows)[number]>[] = [];

  gtexColumns.push({
    field: "variant_id",
    headerName: "Variant Name",
  });

  if (elementType === "gene" || elementType === "icre") {
    gtexColumns.push({
      field: "rsid",
      headerName: "rsID",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/variant/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  if (elementType === "variant" || elementType === "icre") {
    gtexColumns.push({
      field: "genename",
      headerName: "Gene",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/gene/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  if (elementType === "gene" || elementType === "icre") {
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

  if (elementType === "gene" || elementType === "variant") {
    gtexColumns.push({
      field: "ccre",
      headerName: "iCRE",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/icre/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  const oneK1KColumns: CustomDataGridColDef<(typeof gtexRows)[number]>[] = [];

  if (elementType === "gene" || elementType === "icre") {
    oneK1KColumns.push(
      {
        field: "rsid",
        headerName: "rsID",
        renderCell: (params) => <LinkComponent href={`/variant/${params.value}`}>{params.value}</LinkComponent>,
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

  if (elementType === "variant" || elementType === "icre") {
    oneK1KColumns.push({
      field: "genename",
      headerName: "Gene",
      renderCell: (params) => <LinkComponent href={`/gene/${params.value}`}>{params.value}</LinkComponent>,
    });
  }

  if (elementType === "gene" || elementType === "icre") {
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

  if (elementType === "gene" || elementType === "variant") {
    oneK1KColumns.push({
      field: "ccre",
      headerName: "iCRE",
      renderCell: (params) =>
        params.value === "." ? (
          <>{params.value}</>
        ) : (
          <LinkComponent href={`/icre/${params.value}`}>{params.value}</LinkComponent>
        ),
    });
  }

  if (loading) {
    return (
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={500} />
        </Grid2>
        <Grid2 size={12}>
          <Skeleton variant="rounded" width={"100%"} height={500} />
        </Grid2>
      </Grid2>
    );
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ flex: "1 1 auto" }}>
        <CustomDataGrid
          columns={gtexColumns}
          rows={gtexRows}
          tableTitle={gtexTitle}
          initialState={{
            sorting: {
              sortModel: [{ field: "pval_nominal", sort: "asc" }],
            },
          }}
          emptyTableFallback={"No GTEX whole-blood eQTLs found"}
        />
      </Box>
      <Box sx={{ flex: "1 1 auto" }}>
        <CustomDataGrid
          columns={oneK1KColumns}
          rows={oneK1KRows}
          tableTitle={onekTitle}
          initialState={{
            sorting: {
              sortModel: [{ field: "fdr", sort: "asc" }],
            },
          }}
          emptyTableFallback={"No OneK1K eQTLs found"}
        />
      </Box>
    </Stack>
  );
}
