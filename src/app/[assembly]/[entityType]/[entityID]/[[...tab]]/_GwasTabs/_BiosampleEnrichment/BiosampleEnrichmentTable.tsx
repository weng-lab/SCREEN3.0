

import TuneIcon from '@mui/icons-material/Tune';
import { GWASEnrichment, useGWASEnrichmentData, UseGWASEnrichmentReturn } from "common/hooks/useGWASEnrichmentData";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";

import { Typography } from "@mui/material";

import { Table } from "@weng-lab/ui-components";
import { OpenInNew } from "@mui/icons-material";
import {IconButton, Link, Tooltip } from "@mui/material";
import { capitalizeFirstLetter } from "common/utility";
import { ApolloError } from "@apollo/client";
import AdvancedFilters from "./AdvancedFilters";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef
} from "@mui/x-data-grid-pro";

export type BiosampleEnrichmentTableProps = {
  enrichmentdata: UseGWASEnrichmentReturn,
  onSelectionChange: (selected: GWASEnrichment[]) => void;
  setSortedFilteredData: Dispatch<SetStateAction<GWASEnrichment[]>>;
  selected: GWASEnrichment[];    
  sortedFilteredData: GWASEnrichment[]
};
const BiosampleEnrichmentTable = ({ enrichmentdata, onSelectionChange, setSortedFilteredData, selected, sortedFilteredData }: BiosampleEnrichmentTableProps) => {
  const { data, loading, error } = enrichmentdata;
    const [viewBy, setViewBy] = useState<"byExperiment" | "byTissue">("byExperiment")
    const [virtualAnchor, setVirtualAnchor] = React.useState<{
        getBoundingClientRect: () => DOMRect;
      } | null>(null);
    
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
    
  const handleReset = () => {
    
    setViewBy("byExperiment");;
  }

  const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
      const newIds = Array.from(ids.ids);
      const selectedRows = newIds.map((id) => transformedData.find((row) => row.accession === id));
      onSelectionChange(selectedRows);
    };
  
    const apiRef = useGridApiRef();
  
      const handleViewChange = (
          event: React.MouseEvent<HTMLElement>,
          newView: string | null,
        ) => {
          if ((newView !== null) && ( (newView === "byExperiment") || (newView === "byTissue"))) {
            setViewBy(newView)
          }
        };
      const handleClickAway = () => {
        if (virtualAnchor) {
          setVirtualAnchor(null);
        }
      };
    
const arraysAreEqual = (arr1: GWASEnrichment[], arr2: GWASEnrichment[]): boolean => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const isEqual = JSON.stringify(arr1[0]) === JSON.stringify(arr2[0]);
    if (!isEqual) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].accession !== arr2[i].accession) {
        return false;
      }
    }
    return true;
  };

  const handleSync = () => {
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as GWASEnrichment[];
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      setSortedFilteredData(rows);
    }
  };

    // based on control buttons in parent, transform this data to match the expected format
     const transformedData: GWASEnrichment[] = useMemo(() => {
       if (!data?.length) return [];
   
       
   
       let result: GWASEnrichment[] = data
   
       // Sort based on viewBy
       switch (viewBy) {
         case "byExperiment": {
           result.sort((a, b) =>
             (b.fc ?? 0) -
             (a.fc ?? 0)
           );
           break;
         }
   
         case "byTissue": {
           const getFC = (d: GWASEnrichment) =>
             d.fc ?? 0;
           const getTissue = (d: GWASEnrichment) => d.ontology ?? "unknown";
   
           const maxValuesByTissue: Record<string, number> = result.reduce((acc, item) => {
             const tissue = getTissue(item);
             const fc = getFC(item);
             acc[tissue] = Math.max(acc[tissue] || -Infinity, fc);
             return acc;
           }, {} as Record<string, number>);
   
           result.sort((a, b) => {
             const tissueA = getTissue(a);
             const tissueB = getTissue(b);
             const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
             if (maxDiff !== 0) return maxDiff;
             return getFC(b) - getFC(a);
           });
           break;
         }
   
       }
   
       return result;
     }, [data, viewBy]);
   
    
     console.log("transformedData",transformedData)

    const columns: GridColDef<(typeof data)[number]>[] = [
       
        {
          field: "displayname",
          renderHeader: () => <strong><p>Biosample</p></strong>,
          valueGetter: (_, row) => {
                  return capitalizeFirstLetter(row.displayname);
                },
          renderCell: (params) => (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 150,
              }}
              title={params.value}
            >
              {params.value}
            </div>
          ),

        },
        {
          field: "fc",            
          renderHeader: () => <strong><p>Fold Change</p></strong>,
          valueGetter: (_, row) => row.fc.toFixed(3),
        },
        {
          field: "fdr",      
          renderHeader: () => <strong><p>FDR</p></strong>,
          valueGetter: (_, row) =>  row.fdr.toFixed(3),
        },
        {
          field: "pvalue",      
          renderHeader: () => <strong><i>P</i></strong>,
          valueGetter: (_, row) => row.pvalue.toFixed(3),
        },
        
        {
            field: "ontology",
            renderHeader: () => <strong><p>Tissue</p></strong>,
            valueGetter: (_, row) => row.ontology
  
          },
        {
            field: "link",
            headerName: "Experiment",
            sortable: false,
            disableColumnMenu: true,
            valueGetter: (_, row) => {
              return (row.accession.split(" ")[0])
            },
            renderCell: (params) => {
              return (
                <IconButton href={`https://www.encodeproject.org/experiments/${params.value}/`} target="_blank" size="small">
                  <OpenInNew fontSize="small" />
                </IconButton>
              );
            },
          }, 
       
      ];
    
      return error ? (
        <Typography>Error Fetching GWAS Enrichment</Typography>
      ) : (
        <>
        <Table
          apiRef={apiRef}
          showToolbar
          rows={transformedData || []}
          columns={columns}
          loading={loading}     
          label={`Suggested Biosamples`}      
          emptyTableFallback={"No Suggested Biosamples found for this study"}
          initialState={{
            sorting: {
              sortModel: [{ field: "fc", sort: "desc" }],
            },
          }}
          checkboxSelection
          getRowId={(row) => row.accession} //needed to match up data with the ids returned by onRowSelectionModelChange
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={{ type: 'include', ids: new Set(selected.map((x) => x.accession)) }}
        keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
        onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structur
          divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
          /*toolbarSlot={
            <Tooltip title="Advanced Filters">
              <IconButton
                size="small"
                onClick={handleClick}
              >
                <TuneIcon />
              </IconButton>
            </Tooltip>
          }*/
        />
        {/*<AdvancedFilters
        open={Boolean(virtualAnchor)}
        anchorEl={virtualAnchor}
        
        viewBy={viewBy}
        handleClickAway={handleClickAway}
        
        handleViewChange={handleViewChange}
        handleReset={handleReset}
      />*/}
      </>
      );
}

export default BiosampleEnrichmentTable;