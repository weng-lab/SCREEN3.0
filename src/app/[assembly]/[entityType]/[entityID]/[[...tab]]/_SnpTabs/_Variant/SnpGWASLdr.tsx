import { Box, Skeleton } from "@mui/material";
import useGWASLdr from "common/hooks/useGWASLdr";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";

export default function SnpGWASLdr({ snpid }: { snpid: string }) {
  const { data, loading, error } = useGWASLdr(undefined, [snpid]);
  const snpAlleles = useSnpFrequencies([snpid]);
  const ref = snpAlleles.data && snpAlleles.data[snpid]?.ref;
  const alt = snpAlleles.data && snpAlleles.data[snpid]?.alt;

  let gwasnps = data?.map((d) => {
    let zscore = d.zscore;
    //reverse zscore
    if (d.effect_allele === alt && d.ref_allele === ref) {
      zscore = d.zscore < 0 ? d.zscore : -d.zscore;
    }
    return {
      ...d,
      zscore,
    };
  });
  const cols: GridColDef[] = [
    {
      field: "disease",
      headerName: "Disease",
      valueGetter: (value, row) => {
        return value === "" ? row.study_source : value;
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
        <Table
          rows={gwasnps}
          columns={cols}
          initialState={{
            sorting: {
              sortModel: [{ field: "zscore", sort: "desc" }],
            },
          }}
          label="GWAS Variants"
          emptyTableFallback={"This variant is not identified in any genome wide association studies (GWAS)"}
        />
      )}
    </Box>
  );
}
