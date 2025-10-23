"use client";
import { Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { useSnpData } from "common/hooks/useSnpData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, GridColDef } from "@weng-lab/ui-components";

const IntersectingSNPs = ({ region }: { region: GenomicRange }) => {
  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({
    coordinates: { chromosome: region.chromosome, start: region.start, end: region.end },
    assembly: "GRCh38",
  });

  const columns: GridColDef<(typeof dataSnps)[number]>[] = [
    {
      field: "id",
      headerName: "rsID",
      renderCell: (params) => <LinkComponent href={`/GRCh38/variant/${params.value}`}>{params.value}</LinkComponent>,
    },
    {
      field: "coordinates.chromosome",
      headerName: "Chromosome",
      valueGetter: (_, row) => row.coordinates.chromosome,
    },
    {
      field: "coordinates.start",
      headerName: "Start",
      valueGetter: (_, row) => row.coordinates.start.toLocaleString(),
    },
    {
      field: "end",
      headerName: "End",
      valueGetter: (_, row) => row.coordinates.end.toLocaleString(),
    },
  ];

  return errorSnps ? (
    <Typography>Error Fetching SNPs</Typography>
  ) : (
    <Table
      showToolbar
      rows={dataSnps || []}
      columns={columns}
      loading={loadingSnps}
      label={`Intersecting SNPs`}
      emptyTableFallback={"No intersecting SNPs found in this region"}
      divHeight={{ maxHeight: "400px" }}
    />
  );
};

export default IntersectingSNPs;
