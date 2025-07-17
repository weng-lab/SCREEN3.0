'use client'
import { Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { useGeneData } from "common/hooks/useGeneData";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { LinkComponent } from "common/components/LinkComponent";

const IntersectionGenes = ({ region }: { region: GenomicRange }) => {
  const { data: dataSnps, loading: loadingSnps, error: errorSnps } = useGeneData({ coordinates: region });

  const columns: CustomDataGridColDef<(typeof dataSnps)[number]>[] = [
    {
      field: "name",
      headerName: "Symbol",
      renderCell: (params) => (
        <LinkComponent href={`/gene/${params.value}`}>
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
      field: "coordinates",
      headerName: "Coordinates",
      valueGetter: (_, row) =>
        `${
          row.coordinates.chromosome
        }:${row.coordinates.start.toLocaleString()}-${row.coordinates.end.toLocaleString()}`,
    },
  ];

  return errorSnps ? (
    <Typography>Error Fetching Genes</Typography>
  ) : (
    <CustomDataGrid
      rows={dataSnps || []}
      columns={columns}
      loading={loadingSnps}
      initialState={{
        sorting: {
          sortModel: [{ field: "coordinates", sort: "asc" }],
        },
      }}
      tableTitle="Intersecting Genes"
      pageSizeOptions={[10, 25, 50, 100]}
      emptyTableFallback={"No intersecting genes found in this region"}
    />
  );
};

export default IntersectionGenes