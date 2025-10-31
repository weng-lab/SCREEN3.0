"use client";
import { LinkComponent } from "common/components/LinkComponent";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, CircularProgress, Switch, FormGroup, FormControlLabel, Stack } from "@mui/material";
import { Table } from "@weng-lab/ui-components";
import { useTheme } from "@mui/material/styles";
import GWASLandingHeader from "./GWASLandingHeader";
import { Treemap, TreemapNode } from "@weng-lab/visualization";
import { useGWASStudyMetaData } from "../../../common/hooks/useGWASStudyMetadata";
import { GwasStudiesMetadata } from "common/types/generated/graphql";
import { useEffect, useMemo, useRef, useState } from "react";
type ParentTermMetadata = {
  description: string;
  source: string;
};

const data: TreemapNode<ParentTermMetadata>[] = [
  { label: "Other measurement", value: 31657, style: { color: "#056798", labelColor: "#58C1E5" } },
  { label: "Lipid or lipoprotein measurement", value: 2123, style: { color: "#B5DD6E", labelColor: "#525D3D" } },
  { label: "Other disease", value: 1676, style: { color: "#FC3C99", labelColor: "#840040" } },
  { label: "Other trait", value: 1273, style: { color: "#F98174", labelColor: "#953227" } },
  { label: "Cancer", value: 1169, style: { color: "#BB82BC", labelColor: "#683569" } },
  { label: "Neurological disorder", value: 1158, style: { color: "#FFFEB6", labelColor: "#95944D" } },
  { label: "Biological process", value: 1008, style: { color: "#BEBBD9", labelColor: "#676480" } },
  { label: "Cardiovascular measurement", value: 726, style: { color: "#81B2D2", labelColor: "#335E7A" } },
  { label: "Digestive system disorder", value: 684, style: { color: "#B6704F", labelColor: "#2F0F00" } },
  { label: "Cardiovascular disease", value: 649, style: { color: "#B13535", labelColor: "#FFD4D4" } },
  { label: "Immune system disorder", value: 587, style: { color: "#FFEC76", labelColor: "#988612" } },
  { label: "Hematological measurement", value: 568, style: { color: "#90D3C7", labelColor: "#90D3C7" } },
  { label: "Body measurement", value: 376, style: { color: "#69CDFE", labelColor: "#f9719B" } },
  { label: "Metabolic disorder", value: 294, style: { color: "#FCB467", labelColor: "#9C5A13" } },
  { label: "Inflammatory measurement", value: 201, style: { color: "#CDEAC6", labelColor: "#6B8764" } },
];

export default function GWASLandingPage() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const theme = useTheme();
  const gwasStudyMetadata = useGWASStudyMetaData({ entityType: "gwas" });

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    console.log('Biosample Enrichment:', event.target.checked ? 'Enabled' : 'Disabled');
  };
  useEffect(() => {
    if (expanded && accordionRefs.current[expanded]) {
      accordionRefs.current[expanded]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [expanded]);

  // ✅ Safely build categorized studies
  const categorizedStudies: Record<string, GwasStudiesMetadata[]> = useMemo(() => {
    if (!gwasStudyMetadata?.data) return {};
    return gwasStudyMetadata.data.reduce((acc, study) => {
      for (const term of study.parent_terms || []) {
        if (!acc[term]) acc[term] = [];
        acc[term].push(study);
      }
      return acc;
    }, {} as Record<string, GwasStudiesMetadata[]>);
  }, [gwasStudyMetadata]);

  // ✅ Sort by number of studies
  const sortedCategories = useMemo(
    () =>
      Object.entries(categorizedStudies).sort(
        (a, b) => b[1].length - a[1].length
      ),
    [categorizedStudies]
  );


  const studies_columns: GridColDef<GwasStudiesMetadata>[] = [
    {
      field: "disease_trait",
      renderHeader: () => (
        <strong>
          <p>Disease</p>
        </strong>
      ),
      valueGetter: (_, row) => {
        return row.disease_trait;
      },
      renderCell: (params) => (
        <LinkComponent href={!params.row.has_enrichment_info ? `/GRCh38/gwas/${params.row.studyid}/variants` : `/GRCh38/gwas/${params.row.studyid}/biosample_enrichment`}>
          {params.value}
        </LinkComponent>
      )
    },
    {
      field: "population",
      renderHeader: () => (
        <strong>
          <p>Population</p>
        </strong>
      ),
      valueGetter: (_, row) => {
        return row.population;
      },
    },
    {
      field: "studyid",
      renderHeader: () => (
        <strong>
          <p>PubMed ID</p>
        </strong>
      ),
      valueGetter: (_, row) => row.studyid.split("-")[0],
      renderCell: (params) => (
        <LinkComponent href={`https://pubmed.ncbi.nlm.nih.gov/${params.row.studyid.split("-")[0]}`} showExternalIcon>
          {params.row.studyid.split("-")[0]}
        </LinkComponent>
      ),
    },
    {
      field: "author",
      renderHeader: () => (
        <strong>
          <p>Author</p>
        </strong>
      ),
      valueGetter: (_, row) => row.author.replaceAll("_", " ")

    }, {
      field: "has_enrichment_info",
      renderHeader: () => (
        <strong>
          <p>Enrichment</p>
        </strong>
      ),
      valueGetter: (_, row) => {
        return row.has_enrichment_info;
      },

    },]
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
            setExpanded(point.label)
          }
          }
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
          data={!checked ? data.filter(d => d.label !== "Other measurement") : data}
          animation="scale"
          labelPlacement={"topLeft"}
          treemapStyle={{ padding: 8, borderRadius: 5, paddingOuter: 1 }}
        />
      </Box>
      <FormGroup>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography>Other Measurements</Typography>
          <FormControlLabel control={<Switch checked={checked} onChange={handleToggle} />} label="" />
        </Stack>
      </FormGroup>
      <Box sx={{ width: "100%", margin: "auto", mt: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
        {gwasStudyMetadata.loading && <CircularProgress />}
        {sortedCategories &&
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
                  {term} ({studies.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ height: 500, width: "100%" }}>
                  {<Table
                      showToolbar
                      rows={studies.map((s) => ({ id: s.studyid, ...s })) || []}
                      columns={studies_columns}
                      loading={gwasStudyMetadata.loading}
                      label={`${term} studies`}
                      emptyTableFallback={"No studies"}
                      divHeight={{ height: "100%", minHeight: "500px", maxHeight: "300px" }}
                      initialState={{ sorting: { sortModel: [{ field: "has_enrichment_info", sort: "desc" }] } }}
                    />}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
      </Box>
    </Box>
  );
}