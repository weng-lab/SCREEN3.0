import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { IconButton } from "@mui/material";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef
} from "@mui/x-data-grid-pro";
import { OpenInNew } from "@mui/icons-material";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Table } from  "@weng-lab/ui-components";

export type GeneExpressionTableProps = GeneExpressionProps &
  SharedGeneExpressionPlotProps & {
    onSelectionChange: (selected: PointMetadata[]) => void;
    setSortedFilteredData: Dispatch<SetStateAction<PointMetadata[]>>;
    scale: "linearTPM" | "logTPM";
    replicates: "mean" | "all";
    viewBy: "byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM";
    RNAtype: "all" | "polyA plus RNA-seq" | "total RNA-seq";
  };

const GeneExpressionTable = ({
  geneData,
  selected,
  onSelectionChange,
  geneExpressionData,
  setSortedFilteredData,
  sortedFilteredData,
  scale,
  replicates,
  viewBy,
  RNAtype
}: GeneExpressionTableProps) => {
  const { data, loading, error } = geneExpressionData;

  //TODO: handle rnatype change for mouse

  // based on control buttons in parent, transform this data to match the expected format
  const transformedData: PointMetadata[] = useMemo(() => {
    if (!data?.length) return [];

    let result: PointMetadata[] = data.flatMap((entry) => {
      const files = entry.gene_quantification_files?.filter(Boolean) ?? [];

      if (replicates === "all") {
        return files.flatMap((file, i) => {
          const quants = file.quantifications?.filter(Boolean) ?? [];

          return quants.map((quant) => {
            const rawTPM = quant.tpm;
            const scaledTPM =
              scale === "logTPM" ? Math.log10(rawTPM + 1) : rawTPM;

            //This specific accession has two boreps of "1" for some reson, ask Nishi
            const repLabel = file.biorep != null ? entry.accession === "ENCSR954PZB" ? ` rep. ${i + 1}` : ` rep. ${file.biorep}` : "";
            const modifiedAccession = `${entry.accession}${repLabel}`;

            return {
              ...entry,
              accession: modifiedAccession,
              gene_quantification_files: [
                {
                  ...file,
                  quantifications: [
                    {
                      ...quant,
                      tpm: scaledTPM,
                    },
                  ],
                },
              ],
            };
          });
        });
      } else {
        // replicates === "mean"
        const allQuants = files.flatMap(
          (file) => file.quantifications?.filter(Boolean) ?? []
        );
        if (!allQuants.length) return [];

        const avgTPM =
          allQuants.reduce((sum, q) => sum + q.tpm, 0) / allQuants.length;

        const scaledTPM =
          scale === "logTPM" ? Math.log10(avgTPM + 1) : avgTPM;

        return [
          {
            ...entry,
            gene_quantification_files: [
              {
                accession: "averaged",
                biorep: null,
                quantifications: [
                  {
                    __typename: "GeneQuantification",
                    file_accession: "average",
                    tpm: scaledTPM,
                  },
                ],
                __typename: "GeneQuantificationFile",
              },
            ],
          },
        ];
      }
    });

    // Sort based on viewBy
    switch (viewBy) {
      case "byExperimentTPM": {
        result.sort((a, b) =>
          (b.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0) -
          (a.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0)
        );
        break;
      }

      case "byTissueTPM": {
        const getTPM = (d: PointMetadata) =>
          d.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0;
        const getTissue = (d: PointMetadata) => d.tissue ?? "unknown";

        const maxValuesByTissue: Record<string, number> = result.reduce((acc, item) => {
          const tissue = getTissue(item);
          const tpm = getTPM(item);
          acc[tissue] = Math.max(acc[tissue] || -Infinity, tpm);
          return acc;
        }, {} as Record<string, number>);

        result.sort((a, b) => {
          const tissueA = getTissue(a);
          const tissueB = getTissue(b);
          const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
          if (maxDiff !== 0) return maxDiff;
          return getTPM(b) - getTPM(a);
        });
        break;
      }

      case "byTissueMaxTPM": {
        const getTPM = (d: PointMetadata) =>
          d.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0;
        const getTissue = (d: PointMetadata) => d.tissue ?? "unknown";

        const maxValuesByTissue: Record<string, number> = result.reduce((acc, item) => {
          const tissue = getTissue(item);
          const tpm = getTPM(item);
          acc[tissue] = Math.max(acc[tissue] || -Infinity, tpm);
          return acc;
        }, {} as Record<string, number>);

        result = result.filter((item) => {
          const tpm = getTPM(item);
          const tissue = getTissue(item);
          return tpm === maxValuesByTissue[tissue];
        });

        result.sort((a, b) => getTPM(b) - getTPM(a));
        break;
      }
    }
    
    return result;
  }, [data, viewBy, replicates, scale]);

  //This is used to prevent sorting from happening when clicking on the header checkbox
  // const StopPropagationWrapper = (params) => (
  //   <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
  //     <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
  //   </div>
  // );

  const columns: GridColDef<PointMetadata>[] = [
    // {
    //   ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef<PointMetadata>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
    //   sortable: true,
    //   hideable: false,
    //   renderHeader: StopPropagationWrapper,
    // },
    {
      field: "accession",
      headerName: "Accession",
    },
    {
      field: "tpm" as any, //Workaround for typing issue -- find better solution
      headerName: "TPM",
      type: "number",
      valueGetter: (_, row) => {
        return (row.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm).toFixed(2) ?? 0;
      },
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
      valueGetter: (_, row) => row.accession.split(" ")[0], //get rid of rep. # in link
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
    const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as PointMetadata[];
    if (!arraysAreEqual(sortedFilteredData, rows)) {
      setSortedFilteredData(rows);
      console.log("Synced");
    }
  };

  return (
    <Table
      apiRef={apiRef}
      label={`${geneData?.data.name} Expression`}
      density="standard"
      rows={transformedData}
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
      rowSelectionModel={{ type: 'include', ids: new Set(selected.map((x) => x.accession)) }}
      keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
      onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
      divHeight={{height: "100%", minHeight: "580px", maxHeight: "600px"}}
    />
  );
};

export default GeneExpressionTable;
