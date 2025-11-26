"use client";
import { LinkComponent } from "common/components/LinkComponent";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress } from "@mui/material";
import { Table } from "@weng-lab/ui-components";
import { useTheme } from "@mui/material/styles";
import GWASLandingHeader from "./GWASLandingHeader";
import { Treemap } from "@weng-lab/visualization";
import { useGWASStudyMetaData } from "common/hooks/useGWASStudyMetadata";
import { GwasStudiesMetadata } from "common/types/generated/graphql";
import { useEffect, useMemo, useRef, useState } from "react";
import { subdisease_treemap, tree } from "./gwas_tree_mappings";

export default function GWASLandingPage() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const theme = useTheme();
  const gwasStudyMetadata = useGWASStudyMetaData({ entityType: "gwas" });

  useEffect(() => {
    if (expanded && accordionRefs.current[expanded]) {
      accordionRefs.current[expanded]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [expanded]);

  // Build categorized studies
  const categorizedStudies: Record<string, GwasStudiesMetadata[]> = useMemo(() => {
    if (!gwasStudyMetadata?.data) return {};
    return gwasStudyMetadata.data.reduce(
      (acc, study) => {
        for (const term of study.parent_terms || []) {
          if (!acc[term]) acc[term] = [];
          acc[term].push(study);
        }
        return acc;
      },
      {} as Record<string, GwasStudiesMetadata[]>
    );
  }, [gwasStudyMetadata]);

  // Sort by number of studies
  const sortedCategories = useMemo(
    () => Object.entries(categorizedStudies).sort((a, b) => b[1].length - a[1].length),
    [categorizedStudies]
  );

  const studies_columns: GridColDef<GwasStudiesMetadata>[] = [
    {
      field: "disease_trait",
      headerName: "Disease",
      renderCell: (params) => (
        <LinkComponent
          href={
            !params.row.has_enrichment_info
              ? `/GRCh38/gwas/${params.row.studyid}/variants`
              : `/GRCh38/gwas/${params.row.studyid}/biosample_enrichment`
          }
        >
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "population",
      headerName: "Population",
      valueGetter: (value: string) => value.toUpperCase(),

    },
    {
      field: "studyid",
      headerName: "PubMed ID",
      valueGetter: (value: string) => value?.split("-")[0],
      renderCell: (params) => (
        <LinkComponent href={`https://pubmed.ncbi.nlm.nih.gov/${params.value}`} showExternalIcon openInNewTab>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "author",
      headerName: "Author",
      valueGetter: (value: string) => value?.replaceAll("_", " "),
    },
    {
      field: "has_enrichment_info",
      headerName: "Biosample Enrichment",
      valueGetter: (value: boolean) => value ? "Available" : "Not Available" ,
    },
  ];

  return (
    <Box sx={{ marginX: "5%", marginY: 2 }}>
      <GWASLandingHeader />
      <Box
        sx={{
          height: 400, // or use theme.spacing() / vh / %
          width: "100%",
          overflow: "hidden", // ensures treemap doesn’t overflow
        }}
      >
        <Treemap
          onNodeClicked={(point) => {
            setExpanded(point.label);
          }}
          tooltipBody={(node) => (
            <Box maxWidth={300}>
              <div>
                <strong>{node.label}</strong>{" "}
              </div>
              <div>
                <strong> {node.value}</strong>
              </div>
            </Box>
          )}
          data={ (!expanded || ["Other measurement","Other disease","Other trait"].includes(expanded as string))  ? tree : subdisease_treemap[expanded as string]}
          animation="scale"
          labelPlacement={"topLeft"}
          treemapStyle={{ padding: 8, borderRadius: 5, paddingOuter: 1, opacity: 0.5 }}
        />
      </Box>
      <Box sx={{ width: "100%", margin: "auto", mt: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        {gwasStudyMetadata.loading && <CircularProgress />}
        {sortedCategories && (!expanded || ["Other measurement","Other disease","Other trait"].includes(expanded as string)) &&
          sortedCategories.map(([term, studies]) => (
            <Accordion
              key={term}
              expanded={expanded === term}
              onChange={(_, isExpanded) => setExpanded(isExpanded ? term : false)}
              slotProps={{ transition: { unmountOnExit: true } }}
              disabled={studies.length === 0}
              ref={(el) => {
                accordionRefs.current[term] = el;
              }}
              disableGutters
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowRightIcon />}
                sx={{
                  flexDirection: "row-reverse",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Typography variant="h6">
                  {term} ({studies.length.toLocaleString()})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ height: 500, width: "100%" }}>
                  {
                    <Table
                      showToolbar
                      rows={studies.map((s) => ({ id: s.studyid, ...s })) || []}
                      columns={studies_columns}
                      loading={gwasStudyMetadata.loading}
                      label={`${term} studies`}
                      emptyTableFallback={"No studies"}
                      divHeight={{ height: "100%", minHeight: "500px", maxHeight: "300px" }}
                      initialState={{ sorting: { sortModel: [{ field: "has_enrichment_info", sort: "asc" }] } }}
                    />
                  }
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
      </Box>
    </Box>
  );
}
