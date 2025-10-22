import { useQuery } from "@apollo/client";
import { GridColDef, Table } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { EntityViewComponentProps } from "common/EntityDetails/entityTabsConfig";
import { useGeneData } from "common/hooks/useGeneData";
import { formatGenomicRange } from "common/utility";
import { useMemo } from "react";
import { gql } from "types/generated";
import { Assembly } from "types/globalTypes";

export const GET_ORTHOLOG = gql(`
  query geneOrtholog($name: [String]!, $assembly: String!) {
    geneOrthologQuery: geneorthologQuery(name: $name, assembly: $assembly) {
      humanGene: external_gene_name
      mouseGene: mmusculus_homolog_associated_gene_name
    }
  }
`);

const orthologTableCols: GridColDef[] = [
  {
    headerName: "Gene",
    field: "name",
    renderCell: (params) => <LinkComponent href={`/${params.row.assembly}/gene/${params.row.name}`}><i>{params.value}</i></LinkComponent>
  },
  {
    headerName: "Coordinates",
    field: "coordinates",
    valueGetter: (value, row) => formatGenomicRange(row.coordinates)
  }
];

const GeneConservation = ({ entity }: EntityViewComponentProps) => {
  const { data: dataOrtholog, loading: loadingOrtholog, error: errorOrtholog } = useQuery(GET_ORTHOLOG, {
    variables: {
      name: [entity.entityID],
      assembly: entity.assembly.toLowerCase(),
    },
  });

  const orthologName = useMemo(
    () =>
      dataOrtholog?.geneOrthologQuery.length
        ? dataOrtholog?.geneOrthologQuery[0][entity.assembly == "GRCh38" ? "mouseGene" : "humanGene"]
        : null,
    [dataOrtholog?.geneOrthologQuery, entity.assembly]
  );

  const orthologAssembly: Assembly = entity.assembly === "GRCh38" ? "mm10" : "GRCh38"

  const {data: dataCoords, loading: loadingCoords, error: errorCoords} = useGeneData({name: orthologName, assembly: orthologAssembly, skip: !orthologName})

  const rows = useMemo(() => {
    if (!dataOrtholog || !dataCoords) return undefined;
    if (dataOrtholog.geneOrthologQuery.length) {
      return [
        {
          name: orthologName,
          coordinates: dataCoords.coordinates,
          assembly: orthologAssembly
        },
      ];
    } else return [];
  }, [dataOrtholog, dataCoords, orthologName, orthologAssembly]);

  const loading = loadingOrtholog || loadingCoords
  const error = !!(errorOrtholog || errorCoords)

  return (
    <Table
      rows={rows}
      columns={orthologTableCols}
      label={`${entity.entityID} ${entity.assembly === "GRCh38" ? "Mouse (mm10)" : "Human (GRCh38)"} Ortholog`}
      emptyTableFallback={`No ${entity.assembly === "GRCh38" ? "Mouse (mm10)" : "Human (GRCh38)"} ortholog found for ${
        entity.entityID
      }`}
      loading={loading}
      error={error}
    />
  );
};

export default GeneConservation;
