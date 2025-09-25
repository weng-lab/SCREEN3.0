import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import {IconButton, Tooltip } from "@mui/material";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
  GridColDef,
  Table
} from "@weng-lab/ui-components";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import React from "react";
import { Assembly } from "types/globalTypes";
import TuneIcon from '@mui/icons-material/Tune';
import AdvancedFiltersPopper from "./AdvancedFilters";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility"

export type GeneExpressionTableProps = GeneExpressionProps &
  SharedGeneExpressionPlotProps & {
    onSelectionChange: (selected: PointMetadata[]) => void;
    setSortedFilteredData: Dispatch<SetStateAction<PointMetadata[]>>;
    assembly: Assembly;
    scale: "linearTPM" | "logTPM";
    onScaleChange: (newScale: "linearTPM" | "logTPM") => void
  };

const GeneExpressionTable = ({
  geneData,
  selected,
  onSelectionChange,
  geneExpressionData,
  setSortedFilteredData,
  sortedFilteredData,
  assembly,
  scale,
  onScaleChange,
}: GeneExpressionTableProps) => {
  const { data, loading, error } = geneExpressionData;
  const [replicates, setReplicates] = useState<"mean" | "all">("mean")
  const [viewBy, setViewBy] = useState<"byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM">("byExperimentTPM")
  const [RNAtype, setRNAType] = useState<"all" | "polyA plus RNA-seq" | "total RNA-seq">(assembly === "GRCh38" ? "total RNA-seq" : "all")

  //Not really sure how this works, but only way to anchor the popper since the extra toolbarSlot either gets unrendered or unmouted after
  //setting the anchorEl to the button
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

  const handleClickAway = () => {
    if (virtualAnchor) {
      setVirtualAnchor(null);
    }
  };

  const handleReplicatesChange = (
    event: React.MouseEvent<HTMLElement>,
    newReplicates: string | null,
  ) => {
    if ((newReplicates !== null) && ((newReplicates === "mean") || (newReplicates === "all"))) {
      setReplicates(newReplicates)
    }
  };

  const handleScaleChange = (
    event: React.MouseEvent<HTMLElement>,
    newScale: string | null,
  ) => {
    if ((newScale !== null) && ((newScale === "linearTPM") || (newScale === "logTPM"))) {
      onScaleChange(newScale)
    }
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null,
  ) => {
    if ((newView !== null) && ((newView === "byTissueMaxTPM") || (newView === "byExperimentTPM") || (newView === "byTissueTPM"))) {
      setViewBy(newView)
    }
  };

  const handleRNATypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newRNA: string | null,
  ) => {
    if ((newRNA !== null) && ((newRNA === "all") || (newRNA === "polyA plus RNA-seq") || (newRNA === "total RNA-seq"))) {
      setRNAType(newRNA)
    }
  };

  const handleReset = () => {
    setReplicates("mean");
    onScaleChange("linearTPM");
    setViewBy("byExperimentTPM");
    setRNAType("total RNA-seq");
  }

  // based on control buttons in parent, transform this data to match the expected format
  const transformedData: PointMetadata[] = useMemo(() => {
    if (!data?.length) return [];

    const filteredData = data.filter(d => RNAtype === "all" || d.assay_term_name === RNAtype)

    let result: PointMetadata[] = filteredData.flatMap((entry) => {
      const files = entry.gene_quantification_files?.filter(Boolean) ?? [];

      if (replicates === "all") {
        return files.flatMap((file, i) => {
          const quants = file.quantifications?.filter(Boolean) ?? [];
          const quant = quants[0]

          const rawTPM = quant.tpm;
          const scaledTPM =
            scale === "logTPM" ? Math.log10(rawTPM + 1) : rawTPM;

          const repLabel = file.biorep != null ? ` rep. ${file.biorep}` : "";
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
                accession: files[0]?.accession,
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
  }, [data, viewBy, RNAtype, replicates, scale]);

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
      field: "biosample",
      headerName: "Sample",
      sortable: viewBy !== "byTissueTPM",
      valueGetter: (_, row) => {
        return capitalizeFirstLetter(row.biosample);
      },
      //truncate
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 250,
          }}
          title={params.value}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "tpm" as any, //Workaround for typing issue -- find better solution
      headerName: "TPM",
      type: "number",
      valueGetter: (_, row) => {
        return (row.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm).toFixed(2) ?? 0;
      },
      sortable: viewBy !== "byTissueTPM",
    },
    {
      field: "tissue",
      headerName: "Tissue",
      sortable: viewBy !== "byTissueTPM",
    },
    {
      field: "biosample_type",
      headerName: "Biosample Type",
      sortable: viewBy !== "byTissueTPM",
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

  const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const newIds = Array.from(ids.ids);
    const selectedRows = newIds.map((id) => transformedData.find((row) => row.gene_quantification_files[0].accession === id));
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
    }
  };


  useEffect(() => {
    const isCustomSorted = viewBy === "byTissueTPM";
    if (isCustomSorted && apiRef?.current) {
      apiRef.current.setSortModel([]); // completely clears internal sort
    }
  }, [viewBy, apiRef]);

  return (
    <>
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
        // -- Selection Props --
        checkboxSelection
        getRowId={(row) => row.gene_quantification_files[0].accession} //needed to match up data with the ids returned by onRowSelectionModelChange
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={{ type: 'include', ids: new Set(selected.map((x) => x.gene_quantification_files[0].accession)) }}
        keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
        // -- End Selection Props --
        onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
        divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        toolbarSlot={
          <Tooltip title="Advanced Filters">
            <IconButton
              size="small"
              onClick={handleClick}
            >
              <TuneIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <AdvancedFiltersPopper
        open={Boolean(virtualAnchor)}
        anchorEl={virtualAnchor}
        assembly={assembly}
        RNAtype={RNAtype}
        scale={scale}
        viewBy={viewBy}
        replicates={replicates}
        handleClickAway={handleClickAway}
        handleRNATypeChange={handleRNATypeChange}
        handleScaleChange={handleScaleChange}
        handleViewChange={handleViewChange}
        handleReplicatesChange={handleReplicatesChange}
        handleReset={handleReset}
      />
    </>
  );
};

export default GeneExpressionTable;
