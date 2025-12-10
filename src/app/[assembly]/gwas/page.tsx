"use client";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { LinkComponent } from "common/components/LinkComponent";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress, Button } from "@mui/material";
import { Table } from "@weng-lab/ui-components";
import { useTheme } from "@mui/material/styles";
import GWASLandingHeader from "./GWASLandingHeader";
import { Treemap } from "@weng-lab/visualization";
import { useGWASStudyMetaData } from "common/hooks/useGWASStudyMetadata";
import { GwasStudiesMetadata } from "common/types/generated/graphql";
import { useEffect, useMemo, useRef, useState } from "react";
import { subdisease_treemap, tree } from "./gwas_tree_mappings";

export default function GWASLandingPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const theme = useTheme();
  const gwasStudyMetadata = useGWASStudyMetaData({ entityType: "gwas", parent_terms: activeCategory ? [activeCategory] : undefined });


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
  // Build categorized studies for ACTIVE category (layer_2_terms based)
  const active_categorizedStudies = useMemo(() => {
    if (!activeCategory || !gwasStudyMetadata?.data) return {};

    const studies = gwasStudyMetadata.data;

    // List of second-level disease labels inside activeCategory treemap
    const layer2Nodes =
      subdisease_treemap?.[activeCategory]?.[0]?.children?.map((c) => c.label) || [];

    const result: Record<string, GwasStudiesMetadata[]> = {};

    // Initialize empty arrays
    for (const label of layer2Nodes) {
      result[label] = [];
    }


    // Assign studies based on layer_2_terms
    for (const study of studies) {
      const layer2Terms = study.layer_2_terms || [];

      for (const label of layer2Nodes) {
        if (layer2Terms.includes(label.toLowerCase())) {
          result[label].push(study);
        }
      }
    }

    return result;
  }, [activeCategory, gwasStudyMetadata]);


  // Sort by number of studies
  const sortedCategories = useMemo(
    () => Object.entries(categorizedStudies).sort((a, b) => b[1].length - a[1].length),
    [categorizedStudies]
  );
  const sortedActiveCategories = useMemo(
    () => Object.entries(active_categorizedStudies).sort((a, b) => b[1].length - a[1].length),
    [active_categorizedStudies]
  );

  // Normalize search
  const normalizedSearch = search.toLowerCase().trim();
  useEffect(() => {
    if (!normalizedSearch) return;

    // Expand all categories that contain matches
    if (!activeCategory) {
      const firstMatch = filteredCategories[0]?.[0];
      if (firstMatch) setExpanded(firstMatch);
    } else {
      const firstMatch = filteredActiveCategories[0]?.[0];
      if (firstMatch) setExpanded(firstMatch);
    }
  }, [normalizedSearch]);

  const matchesSearch = (study: GwasStudiesMetadata, term?: string) => {
    if (!normalizedSearch) return true;

    return (
      term?.toLowerCase().includes(normalizedSearch) ||                // <-- match accordion label
      study.disease_trait?.toLowerCase().includes(normalizedSearch) ||
      study.author?.toLowerCase().includes(normalizedSearch) ||
      study.population?.toLowerCase().includes(normalizedSearch) ||
      study.studyid?.toLowerCase().includes(normalizedSearch)
    );
  };

  const filteredCategories: [string, GwasStudiesMetadata[]][] = useMemo(() => {
    if (!normalizedSearch) return sortedCategories;

    return sortedCategories
      .map(([term, studies]): [string, GwasStudiesMetadata[]] => {
        // If the accordion label matches, keep ALL studies
        if (term.toLowerCase().includes(normalizedSearch)) {
          return [term, studies];
        }

        // Otherwise filter studies inside it
        return [
          term,
          studies.filter((s) => matchesSearch(s, term)),
        ];
      })
      .filter(([_, studies]) => studies.length > 0);
  }, [sortedCategories, normalizedSearch]);


  const filteredActiveCategories: [string, GwasStudiesMetadata[]][] = useMemo(() => {
    if (!normalizedSearch) return sortedActiveCategories;

    return sortedActiveCategories
      .map(([term, studies]): [string, GwasStudiesMetadata[]] => {
        // If the accordion label matches, keep all studies
        if (term.toLowerCase().includes(normalizedSearch)) {
          return [term, studies];
        }

        return [
          term,
          studies.filter((s) => matchesSearch(s, term)),
        ];
      })
      .filter(([_, studies]) => studies.length > 0);
  }, [sortedActiveCategories, normalizedSearch]);

  const noResults =
    normalizedSearch &&
    (
      (!activeCategory && filteredCategories.length === 0) ||
      (activeCategory && filteredActiveCategories.length === 0)
    );


  const studies_columns: GridColDef<GwasStudiesMetadata>[] = [
    {
      field: "disease_trait",
      headerName: "Disease",
      renderCell: (params) => (
        <LinkComponent
          href={
            `/GRCh38/gwas/${params.row.studyid}/biosample_enrichment`
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
      valueGetter: (value: boolean) => value ? "Available" : "Not Available",
    },
    {
      field: "total_ld_blocks",
      headerName: "Total LD blocks",
    }
  ];
  const onNodeClicked = (node: any) => {

    const label = node.label;
    const isTerminal = ["Other disease", "Other trait", "Other measurement"].includes(label);

    if (!activeCategory && !isTerminal) {
      setActiveCategory(label);
      setExpanded(false);
      return;
    }
    setExpanded(label);
  };

  const backToGWASHome = () => {
    setActiveCategory(null);
    setExpanded(false);
  };
  return (
    <Box sx={{ marginX: "5%", marginY: 2 }}>
      <GWASLandingHeader activeCategory={activeCategory} backToGWASHome={backToGWASHome} />
      <Box
        sx={{
          height: 400, // or use theme.spacing() / vh / %
          width: "100%",
          overflow: "hidden", // ensures treemap doesn’t overflow
        }}
      >
        <Treemap
          onNodeClicked={onNodeClicked}
          key={activeCategory || "root"}
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
          data={!activeCategory ? tree : subdisease_treemap[activeCategory]}
          animation="scale"
          labelPlacement={"topLeft"}
          treemapStyle={{ padding: 8, borderRadius: 5, paddingOuter: 1, opacity: 0.5 }}
        />
      </Box>
      <Box sx={{ width: "100%", margin: "auto", mt: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        {gwasStudyMetadata.loading && <><CircularProgress size={20} /> <span>Fetching GWAS Studies…</span></>}
        {!gwasStudyMetadata.loading && <TextField
          fullWidth
          variant="outlined"
          placeholder={!activeCategory ? "Search all categories and studies..." : `Search ${activeCategory} studies...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />}
        {noResults ? <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No results found
          </Typography>
        </Box> :
          <>
            {filteredCategories && !activeCategory &&
              filteredCategories.map(([term, studies]) => (
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
            {filteredActiveCategories && activeCategory &&
              filteredActiveCategories.map(([term, studies]) => (
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
                      {term.charAt(0).toUpperCase() + term.slice(1)} ({studies.length.toLocaleString()})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ height: 500, width: "100%" }}>
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
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
          </>}
      </Box>
    </Box>
  );
}
