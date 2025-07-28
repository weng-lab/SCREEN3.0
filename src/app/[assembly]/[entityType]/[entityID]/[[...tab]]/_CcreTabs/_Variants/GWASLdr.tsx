import { Box, Skeleton } from "@mui/material";
import useGWASLdr from "common/hooks/useGWASLdr";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";
import { useMemo } from "react";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { LinkComponent } from "common/components/LinkComponent";

export default function GWASLdr({ accession }: { accession: string }) {
  const { data, loading, error } = useGWASLdr([accession]);
  const snpids = [...new Set(data?.map((l) => l.snpid))];
  const { data: snpAlleles, loading: loadingSnpAlleles } = useSnpFrequencies(snpids);

  const gwasSnps = useMemo(() => {
    if (!data || !snpAlleles) return undefined;
    return data.map((d) => {
      let zscore = d.zscore;

      //reverse zscore
      if (d.effect_allele === snpAlleles[d.snpid]?.alt && d.ref_allele === snpAlleles[d.snpid]?.ref) {
        zscore = d.zscore < 0 ? d.zscore : -d.zscore;
      }
      return {
        ...d,
        zscore,
      };
    });
  }, [data, snpAlleles]);

  const cols: CustomDataGridColDef<(typeof gwasSnps)[number]>[] = [
    {
      field: "snpid",
      headerName: "rsID",
      renderCell: (params) => <LinkComponent href={"/GRCh38/variant/" + params.value}>{params.value}</LinkComponent>,
    },
    {
      field: "snp_chr",
      headerName: "Chromosome",
      width: 100,
    },
    {
      field: "snp_start",
      headerName: "Position",
      renderCell: (params) => {
        return params.value.toLocaleString();
      },
    },
    {
      field: "zscore",
      headerName: "Z-score",
      type: "number",
      valueFormatter: (value?: number) => {
        if (value == null) {
          return "";
        }
        return `${value.toFixed(2)}`;
      },
    },
    {
      field: "disease",
      headerName: "Disease",
      valueGetter: (value, row) => {
        return value === "" ? row.study_source : value;
      },
    },
    {
      field: "study_source",
      headerName: "Source",
    },
    {
      field: "study_link",
      headerName: "Study",
      renderCell: (params) => {
        return (
          <LinkComponent href={params.value} showExternalIcon={!params.row.isiCRE} openInNewTab={!params.row.isiCRE}>
            {params.value}
          </LinkComponent>
        );
      },
    },
    {
      field: "author",
      headerName: "Author",
      renderCell: (params) => {
        return params.value ? `${params.value.replace(/(\d+)$/, " $1")}` : <></>;
      },
    },
  ];

  return (
    <Box width={"100%"}>
      {loading ? (
        <Skeleton variant="rounded" width={"100%"} height={100} />
      ) : (
        <CustomDataGrid
          rows={gwasSnps}
          columns={cols}
          loading={loading || loadingSnpAlleles}
          initialState={{
            sorting: {
              sortModel: [{ field: "zscore", sort: "desc" }],
            },
          }}
          tableTitle={`GWAS Variants for ${accession}`}
          emptyTableFallback={
            "This cCRE does not overlap a variant associated with significant changes in gene expression"
          }
        />
      )}
    </Box>
  );
}
