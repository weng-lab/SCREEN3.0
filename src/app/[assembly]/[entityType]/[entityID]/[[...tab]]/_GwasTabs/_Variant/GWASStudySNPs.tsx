"use client";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Table } from "@weng-lab/ui-components";
import { Tooltip, Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { useGWASSnpsData } from "common/hooks/useGWASSnpsData";
import InfoIcon from "@mui/icons-material/Info";
import { EntityViewComponentProps } from "common/entityTabsConfig";

export const GWASStudySNPs = ({ entity }: EntityViewComponentProps) => {
  const {
    data: dataGWASSnps,
    loading: loadingGWASSnps,
    error: errorGWASSnps,
  } = useGWASSnpsData({ studyid: [entity.entityID] });

  const columns: GridColDef<(typeof dataGWASSnps)[number]>[] = [
    {
      field: "snpid",
      renderHeader: () => (
        <strong>
          <p>SNP</p>
        </strong>
      ),
      valueGetter: (_, row) => {
        return row.snpid;
      },
      renderCell: (params) => (
        <LinkComponent href={`/GRCh38/variant/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "chromosome",
      renderHeader: () => (
        <strong>
          <p>Chromosome</p>
        </strong>
      ),
      valueGetter: (_, row) => row.chromosome,
    },
    {
      field: "start",
      renderHeader: () => (
        <strong>
          <p>Start</p>
        </strong>
      ),
      valueGetter: (_, row) => row.start,
    },
    {
      field: "ldblocksnpid",
      renderHeader: () => (
        <strong>
          <p>LD Block SNP ID</p>
        </strong>
      ),
      valueGetter: (_, row) => row.ldblocksnpid,
    },

    {
      field: "rsquare",
      renderHeader: () => (
        <strong>
          <p>
            <i>R</i>
            <sup>2</sup>
          </p>
        </strong>
      ),
      valueGetter: (_, row) => row.rsquare,
    },
    {
      field: "ldblock",
      renderHeader: () => (
        <strong>
          <p>LD Block</p>
        </strong>
      ),
      valueGetter: (_, row) => row.ldblock,
    },
  ];

  return errorGWASSnps ? (
    <Typography>Error Fetching Intersecting cCREs against SNPs identified by a GWAS study</Typography>
  ) : (
    <>
      <Table
        showToolbar
        rows={dataGWASSnps || []}
        columns={columns}
        loading={loadingGWASSnps}
        label={`SNPs identified by this GWAS study`}
        emptyTableFallback={"No SNPs identified by this GWAS study"}
        initialState={{
          sorting: {
            sortModel: [{ field: "rsquare", sort: "desc" }],
          },
        }}
        divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        labelTooltip={
          <Tooltip title={"SNPs identified by selected GWAS study"}>
            <InfoIcon fontSize="inherit" />
          </Tooltip>
        }
      />
    </>
  );
};
