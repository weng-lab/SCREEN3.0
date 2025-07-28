'use client'
import { Typography } from "@mui/material";
import { Assembly, GenomicRange } from "types/globalTypes";
import { GridColDef } from "@mui/x-data-grid-pro";
import { useCcreData } from "common/hooks/useCcreData";
import { Table } from  "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
const IntersectingCcres = ({ region, assembly }: { region: GenomicRange, assembly: string }) => {
  
  const { data: dataCcres, loading: loadingCcres, error: errorCcres } = useCcreData({coordinates: region, assembly: assembly as Assembly, nearbygeneslimit: 1});

  const columns: GridColDef<(typeof dataCcres)[number]>[] = [
    {
      field: "info.accession",
      renderHeader: () => <strong><p>Accession</p></strong>,
      valueGetter: (_, row) => row.info.accession,
      renderCell: (params) => (
                <LinkComponent href={`/${assembly}/ccre/${params.value}`}>
                  <i>{params.value}</i>
                </LinkComponent>
              ),          
    },
    {
      field: "pct",      
      renderHeader: () => <strong><p>Class</p></strong>,
      valueGetter: (_, row) => row.pct === "PLS" ? "Promoter" : row.pct === "pELS" ? "Proximal Enhancer" : row.pct === "dELS" ? "Distal Enhancer" : row.pct,        
    },    
    {
      field: "chrom",
      renderHeader: () => <strong><p>Chromosome</p></strong>,
    },
    {
      field: "start",
      renderHeader: () => <strong><p>Start</p></strong>,
      valueGetter: (_, row) => row.start.toLocaleString(),
    },
    {
      field: "end",
      renderHeader: () => <strong><p>End</p></strong>,
      valueGetter: (_, row) => (row.start + row.len).toLocaleString(),
      sortComparator: (v1, v2) => v1 - v2, 
    },
    {
      field: "dnase_zscore",            
      renderHeader: () => <strong><p>DNase</p></strong>,
      valueGetter: (_, row) => row.dnase_zscore.toFixed(2),
    },
    {
      field: "atac_zscore",      
      renderHeader: () => <strong><p>ATAC</p></strong>,
      valueGetter: (_, row) => row.atac_zscore.toFixed(2),
    },
    {
      field: "ctcf_zscore",      
      renderHeader: () => <strong><p>CTCF</p></strong>,
      valueGetter: (_, row) => row.ctcf_zscore.toFixed(2),
    },
    {
      field: "enhancer_zscore",      
      renderHeader: () => <strong><p>H3K27ac</p></strong>,
      valueGetter: (_, row) => row.enhancer_zscore.toFixed(2),
    },
    {
      field: "promoter_zscore",      
      renderHeader: () => <strong><p>H3K4me3</p></strong>,
      valueGetter: (_, row) => row.promoter_zscore.toFixed(2),
    },
    {
      field: "nearestgene",
      renderHeader: () => <strong><p>Nearest&nbsp;Gene</p></strong>,
      valueGetter: (_, row) => `${row.nearestgenes[0].gene} - ${row.nearestgenes[0].distance} bp`,      
      
    }
   
  ];

  return errorCcres ? (
    <Typography>Error Fetching Ccres</Typography>
  ) : (
    <Table
      showToolbar
      rows={dataCcres || []}
      columns={columns}
      loading={loadingCcres}     
      label={`Intersecting cCREs`}      
      emptyTableFallback={"No intersecting cCREs found in this region"}
    />
  );
};

export default IntersectingCcres;