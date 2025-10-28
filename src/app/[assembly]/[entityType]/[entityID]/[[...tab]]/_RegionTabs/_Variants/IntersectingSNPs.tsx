"use client";
import { Typography } from "@mui/material";
import { useSnpData } from "common/hooks/useSnpData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { parseGenomicRangeString } from "common/utility";

const IntersectingSNPs = ({ entity }: EntityViewComponentProps) => {
  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({
    coordinates: parseGenomicRangeString(entity.entityID),
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
      rows={dataSnps}
      columns={columns}
      loading={loadingSnps}
      error={!!errorSnps}
      label={`Intersecting SNPs`}
      emptyTableFallback={"No intersecting SNPs found in this region"}
      divHeight={{ maxHeight: "400px" }}
    />
  );
};

export default IntersectingSNPs;
