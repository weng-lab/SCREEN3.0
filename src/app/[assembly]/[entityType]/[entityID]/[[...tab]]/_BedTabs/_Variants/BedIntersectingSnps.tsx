"use client";
import { useSnpData } from "common/hooks/useSnpData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useMemo } from "react";
import { decodeRegions } from "common/utility";
import { GenomicRange } from "common/types/globalTypes";

const BedIntersectingSNPs = ({ entity }: EntityViewComponentProps) => {
  const regions: GenomicRange[] = useMemo(() => {
    if (typeof window === "undefined") return null;
    const encoded = sessionStorage.getItem(entity.entityID);
    return decodeRegions(encoded);
  }, [entity.entityID]);

  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({
    coordinates: regions ?? [],
    assembly: "GRCh38",
    skip: regions === null,
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
      field: "coordinates.end",
      headerName: "End",
      valueGetter: (_, row) => row.coordinates.end.toLocaleString(),
    },
  ];

  return (
    <Table
      showToolbar
      rows={dataSnps}
      columns={columns}
      loading={loadingSnps}
      error={!!errorSnps}
      label={`Intersecting SNPs`}
      emptyTableFallback={"No intersecting SNPs found in this region"}
      initialState={{ sorting: { sortModel: [{ field: "coordinates.start", sort: "asc" }] } }}
      divHeight={{ maxHeight: "600px" }}
    />
  );
};

export default BedIntersectingSNPs;
