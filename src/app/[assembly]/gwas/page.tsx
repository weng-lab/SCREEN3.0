"use client";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { LinkComponent } from "common/components/LinkComponent";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress, IconButton } from "@mui/material";
import { Table } from "@weng-lab/ui-components";
import { useTheme } from "@mui/material/styles";
import GWASLandingHeader from "./GWASLandingHeader";
import { Treemap } from "@weng-lab/visualization";
import { useGWASStudyMetaData } from "common/hooks/useGWASStudyMetadata";
import { GwasStudiesMetadata } from "common/types/generated/graphql";
import { useEffect, useMemo, useRef, useState } from "react";
import { subdisease_treemap, tree } from "./gwas_tree_mappings";
import { Close } from "@mui/icons-material";

export default function GWASLandingPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const theme = useTheme();

  const gwasStudyMetadata = useGWASStudyMetaData({
    entityType: "gwas",
    parent_terms: activeCategory ? [activeCategory] : undefined
  });

  useEffect(() => {
    if (expanded && accordionRefs.current[expanded]) {
      accordionRefs.current[expanded]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [expanded]);

  /** --------------------------
      BUILD CATEGORIZED GROUPS
      --------------------------- */

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

  const active_categorizedStudies = useMemo(() => {
    if (!activeCategory || !gwasStudyMetadata?.data) return {};

    const studies = gwasStudyMetadata.data;
    const layer2Nodes =
      subdisease_treemap?.[activeCategory]?.[0]?.children?.map((c) => c.label) || [];

    const result: Record<string, GwasStudiesMetadata[]> = {};
    for (const label of layer2Nodes) result[label] = [];

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

  const sortedCategories = useMemo(
    () => Object.entries(categorizedStudies).sort((a, b) => b[1].length - a[1].length),
    [categorizedStudies]
  );

  const sortedActiveCategories = useMemo(
    () => Object.entries(active_categorizedStudies).sort((a, b) => b[1].length - a[1].length),
    [active_categorizedStudies]
  );

  /** --------------------------
      SEARCH
      --------------------------- */

  const normalizedSearch = search.toLowerCase().trim();

  const matchesSearch = (study: GwasStudiesMetadata, term?: string) => {
    if (!normalizedSearch) return true;

    return (
      term?.toLowerCase().includes(normalizedSearch) ||
      study.disease_trait?.toLowerCase().includes(normalizedSearch) ||
      study.author?.toLowerCase().includes(normalizedSearch) ||
      study.population?.toLowerCase().includes(normalizedSearch) ||
      study.studyid?.toLowerCase().includes(normalizedSearch)
    );
  };

  /** --------------------------
      TOTAL STUDIES (UNFILTERED)
      --------------------------- */

  const totalStudiesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    sortedCategories.forEach(([term, studies]) => (map[term] = studies.length));
    return map;
  }, [sortedCategories]);

  const totalActiveStudiesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    sortedActiveCategories.forEach(([term, studies]) => (map[term] = studies.length));
    return map;
  }, [sortedActiveCategories]);

  /** --------------------------
      FILTERED CATEGORIES
      --------------------------- */

  const filteredCategories: [string, GwasStudiesMetadata[]][] = useMemo(() => {
    if (!normalizedSearch) return sortedCategories;

    const mapped = sortedCategories.map(([term, studies]) => {
      if (term.toLowerCase().includes(normalizedSearch)) {
        return [term, studies] as [string, GwasStudiesMetadata[]];
      }

      return [
        term,
        studies.filter((s) => matchesSearch(s, term)),
      ] as [string, GwasStudiesMetadata[]];
    });

    // --- SORTING LOGIC ---
    return mapped.sort(([termA, studiesA], [termB, studiesB]) => {
      const aMatches = studiesA.length;
      const bMatches = studiesB.length;

      // Put categories with matches first
      if (aMatches > 0 && bMatches === 0) return -1;
      if (aMatches === 0 && bMatches > 0) return 1;

      // If both have matches, sort by match count DESC
      if (aMatches > 0 && bMatches > 0) {
        return bMatches - aMatches;
      }

      // Both unmatched → keep original order (or sort by total)
      return 0;
    });
  }, [sortedCategories, normalizedSearch]);
  const filteredActiveCategories: [string, GwasStudiesMetadata[]][] = useMemo(() => {
    if (!normalizedSearch) return sortedActiveCategories;

    const mapped = sortedActiveCategories.map(([term, studies]) => {
      if (term.toLowerCase().includes(normalizedSearch)) {
        return [term, studies] as [string, GwasStudiesMetadata[]];
      }

      return [
        term,
        studies.filter((s) => matchesSearch(s, term)),
      ] as [string, GwasStudiesMetadata[]];
    });

    return mapped.sort(([termA, studiesA], [termB, studiesB]) => {
      const aMatches = studiesA.length;
      const bMatches = studiesB.length;

      if (aMatches > 0 && bMatches === 0) return -1;
      if (aMatches === 0 && bMatches > 0) return 1;
      if (aMatches > 0 && bMatches > 0) return bMatches - aMatches;

      return 0;
    });
  }, [sortedActiveCategories, normalizedSearch]);

  const noResults =
    normalizedSearch &&
    ((!activeCategory && filteredCategories.length === 0) ||
      (activeCategory && filteredActiveCategories.length === 0));

  /** --------------------------
      TABLE COLUMNS
      --------------------------- */

  const studies_columns: GridColDef<GwasStudiesMetadata>[] = [
    {
      field: "disease_trait",
      headerName: "Disease",
      renderCell: (params) => (
        <LinkComponent href={`/GRCh38/gwas/${params.row.studyid}/biosample_enrichment`}>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "population",
      headerName: "Population",
      valueGetter: (v: string) => v.toUpperCase(),
    },
    {
      field: "studyid",
      headerName: "PubMed ID",
      valueGetter: (v: string) => v?.split("-")[0],
      renderCell: (params) => (
        <LinkComponent
          href={`https://pubmed.ncbi.nlm.nih.gov/${params.value}`}
          showExternalIcon
          openInNewTab
        >
          {params.value}
        </LinkComponent>
      ),
    },
    {
      field: "author",
      headerName: "Author",
      valueGetter: (v: string) => v?.replaceAll("_", " "),
    },
    {
      field: "has_enrichment_info",
      headerName: "Biosample Enrichment",
      valueGetter: (v: boolean) => (v ? "Available" : "Not Available"),
    },
    {
      field: "total_ld_blocks",
      headerName: "Total LD blocks",
    },
  ];

  /** --------------------------
      TREEMAP HANDLERS
      --------------------------- */

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

  /** --------------------------
      RENDER
      --------------------------- */

  return (
    <Box sx={{ marginX: "5%", marginY: 2 }}>
      <GWASLandingHeader
        activeCategory={activeCategory}
        backToGWASHome={backToGWASHome}
      />

      <Box sx={{ height: 400, width: "100%", overflow: "hidden" }}>
        <Treemap
          onNodeClicked={onNodeClicked}
          key={activeCategory || "root"}
          tooltipBody={(node) => (
            <Box maxWidth={300}>
              <div>
                <strong>{node.label}</strong>
              </div>
              <div>
                <strong>{node.value}</strong>
              </div>
            </Box>
          )}
          data={!activeCategory ? tree : subdisease_treemap[activeCategory]}
          animation="scale"
          labelPlacement="topLeft"
          treemapStyle={{
            padding: 8,
            borderRadius: 5,
            paddingOuter: 1,
            opacity: 0.5,
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          margin: "auto",
          mt: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }}
      >
        {gwasStudyMetadata.loading ? (
          <>
            <CircularProgress size={20} /> <span>Fetching GWAS Studies…</span>
          </>
        ) : (
          <TextField
            fullWidth
            //variant="outlined"
            label="Disease/Trait, Author, PubMed ID"
            placeholder={
              !activeCategory
                ? "Search all categories and studies..."
                : `Search ${activeCategory} studies...`
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                endAdornment: search ? (
                  <IconButton onClick={() => setSearch("")}>
                    <Close />
                  </IconButton>
                ) : (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {noResults ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No results found
            </Typography>
          </Box>
        ) : (
          <>
            {!activeCategory &&
              filteredCategories.map(([term, studies]) => {
                const total = totalStudiesByCategory[term];
                return (
                  <Accordion
                    key={term}
                    expanded={expanded === term}
                    onChange={(_, isExpanded) => setExpanded(isExpanded ? term : false)}
                    disabled={studies.length === 0}
                    slotProps={{ transition: { unmountOnExit: true } }}
                    ref={(el) => {
                      accordionRefs.current[term] = el;
                    }}
                    disableGutters
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowRightIcon />}
                      sx={{
                        flexDirection: "row-reverse",
                        opacity: studies.length === 0 ? 0.4 : 1,
                        pointerEvents: studies.length === 0 ? "none" : "auto",
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                          transform: "rotate(90deg)",
                        },
                      }}
                    >
                      <Typography variant="h6">
                        {term}{" "}
                        (
                        {studies.length.toLocaleString()}
                        {search && studies.length !== total && (
                          <>
                            {" "} {/* <-- explicit space */}
                            <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                              {total.toLocaleString()}
                            </span>
                          </>
                        )}
                        )
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
                          divHeight={{
                            height: "100%",
                            minHeight: "500px",
                            maxHeight: "300px",
                          }}
                          initialState={{
                            sorting: {
                              sortModel: [{ field: "has_enrichment_info", sort: "asc" }],
                            },
                          }}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}

            {activeCategory &&
              filteredActiveCategories.map(([term, studies]) => {
                const total = totalActiveStudiesByCategory[term];
                return (
                  <Accordion
                    key={term}
                    expanded={expanded === term}
                    onChange={(_, isExpanded) => setExpanded(isExpanded ? term : false)}
                    disabled={studies.length === 0}
                    slotProps={{ transition: { unmountOnExit: true } }}
                    ref={(el) => {
                      accordionRefs.current[term] = el;
                    }}
                    disableGutters
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowRightIcon />}
                      sx={{
                        flexDirection: "row-reverse",
                        opacity: studies.length === 0 ? 0.4 : 1,
                        pointerEvents: studies.length === 0 ? "none" : "auto",
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                          transform: "rotate(90deg)",
                        },
                      }}
                    >
                      <Typography variant="h6">
                        {term.charAt(0).toUpperCase() + term.slice(1)}{" "}
                        <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                          {total.toLocaleString()}
                        </span>{" "}
                        ({studies.length.toLocaleString()})
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
                          divHeight={{
                            height: "100%",
                            minHeight: "500px",
                            maxHeight: "300px",
                          }}
                          initialState={{
                            sorting: {
                              sortModel: [{ field: "has_enrichment_info", sort: "asc" }],
                            },
                          }}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </>
        )}
      </Box>
    </Box>
  );
}
