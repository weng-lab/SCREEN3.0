"use client";

import { Accordion, AccordionDetails, AccordionSummary, List, Skeleton, Typography } from "@mui/material";
import { getCellCategoryDisplayname, getClassDisplayname } from "common/utility";
import { GenomicRange } from "types/globalTypes";
import { useIcreData, UseIcreDataReturn } from "common/hooks/useIcreData";
import { useIcreActivity, UseIcreActivityReturn } from "common/hooks/useIcreActivity";
import { useMemo } from "react";
import { ExpandMore } from "@mui/icons-material";
import ActiveCellTypesAccordion from "common/components/ActiveCellTypesAccordion";
import CustomDataGrid, { CustomDataGridColDef, CustomDataGridProps } from "common/components/CustomDataGrid";
import { LinkComponent } from "./LinkComponent";

const IntersectingiCREs = ({
  region,
  customDataGridProps,
}: {
  region: GenomicRange;
  customDataGridProps?: Partial<Omit<CustomDataGridProps<any>, "rows" | "columns">>;
}) => {
  const { data: dataIcres, loading: loadingIcres, error: errorIcres } = useIcreData({ coordinates: region });

  const intersectingAccessions = useMemo(() => {
    if (!dataIcres) return null;
    return dataIcres.map((x) => x.accession);
  }, [dataIcres]);

  const {
    data: dataActivity,
    loading: loadingActivity,
    error: errorActivity,
  } = useIcreActivity({ accession: intersectingAccessions });

  const rowsNoExps = dataIcres || [];

  type ExpInfo = UseIcreActivityReturn["data"][number];

  /**
   * This could probably be made more efficient than O(n^2)
   */
  const rowsWithExps = rowsNoExps.map((row) => {
    let activeExps: {
      [lineage: string]: ExpInfo[];
    } = {};

    if (dataActivity)
      dataActivity.forEach((exp) => {
        //Cutoff for experiment activity set at 1.64
        if (exp.accession === row.accession && exp.value > 1.64) {
          if (activeExps[exp.lineage]) {
            activeExps[exp.lineage] = [...activeExps[exp.lineage], exp];
          } else {
            activeExps[exp.lineage] = [exp];
          }
        }
      });

    return { ...row, activeExps: activeExps };
  });

  type Row = (typeof rowsWithExps)[number];

  const columns: CustomDataGridColDef<Row>[] = [
    {
      field: "accession",
      headerName: "Accession",
      renderCell: (params) => <LinkComponent href={`/icre/${params.value}`}>{params.value}</LinkComponent>,
    },
    {
      field: "group",
      headerName: "Class",
      type: "custom",
      renderCell: (params) => getClassDisplayname(params.value),
    },
    {
      field: "coordinates",
      headerName: "Coordinates",
      valueGetter: (_, row: Row) =>
        `${
          row.coordinates.chromosome
        }:${row.coordinates.start.toLocaleString()}-${row.coordinates.end.toLocaleString()}`,
    },
    {
      field: "dnasecelltypes",
      headerName: "DNase Celltypes",
      maxWidth: 300,
      sortComparator: (v1, v2) => v1.length - v2.length,
      renderCell: (params) => (
        <ActiveCellTypesAccordion
          celltypes={params.value}
          assay="DNase"
          accordionProps={{ elevation: 0, sx: { width: "100%", background: "transparent" } }}
        />
      ),
    },
    {
      field: "ataccelltypes",
      headerName: "ATAC Celltypes",
      maxWidth: 300,
      sortComparator: (v1, v2) => v1.length - v2.length,
      renderCell: (params) => (
        <ActiveCellTypesAccordion
          celltypes={params.value}
          assay="ATAC"
          accordionProps={{ elevation: 0, sx: { width: "100%", background: "transparent" } }}
        />
      ),
    },
    {
      field: "activeExps",
      headerName: "Active Experiments",
      maxWidth: 300,
      sortComparator: (v1, v2) => Object.values(v1).flat().length - Object.values(v2).flat().length,
      renderCell: (params) => {
        const activeExps = params.value as Row["activeExps"];
        if (loadingActivity) return <Skeleton width={300} height={40} />;
        return (
          <Accordion
            sx={{ width: "100%", background: "transparent" }}
            slotProps={{ transition: { unmountOnExit: true } }}
            elevation={0}
            disableGutters
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              Active in {Object.values(activeExps).flat().length} Experiments
            </AccordionSummary>
            <AccordionDetails sx={{ paddingY: 0 }}>
              {Object.entries(activeExps).map(([lineage, exps], i) => (
                <Accordion key={i} elevation={0} sx={{ background: "transparent" }}>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 0 }}>
                    {getCellCategoryDisplayname(lineage)} ({exps.length})
                  </AccordionSummary>
                  <AccordionDetails>
                    <List disablePadding sx={{ listStyleType: "disc" }}>
                      {exps.map((exp, i) => (
                        <LinkComponent href={exp.link} showExternalIcon openInNewTab display={"list-item"} key={i}>
                          {exp.biosampleid} - {exp.source}
                        </LinkComponent>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      },
    },
  ];

  return errorIcres ? (
    <Typography>Error Fetching iCRES</Typography>
  ) : (
    <CustomDataGrid
      rows={rowsWithExps}
      columns={columns.map((col) => ({
        ...col,
        display: "flex",
      }))}
      loading={loadingIcres}
      pagination
      initialState={{
        sorting: {
          sortModel: [{ field: "coordinates", sort: "asc" }],
        },
      }}
      tableTitle="Intersecting iCREs"
      pageSizeOptions={[10, 25, 50, 100]}
      getRowHeight={() => "auto"}
      emptyTableFallback={"No intersecting iCREs found in this region"}
      {...customDataGridProps}
    />
  );
};

export default IntersectingiCREs;
