'use client'
import { Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import { useSnpData } from "common/hooks/useSnpData";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";
import { LinkComponent } from "./LinkComponent";

const IntersectingSNPs = ({ region }: { region: GenomicRange }) => {
  const {
    data: dataSnps,
    loading: loadingSnps,
    error: errorSnps,
  } = useSnpData({ coordinates: { chromosome: region.chromosome, start: region.start, end: region.end },  assembly: "GRCh38"  });

  type RowObj = (typeof dataSnps)[number];

  const columns: CustomDataGridColDef<RowObj>[] = [
    {
      field: "id",
      headerName: "rsID",
      renderCell: (params) => (
        <LinkComponent href={`/GRCh38/variant/${params.value}`}>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "coordinates",
      headerName: "Coordinates",
      valueGetter: (_, row: RowObj) =>
        `${
          row.coordinates.chromosome
        }:${row.coordinates.start.toLocaleString()}-${row.coordinates.end.toLocaleString()}`,
    },
  ];

  return errorSnps ? (
    <Typography>Error Fetching SNPs</Typography>
  ) : (
    <CustomDataGrid
      rows={dataSnps}
      columns={columns}
      loading={loadingSnps}
      initialState={{
        sorting: {
          sortModel: [{ field: "coordinates", sort: "asc" }],
        },
      }}
      tableTitle="Intersecting Variants"
      pageSizeOptions={[10, 25, 50, 100]}
      emptyTableFallback={"No intersecting variants found in this region"}
    />
  );
};

export default IntersectingSNPs