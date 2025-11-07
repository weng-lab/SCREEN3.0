"use client";
import { useSnpData } from "common/hooks/useSnpData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { useMemo } from "react";

const IntersectingSNPs = ({ entity }: EntityViewComponentProps) => {
  const { data: dataCoords, loading: loadingCoords, error: errorCoords } = useEntityMetadata(entity);

  const coordinates = useMemo(() => {
    if (!dataCoords || dataCoords.__typename === "GwasStudiesMetadata") return null;
    if (dataCoords.__typename === "SCREENSearchResult") {
      return { chromosome: dataCoords.chrom, start: dataCoords.start, end: dataCoords.start + dataCoords.len };
    } else return dataCoords.coordinates;
  }, [dataCoords]);

  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({
    coordinates,
    assembly: "GRCh38",
    skip: !coordinates,
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
      loading={loadingCoords || loadingSnps}
      error={!!errorCoords || !!errorSnps}
      label={`Intersecting SNPs`}
      emptyTableFallback={"No intersecting SNPs found in this region"}
      initialState={{ sorting: { sortModel: [{ field: "coordinates.start", sort: "asc" }] } }}
      divHeight={{ maxHeight: "400px" }}
    />
  );
};

export default IntersectingSNPs;
