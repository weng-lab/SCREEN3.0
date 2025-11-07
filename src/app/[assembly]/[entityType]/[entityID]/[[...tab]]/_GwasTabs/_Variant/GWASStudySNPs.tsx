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
      renderCell: (params) => <LinkComponent href={`/GRCh38/variant/${params.value}`}>{params.value}</LinkComponent>,
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
      headerName: "LD Block Lead SNP ID(s)",
      renderCell: (params) => {
        if (params.value === "Lead") return "Lead";
        const rsIDs = (params.value as string)?.split(",");
        const links = rsIDs?.map((rsID: string, index: number) => (
          <>
            <LinkComponent href={`/GRCh38/variant/${rsID}`} key={rsID}>
              {rsID}
            </LinkComponent>
            {index < rsIDs.length - 1 ? ", " : ""}
          </>
        ));
        return <span>{links}</span>;
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
