import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { GridInitialState } from "@mui/x-data-grid-premium";
import { Table } from "@weng-lab/ui-components";
import { useEffect, useMemo, useRef } from "react";
import { studiesColumns } from "./columns";
import { CategoryGroup } from "./useCategorizedStudies";

const summarySx = {
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
};

const disabledSummarySx = { opacity: 0.4, pointerEvents: "none" };

const tableDivHeight = { height: "100%", minHeight: "500px", maxHeight: "300px" };

const tableInitialState: GridInitialState = {
  sorting: { sortModel: [{ field: "has_enrichment_info", sort: "asc" }] },
};

type CategoryAccordionProps = {
  category: CategoryGroup;
  expanded: boolean;
  onChange: (expanded: boolean) => void;
  loading: boolean;
};

export default function CategoryAccordion({ category, expanded, onChange, loading }: CategoryAccordionProps) {
  const { term, label, studies, total } = category;
  const ref = useRef<HTMLDivElement>(null);
  const isEmpty = studies.length === 0;

  // Bring the opened category into view, including when the treemap is what opened it
  useEffect(() => {
    if (expanded) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);

  const rows = useMemo(() => studies.map((s) => ({ id: s.studyid, ...s })), [studies]);

  return (
    <Accordion
      ref={ref}
      expanded={expanded}
      onChange={(_, isExpanded) => onChange(isExpanded)}
      disabled={isEmpty}
      slotProps={{ transition: { unmountOnExit: true } }}
      disableGutters
    >
      <AccordionSummary expandIcon={<KeyboardArrowRightIcon />} sx={[summarySx, isEmpty && disabledSummarySx]}>
        <Typography variant="h6">
          {label} ({studies.length.toLocaleString()}
          {/* Only differs from the total while the search is filtering this category down */}
          {studies.length !== total && (
            <>
              {" "}
              <span style={{ textDecoration: "line-through", opacity: 0.6 }}>{total.toLocaleString()}</span>
            </>
          )}
          )
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ height: 500, width: "100%" }}>
          <Table
            showToolbar
            rows={rows}
            columns={studiesColumns}
            loading={loading}
            label={`${term} studies`}
            emptyTableFallback={"No studies"}
            divHeight={tableDivHeight}
            initialState={tableInitialState}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
