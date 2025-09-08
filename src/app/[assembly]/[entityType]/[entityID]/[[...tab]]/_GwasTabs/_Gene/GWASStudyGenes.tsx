import { useGWASSnpscCREsGenesData } from "common/hooks/useGWASSnpscCREsGenesData";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Table } from "@weng-lab/ui-components";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { toScientificNotationElement } from "common/utility";
import { useState } from "react";
import SelectCompuGenesMethod from "common/components/SelectCompuGenesMethod";

export type GWASStudyGenesProps = {
    study_name: string;  
    
  };

  function formatCoord(str) {
    const [chrom, start, end] = str.split("_");
    return `${chrom}:${start}-${end}`;
  }  
export const GWASStudyGenes = ({ study_name }: GWASStudyGenesProps) => {
    const [method, setMethod] = useState<string>('ABC_(DNase_only)');
    const { compudata: dataGWASSnpscCREsCompuGenes  , data: dataGWASSnpscCREsGenes, loading: loadingGWASSnpscCREsGenes, error: errorGWASSnpscCREsGenes } = useGWASSnpscCREsGenesData({study: [study_name], method})
     //Not really sure how this works, but only way to anchor the popper since the extra toolbarSlot either gets unrendered or unmouted after
  //setting the anchorEl to the button
  const [virtualAnchor, setVirtualAnchor] = useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);

    //console.log("errorGWASSnpscCREsGenes",errorGWASSnpscCREsGenes)
    const handleClickClose = () => {
      if (virtualAnchor) {
        setVirtualAnchor(null);
      }
    };

    const handleMethodSelected = (method: string) => {
        setMethod(method);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (virtualAnchor) {
        // If already open, close it
        setVirtualAnchor(null);
      } else {
        // Open it, store the current position
        const rect = event.currentTarget.getBoundingClientRect();
        setVirtualAnchor({
          getBoundingClientRect: () => rect,
        });
      }
    };
  
    const HiCLinked = dataGWASSnpscCREsGenes && dataGWASSnpscCREsGenes.filter((x) => x.assay === "Intact-HiC");
    //console.log("HiCLinked",HiCLinked)
    const ChIAPETLinked = dataGWASSnpscCREsGenes && dataGWASSnpscCREsGenes.filter(
        (x) => x.assay === "RNAPII-ChIAPET" || x.assay === "CTCF-ChIAPET"
    );
    const crisprLinked = dataGWASSnpscCREsGenes && dataGWASSnpscCREsGenes.filter((x) => x.method === "CRISPR");
    const eqtlLinked = dataGWASSnpscCREsGenes && dataGWASSnpscCREsGenes.filter((x) => x.method === "eQTLs");    
    const CompuLinkedGenes_columns: GridColDef<(typeof dataGWASSnpscCREsCompuGenes)[number]>[] = [  
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
      },
      {
        field: "fileaccession",
        renderHeader: () => <strong><p>File Accession</p></strong>,
        valueGetter: (_, row) => {
                return row.fileaccession;
              },
        renderCell: (params) => (
          <LinkComponent
          href={`https://www.encodeproject.org/file/${params.value}`}
          openInNewTab
          showExternalIcon
        >
          {params.value}
        </LinkComponent>
        ), 
      },{

        field: "genename",      
        renderHeader: () => <strong><p>Common Gene Name</p></strong>,
        valueGetter: (_, row) => row.genename,
        renderCell: (params) => (
          <LinkComponent href={`/GRCh38/gene/${params.value}`}>
            <i>{params.value}</i>
          </LinkComponent>
          ), 
      },{

        field: "method",      
        renderHeader: () => <strong><p>Method</p></strong>,
        valueGetter: (_, row) => row.method.replaceAll("_"," "),
      
      },
      {

        field: "methodregion",      
        renderHeader: () => <strong><p>Method Region</p></strong>,
        valueGetter: (_, row) => formatCoord(row.methodregion)//.replaceAll("_"," "),
      
      },
      {

        field: "celltype",      
        renderHeader: () => <strong><p>Biosample</p></strong>,
        valueGetter: (_, row) => row.celltype.replaceAll("_"," "),
      
      },
      {
        field: "score",
        renderHeader: () => <strong><p>Score</p></strong>,
        valueGetter: (_, row) => row.score.toFixed(2)

    },
         ]
    const HiC_columns: GridColDef<(typeof HiCLinked)[number]>[] = [       
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

          field: "gene",      
          renderHeader: () => <strong><p>Common Gene Name</p></strong>,
          valueGetter: (_, row) => row.gene,
          renderCell: (params) => (
            <LinkComponent href={`/GRCh38/gene/${params.value}`}>
              <i>{params.value}</i>
            </LinkComponent>
            ), 
        },        
        {
            field: "genetype",
            renderHeader: () => <strong><p>Gene Type</p></strong>,            
            valueGetter: (_, row) => {
                return  row.genetype === "lncRNA"
                ? row.genetype
                : row.genetype
                    .replaceAll("_", " ")
                    .split(" ")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")
              },  
        },           
        {
            field: "assay",
            renderHeader: () => <strong><p>Assay Type</p></strong>,
            valueGetter: (_, row) => row.assay
  
        },
        {
            field: "experiment_accession",
            renderHeader: () => <strong><p>Experiment ID</p></strong>,
            valueGetter: (_, row) => row.experiment_accession,
            renderCell: (params) => (
                <LinkComponent
                  href={`https://www.encodeproject.org/experiments/${params.value}`}
                  openInNewTab
                  showExternalIcon
                >
                  {params.value}
                </LinkComponent>
            ),
  
        },
        {
            field: "displayname",
            renderHeader: () => <strong><p>Biosample</p></strong>,
            valueGetter: (_, row) => row.displayname
  
        },
        {
            field: "score",
            renderHeader: () => <strong><p>Score</p></strong>,
            valueGetter: (_, row) => row.score
  
        },
        {
            field: "p_val",
            renderHeader: () => <strong><p><i>P</i></p></strong>,
            valueGetter: (_, row) => row.p_val ,
            renderCell: (params) => (
                <>
                {params.value === 0
                    ? "0"
                    : toScientificNotationElement(params.value, 2, {
                        variant: "body2",
                      })}
                </>
            ), 
        },

       
       
      ];
    const eqtl_columns: GridColDef<(typeof eqtlLinked)[number]>[] = [       
        {
          field: "accession",
          renderHeader: () => <strong><p>Accession</p></strong>,
          valueGetter: (_, row) => row.accession,
          renderCell: (params) => (
                  <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
                    <i>{params.value}</i>
                  </LinkComponent>
          ), 
        },
        {

          field: "gene",      
          renderHeader: () => <strong><p>Common Gene Name</p></strong>,
          valueGetter: (_, row) => row.gene,
          renderCell: (params) => (
            <LinkComponent href={`/GRCh38/gene/${params.value}`}>
              <i>{params.value}</i>
            </LinkComponent>
            ), 
        },        
        {
            field: "genetype",
            renderHeader: () => <strong><p>Gene Type</p></strong>,            
            valueGetter: (_, row) => {
                return  row.genetype === "lncRNA"
                ? row.genetype
                : row.genetype
                    .replaceAll("_", " ")
                    .split(" ")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")
              },  
        },           
        {
            field: "variantid",
            renderHeader: () => <strong><p>Variant ID</p></strong>,
            valueGetter: (_, row) => row.variantid
  
        },
        {
            field: "source",
            renderHeader: () => <strong><p>Source</p></strong>,
            valueGetter: (_, row) => row.source
  
        },
        {
            field: "tissue",
            renderHeader: () => <strong><p>Tissue</p></strong>,
            valueGetter: (_, row) => row.tissue
  
        },
        {
            field: "slope",
            renderHeader: () => <strong><p>Slope</p></strong>,
            valueGetter: (_, row) => row.slope
  
        },
        {
            field: "p_val",
            renderHeader: () => <strong><p><i>P</i></p></strong>,
            valueGetter: (_, row) => row.p_val ,
            renderCell: (params) => (
                <>
                {params.value === 0
                    ? "0"
                    : toScientificNotationElement(params.value, 2, {
                        variant: "body2",
                      })}
                </>
            ), 
        },

       
       
      ];

      const CRISPR_columns: GridColDef<(typeof crisprLinked)[number]>[] = [       
        {
          field: "accession",
          renderHeader: () => <strong><p>Accession</p></strong>,
          valueGetter: (_, row) => row.accession,
          renderCell: (params) => (
                  <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
                    <i>{params.value}</i>
                  </LinkComponent>
          ),
        },{
          field: "gene",      
          renderHeader: () => <strong><p>Common Gene Name</p></strong>,
          valueGetter: (_, row) => row.gene,
          renderCell: (params) => (
            <LinkComponent href={`/GRCh38/gene/${params.value}`}>
              <i>{params.value}</i>
            </LinkComponent>
            ), 
        },        
        {
            field: "genetype",
            renderHeader: () => <strong><p>Gene Type</p></strong>,            
            valueGetter: (_, row) => {
                return  row.genetype === "lncRNA"
                ? row.genetype
                : row.genetype
                    .replaceAll("_", " ")
                    .split(" ")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")
              },  
        },           
        {
            field: "assay",
            renderHeader: () => <strong><p>Assay Type</p></strong>,
            valueGetter: (_, row) => row.assay
  
        },
        {
            field: "experiment_accession",
            renderHeader: () => <strong><p>Experiment ID</p></strong>,
            valueGetter: (_, row) => row.experiment_accession,
            renderCell: (params) => (
                <LinkComponent
                  href={`https://www.encodeproject.org/experiments/${params.value}`}
                  openInNewTab
                  showExternalIcon
                >
                  {params.value}
                </LinkComponent>
            ),
  
        },
        {
            field: "displayname",
            renderHeader: () => <strong><p>Biosample</p></strong>,
            valueGetter: (_, row) => row.displayname
  
        },
        {
            field: "effectsize",
            renderHeader: () => <strong><p>Effect Size</p></strong>,
            valueGetter: (_, row) => row.effectsize
  
        },
        {
            field: "p_val",
            renderHeader: () => <strong><p><i>P</i></p></strong>,
            valueGetter: (_, row) => row.p_val ,
            renderCell: (params) => (
                <>
                {params.value === 0
                    ? "0"
                    : toScientificNotationElement(params.value, 2, {
                        variant: "body2",
                      })}
                </>
            ), 
        },

       
       
      ];


      const ChIA_PET_columns: GridColDef<(typeof ChIAPETLinked)[number]>[] = [
       
        {
          field: "accession",
          renderHeader: () => <strong><p>Accession</p></strong>,
          valueGetter: (_, row) => row.accession,                
          renderCell: (params) => (
                  <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
                    <i>{params.value}</i>
                  </LinkComponent>
          ), 

        },{

          field: "gene",      
          renderHeader: () => <strong><p>Common Gene Name</p></strong>,
          valueGetter: (_, row) => row.gene,
          renderCell: (params) => (
            <LinkComponent href={`/GRCh38/gene/${params.value}`}>
              <i>{params.value}</i>
            </LinkComponent>
            ), 
        },        
        {
            field: "genetype",
            renderHeader: () => <strong><p>Gene Type</p></strong>,            
            valueGetter: (_, row) => {
                return  row.genetype === "lncRNA"
                ? row.genetype
                : row.genetype
                    .replaceAll("_", " ")
                    .split(" ")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")
              },  
        },           
        {
            field: "assay",
            renderHeader: () => <strong><p>Assay Type</p></strong>,
            valueGetter: (_, row) => row.assay  
        },
        {
            field: "experiment_accession",
            renderHeader: () => <strong><p>Experiment ID</p></strong>,
            valueGetter: (_, row) => row.experiment_accession,
            renderCell: (params) => (
                <LinkComponent
                  href={`https://www.encodeproject.org/experiments/${params.value}`}
                  openInNewTab
                  showExternalIcon
                >
                  {params.value}
                </LinkComponent>
            ),
  
        },        
        {
            field: "score",
            renderHeader: () => <strong><p>Score</p></strong>,
            valueGetter: (_, row) => row.score  
        },
        {
            field: "displayname",
            renderHeader: () => <strong><p>Biosample</p></strong>,
            valueGetter: (_, row) => row.displayname  
        }      
       
      ];

    return  errorGWASSnpscCREsGenes ? (
        <Typography>Error Fetching Linked genes of cCREs against SNPs identified by a GWAS study</Typography>
      ) : (
        
        <>
        <Table
          showToolbar
          rows={HiCLinked || []}
          columns={HiC_columns}
          loading={loadingGWASSnpscCREsGenes}     
          label={`Intact Hi-C Loops`}      
          emptyTableFallback={"No intact Hi-C loops overlaps cCREs identified by this GWAS study"}
          initialState={{
            sorting: {
              sortModel: [{ field: "p_val", sort: "desc" }],
            },
          }}          
          divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        />
         <Table
          showToolbar
          rows={ChIAPETLinked || []}
          columns={ChIA_PET_columns}
          loading={loadingGWASSnpscCREsGenes}     
          label={`ChIA-PET Interactions`}      
          emptyTableFallback={"No ChIA-PET Interactions overlaps cCREs identified by this GWAS study"}
          initialState={{
            sorting: {
              sortModel: [{ field: "score", sort: "asc" }],
            },
          }}
          
          divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        />
        <Table
          showToolbar
          rows={crisprLinked || []}
          columns={CRISPR_columns}
          loading={loadingGWASSnpscCREsGenes}     
          label={`CRISPRi-FlowFISH`}      
          emptyTableFallback={"No cCREs identified by this GWAS study were targeted in CRISPRi-FlowFISH experiments"}
          initialState={{
            sorting: {
              sortModel: [{ field: "p_val", sort: "desc" }],
            },
          }}
          
          divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        />
         <Table
          showToolbar
          rows={eqtlLinked || []}
          columns={eqtl_columns}
          loading={loadingGWASSnpscCREsGenes}     
          label={`eQTLs`}     
          emptyTableFallback={"No cCREs identified by this GWAS study overlap a variant associated with significant changes in gene expression"}
          initialState={{
            sorting: {
              sortModel: [{ field: "p_val", sort: "desc" }],
            },
          }}
          
          divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        />
        <Table
          showToolbar
          rows={dataGWASSnpscCREsCompuGenes || []}
          columns={CompuLinkedGenes_columns}
          loading={loadingGWASSnpscCREsGenes}     
          label={`Computational Predictions`}     
          emptyTableFallback={"No Computational Predictions"}
          initialState={{
            sorting: {
              sortModel: [{ field: "score", sort: "desc" }],
            },
          }}
          toolbarSlot={
                    <Tooltip title="Advanced Filters">
                      <Button variant="outlined" onClick={handleClick}>
                      Select Method
                      </Button>
                    </Tooltip>
                  }
          
          divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        />
         <Box
                onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  event.stopPropagation();
                }}
              >
                
                <SelectCompuGenesMethod
                  method={method}
                  open={Boolean(virtualAnchor)}
                  setOpen={handleClickClose}
                  onMethodSelect={handleMethodSelected}
                />
              </Box>
        
        </>
      );


}