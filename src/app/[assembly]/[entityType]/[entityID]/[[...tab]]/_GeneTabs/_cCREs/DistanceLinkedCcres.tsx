import { Box, Skeleton, Tooltip } from "@mui/material";
import useNearbycCREs from "common/hooks/useNearBycCREs";
import { useCcreData } from "common/hooks/useCcreData";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table, TableProps } from "@weng-lab/ui-components";
import { GridColDef } from "@mui/x-data-grid-pro";

export default function DistanceLinkedCcres({
  geneData  
}: {
  geneData: UseGeneDataReturn<{ name: string }>;  
}) {
  const { data: dataNearby, loading: loadingNearby, error: errorNearby } = useNearbycCREs(geneData?.data.id);

  const {
    data: dataCcreDetails,
    loading: loadingCcreDetails,
    error: errorCcreDetails,
  } = useCcreData({ accession: dataNearby?.map((d) => d.ccre), assembly: "GRCh38"});

  const nearbyccres = dataNearby
    ?.map((d) => {
      let f = dataCcreDetails?.find((c) => c.info.accession === d.ccre);
      return {
        ...d,
        chromosome: f?.chrom,
        start: f?.start,
        end: f?.start + f?.len,
        group: f?.pct,
        distance: Math.abs(f?.start - geneData?.data.coordinates.start) || 0,
      };
    })

  const cols: GridColDef<(typeof nearbyccres)[number]>[] = [
    {
      field: "ccre",
      headerName: "Accession",
      renderCell: (params) => {
        return (
          <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
            {params.value}
          </LinkComponent>
        );
      },
    },
    {
      field: "group",
      headerName: "Class",
      renderCell: (params) => (
        <Tooltip
          title={
            <div>
              See{" "}
              <LinkComponent
                openInNewTab
                color="inherit"
                showExternalIcon
                href="https://screen.wenglab.org/about#classifications"
              >
                SCREEN
              </LinkComponent>{" "}
              for Class definitions
            </div>
          }
        >
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
    },
    {
      field: "start",
      headerName: "Start",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "end",
      headerName: "End",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
    {
      field: "distance",
      headerName: "Distance",
      type: "number",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return value.toLocaleString();
      },
    },
  ];

  return (
    <Box width={"100%"}>
      {geneData.loading || loadingNearby || loadingCcreDetails ? (
        <Skeleton variant="rounded" width={"100%"} height={300} />
      ) : (
        <Table
          rows={nearbyccres}
          columns={cols}
          label={"Nearby cCREs"}
          initialState={{
            sorting: {
              sortModel: [{ field: "distance", sort: "asc" }],
            },
          }}
          emptyTableFallback={"No Nearby cCREs found"}
          divHeight={{height: "300px"}}
        />
      )}
    </Box>
  );
}