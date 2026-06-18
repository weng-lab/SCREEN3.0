"use client";
import { useSnpData } from "common/hooks/data/variant";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/data/entity";
import { CSSProperties, useMemo } from "react";
import { decodeRegions } from "common/utils";

const IntersectingSNPs = ({ entity, divHeight }: EntityViewComponentProps & { divHeight?: CSSProperties }) => {
  //fetch coordinates since this is used by cCRE entity for overlapping variants
  const { data: dataCoords, loading: loadingCoords, error: errorCoords } = useEntityMetadata(entity);

  const coordinates = useMemo(() => {
    if (!dataCoords || dataCoords.__typename === "GwasStudiesMetadata") return null;
    if (dataCoords.__typename === "Bed") {
      if (typeof window === "undefined") return null;
      const encoded = sessionStorage.getItem(entity.entityID);
      return decodeRegions(encoded);
    } else return dataCoords.coordinates;
  }, [dataCoords, entity.entityID]);

  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({
    coordinates,
    assembly: "GRCh38",
    skip: !coordinates,
  });

  const columns: TableColDef<(typeof dataSnps)[number]>[] = [
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
      type: "number",
      valueGetter: (_, row) => row.coordinates.start,
    },
    {
      field: "coordinates.end",
      headerName: "End",
      type: "number",
      valueGetter: (_, row) => row.coordinates.end,
    },
  ];

  return (
    <Table
      rows={dataSnps}
      columns={columns}
      loading={loadingCoords || loadingSnps}
      error={!!errorCoords || !!errorSnps}
      label={`Intersecting SNPs`}
      emptyTableFallback={"No intersecting SNPs found in this region"}
      initialState={{ sorting: { sortModel: [{ field: "coordinates.start", sort: "asc" }] } }}
      divHeight={{ height: "600px", ...divHeight }}
    />
  );
};

export default IntersectingSNPs;
