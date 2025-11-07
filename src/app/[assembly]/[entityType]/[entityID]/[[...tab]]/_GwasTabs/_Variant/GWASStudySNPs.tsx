"use client";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Table } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useGWASSnpsData } from "common/hooks/useGWASSnpsData";;
import { EntityViewComponentProps } from "common/entityTabsConfig";

export const GWASStudySNPs = ({ entity }: EntityViewComponentProps) => {
  const {
    data: dataGWASSnps,
    loading: loadingGWASSnps,
    error: errorGWASSnps,
  } = useGWASSnpsData({ studyid: [entity.entityID] });

  const r2SortComparator = (v1: string | number, v2: string | number) => {
    const parse = (v: string | number) => {
      if (v === "*") return 1.1; // lead SNP
      const n = Number(v);
      return isNaN(n) ? 0 : n; // fallback for safety
    };

    return parse(v1) - parse(v2);
  };

  const columns: GridColDef<(typeof dataGWASSnps)[number]>[] = [
    {
      field: "snpid",
      headerName: "rsID",
      renderCell: (params) => (
        <LinkComponent href={`/GRCh38/variant/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
      sortComparator: (a: string, b: string) => {
        const numA = parseInt(a.replace("chr", ""));
        const numB = parseInt(b.replace("chr", ""));
        return numA - numB;
      },
    },
    {
      field: "start",
      headerName: "Start",
      align: "left",
      headerAlign: "left",
      type: "number",
      valueFormatter: (value: number) => value?.toLocaleString(),
    },
    {
      field: "ldblocksnpid",
      headerName: "LD Block SNP ID",
      renderCell: (params) => {
        const rsID: string = params.value;
        return rsID === "Lead" ? (
          "Lead"
        ) : (
          <LinkComponent href={`/GRCh38/variant/${rsID}`} key={rsID}>
            {rsID}
          </LinkComponent>
        );
      },
    },
    {
      field: "rsquare",
      align: "left",
      headerAlign: "left",
      type: "number",
      renderHeader: () => (
        <p>
          <i>
            R<sup>2&nbsp;</sup>
          </i>
        </p>
      ),
      sortComparator: r2SortComparator,
    },
    {
      field: "ldblock",
      align: "left",
      headerAlign: "left",
      type: "number",
      headerName: "LD Block",
    },
  ];

  return (
    <Table
      showToolbar
      rows={dataGWASSnps || []}
      columns={columns}
      loading={loadingGWASSnps}
      error={!!errorGWASSnps}
      label={`SNPs identified by this GWAS study`}
      emptyTableFallback={"No SNPs identified by this GWAS study"}
      initialState={{
        sorting: {
          sortModel: [
            { field: "rsquare", sort: "desc" },
            { field: "ldblock", sort: "asc" },
          ],
        },
      }}
      divHeight={{ height: "600px" }}
    />
  );
}
