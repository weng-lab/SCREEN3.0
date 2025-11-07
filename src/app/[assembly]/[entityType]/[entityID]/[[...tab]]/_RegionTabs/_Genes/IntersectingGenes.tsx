"use client";
import { Typography } from "@mui/material";
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
      renderHeader: () => (
        <strong>
          <p>Symbol</p>
        </strong>
      ),
      renderCell: (params) => (
        <LinkComponent href={`/${entity.assembly}/gene/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "id",
      renderHeader: () => (
        <strong>
          <p>ID</p>
        </strong>
      ),
    },
    {
      field: "strand",
      renderHeader: () => (
        <strong>
          <p>Strand</p>
        </strong>
      ),
    },
    {
      field: "coordinates.chromosome",
      renderHeader: () => (
        <strong>
          <p>Chromosome</p>
        </strong>
      ),
      valueGetter: (_, row) => row.coordinates.chromosome,
    },
    {
      field: "coordinates.start",
      renderHeader: () => (
        <strong>
          <p>Start</p>
        </strong>
      ),
      valueGetter: (_, row) => row.coordinates.start,
    },
    {
      field: "coordinates.end",
      renderHeader: () => (
        <strong>
          <p>End</p>
        </strong>
      ),
      valueGetter: (_, row) => row.coordinates.end,
    },
  ];

  return errorGenes ? (
    <Typography>Error Fetching Genes</Typography>
  ) : (
    <Table
      showToolbar
      rows={dataGenes}
      columns={columns}
      loading={loadingGenes}
      error={!!errorGenes}
      label={`Intersecting Genes`}
      emptyTableFallback={"No intersecting Genes found in this region"}
      divHeight={{ maxHeight: "600px" }}
    />
  );
};

export default IntersectionGenes;
