"use client";
import { useGeneData } from "common/hooks/useGeneData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { parseGenomicRangeString } from "common/utility";

const IntersectionGenes = ({ entity }: EntityViewComponentProps) => {
  const {
    data: dataGenes,
    loading: loadingGenes,
    error: errorGenes,
  } = useGeneData({ coordinates: parseGenomicRangeString(entity.entityID), assembly: entity.assembly });

  const columns: GridColDef<(typeof dataGenes)[number]>[] = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (params) => (
        <LinkComponent href={`/${entity.assembly}/gene/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "strand",
      headerName: "Strand",
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
      showToolbar
      rows={dataGenes}
      columns={columns}
      loading={loadingGenes}
      error={!!errorGenes}
      label={`Intersecting Genes`}
      emptyTableFallback={"No intersecting Genes found in this region"}
      initialState={{ sorting: { sortModel: [{ field: "coordinates.start", sort: "asc" }] } }}
      divHeight={{ maxHeight: "600px" }}
    />
  );
};

export default IntersectionGenes;
