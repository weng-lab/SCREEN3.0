import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { IconButton, Link, Typography } from "@mui/material";
import { getCellCategoryDisplayname, getStudyLink } from "common/utility";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid-pro";
import { OpenInNew } from "@mui/icons-material";
import { Dispatch, SetStateAction } from "react";
import CustomDataGrid, { CustomDataGridColDef } from "common/components/CustomDataGrid";

export type GeneExpressionTableProps = GeneExpressionProps &
  SharedGeneExpressionPlotProps & {
    onSelectionChange: (selected: PointMetadata[]) => void;
    setSortedFilteredData: Dispatch<SetStateAction<PointMetadata[]>>;
  };

const GeneExpressionTable = ({
  geneData,
  selected,
  onSelectionChange,
  geneExpressionData,
  setSortedFilteredData,
  sortedFilteredData,
}: GeneExpressionTableProps) => {
  const { data, loading, error } = geneExpressionData;

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) => (
    <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>
  );

  const columns: CustomDataGridColDef<PointMetadata>[] = [
    {
      ...(GRID_CHECKBOX_SELECTION_COL_DEF as CustomDataGridColDef<PointMetadata>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
      sortable: true,
      hideable: false,
      renderHeader: StopPropagationWrapper,
    },
    {
      field: "accession",
      headerName: "Accession",
    },
    {
      field: "tpm" as any, //Workaround for typing issue -- find better solution
      headerName: "TPM",
      type: "number",
      valueGetter: (_, row) => row.gene_quantification_files[0].quantifications[0].tpm, //need to add average/showreplicates functionality
    },
    {
      field: "biosample",
      headerName: "Sample",
    },
    {
      field: "tissue",
      headerName: "Tissue",
    },
    {
      field: "link" as any, //Workaround for typing issue -- find better solution
      headerName: "Experiment",
      sortable: false,
      disableColumnMenu: true,
      valueGetter: (_, row) => row.accession,
      renderCell: (params) => {
        return (
          <IconButton href={`https://www.encodeproject.org/experiments/${params.value}/`} target="_blank" size="small">
            <OpenInNew fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const newIds = Array.from(ids.ids);
    const selectedRows = newIds.map((id) => data.find((row) => row.accession === id));
    onSelectionChange(selectedRows);
  };

  const apiRef = useGridApiRef();

  const arraysAreEqual = (arr1: PointMetadata[], arr2: PointMetadata[]): boolean => {
    if (arr1.length !== arr2.length) {
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
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as PointMetadata[];
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      setSortedFilteredData(rows);
    }
  };

  return (
    <CustomDataGrid
      apiRef={apiRef}
      tableTitle={
        <Typography variant="h6">
          <i>{geneData?.data.name}</i> Expression
        </Typography>
      }
      density="standard"
      rows={data}
      columns={columns}
      loading={loading}
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        sorting: {
          sortModel: [{ field: "tpm", sort: "desc" }],
        },
      }}
      checkboxSelection
      getRowId={(row) => row.accession} //needed to match up data with the ids returned by onRowSelectionModelChange
      onRowSelectionModelChange={handleRowSelectionModelChange}
      rowSelectionModel= {{type: 'include', ids: new Set(selected.map((x) => x.accession))}}
      keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
      onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
    />
  );
};

export default GeneExpressionTable;
