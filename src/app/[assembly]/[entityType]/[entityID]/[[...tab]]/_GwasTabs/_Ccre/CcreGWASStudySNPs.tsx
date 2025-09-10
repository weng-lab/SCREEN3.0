


import { useGWASSnpsIntersectingcCREsData } from "common/hooks/useGWASSnpsIntersectingcCREsData";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Table } from "@weng-lab/ui-components";
import { Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";

export type CcreGWASStudySNPsProps = {
  study_name: string;  
  totalldblocks: number;
};


const CcreGWASStudySNPs = ({ study_name, totalldblocks }: CcreGWASStudySNPsProps) => {

    const { data: dataGWASSNPscCREs, loading: loadingGWASSNPscCREs, error: errorGWASSNPscCREs } = useGWASSnpsIntersectingcCREsData({study: [study_name]})
    const ldblocks_columns: GridColDef<({total_ldblocks: number, ldblocks_overlapping_ccres: number, overlapping_ccres: number}[])[number]>[] = [
      {
        field: "total_ldblocks",
        renderHeader: () => <strong><p>Total LD blocks</p></strong>,
        valueGetter: (_, row) => {
                return row.total_ldblocks;
              },
      },{

        field: "ldblocks_overlapping_ccres",      
        renderHeader: () => <strong><p># of LD blocks overlapping cCREs</p></strong>,
        valueGetter: (_, row) => row.ldblocks_overlapping_ccres + " (" + Math.ceil((row.ldblocks_overlapping_ccres / +row.total_ldblocks) * 100) + "%)",
      },
      {

        field: "overlapping_ccres",      
        renderHeader: () => <strong><p># of overlapping cCREs</p></strong>,
        valueGetter: (_, row) => row.overlapping_ccres,
      },
    ]
    const columns: GridColDef<(typeof dataGWASSNPscCREs)[number]>[] = [
       
        {
          field: "accession",
          renderHeader: () => <strong><p>Accession</p></strong>,
          valueGetter: (_, row) => {
                  return row.accession;
                },
          renderCell: (params) => (
                  <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
                    <i>{params.value}</i>
                  </LinkComponent>
          ), 

        },{

          field: "snpid",      
          renderHeader: () => <strong><p>SNP</p></strong>,
          valueGetter: (_, row) => row.snpid,
        },
        
        {
            field: "ldblocksnpid",
            renderHeader: () => <strong><p>LD Block SNP ID</p></strong>,
            valueGetter: (_, row) => row.ldblocksnpid
  
          },
           
        {
            field: "rsquare",
            renderHeader: () => <strong><p><i>R</i><sup>2</sup></p></strong>,
            valueGetter: (_, row) => row.rsquare
  
          }
       
       
      ];
      const  ldblocks_data = [{total_ldblocks: totalldblocks, ldblocks_overlapping_ccres: dataGWASSNPscCREs ? [... new Set([...dataGWASSNPscCREs.map(c => { return (+c.ldblock) })])].length : 0 , overlapping_ccres: dataGWASSNPscCREs ? [...new Set(dataGWASSNPscCREs.map(item => item.accession))].length : 0
      }]
      return errorGWASSNPscCREs ? (
        <Typography>Error Fetching Intersecting cCREs against SNPs identified by a GWAS study</Typography>
      ) : (
        <>
        <Table
          
          rows={ldblocks_data || []}
          columns={ldblocks_columns}
          loading={loadingGWASSNPscCREs}     
          label={`LD Blocks`}      
          emptyTableFallback={"No Intersecting cCREs found against SNPs identified by GWAS study"} 
          divHeight={{ height: "100%", minHeight: "50px", maxHeight: "600px" }}
        />
        <Table
          showToolbar
          rows={dataGWASSNPscCREs || []}
          columns={columns}
          loading={loadingGWASSNPscCREs}     
          label={`Intersecting cCREs`}      
          emptyTableFallback={"No Intersecting cCREs found against SNPs identified by GWAS study"}
          initialState={{
            sorting: {
              sortModel: [{ field: "rsquare", sort: "desc" }],
            },
          }}
          
          divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        />
        </>
      );
}
export default CcreGWASStudySNPs;