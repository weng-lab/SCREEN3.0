'use client'
import { Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Assembly, GenomicRange } from "types/globalTypes";
import { useGeneData } from "common/hooks/useGeneData";
import { LinkComponent } from "common/components/LinkComponent";
import { Table } from  "@weng-lab/ui-components";
const IntersectionGenes = ({ region, assembly }: { region: GenomicRange, assembly: string }) => {
  const { data: dataGenes, loading: loadingGenes, error: errorGenes } = useGeneData({ coordinates: region, assembly: assembly as Assembly });

  const columns: GridColDef<(typeof dataGenes)[number]>[] = [
      {
        field: "name",
        renderHeader: () => <strong><p>Symbol</p></strong>,
        renderCell: (params) => (
          <LinkComponent href={`/${assembly}/gene/${params.value}`}>
            <i>{params.value}</i>
          </LinkComponent>
        ),     
      }, 
      {
        field: "id",
        renderHeader: () => <strong><p>ID</p></strong>,
      },
      {
        field: "strand",
        renderHeader: () => <strong><p>Strand</p></strong>,
      },
      {
        field: "coordinates.chromosome",
        renderHeader: () => <strong><p>Chromosome</p></strong>,
        valueGetter: (_, row) => row.coordinates.chromosome        
      },
      {
        field: "coordinates.start",
        renderHeader: () => <strong><p>Start</p></strong>,
        valueGetter: (_, row) => row.coordinates.start        
      },
      {
        field: "coordinates.end",
        renderHeader: () => <strong><p>End</p></strong>,
        valueGetter: (_, row) => row.coordinates.end        
      }]

 

  return errorGenes ? (
    <Typography>Error Fetching Genes</Typography>
  ) : (
    <Table
    showToolbar
    rows={dataGenes || []}
    columns={columns}
    loading={loadingGenes}     
    label={`Intersecting Genes`}      
    emptyTableFallback={"No intersecting Genes found in this region"}
  />
  );
};

export default IntersectionGenes