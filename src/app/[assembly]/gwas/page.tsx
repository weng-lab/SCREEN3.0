"use client";
import { Box } from "@mui/material";
import { TreemapNode } from "@weng-lab/visualization";
import { useAllGWASStudies } from "common/hooks/data/gwas";
import { useCallback, useState } from "react";
import CategoryAccordion from "./CategoryAccordion";
import GWASLandingHeader from "./GWASLandingHeader";
import GWASTreemap from "./GWASTreemap";
import StudySearchBar from "./StudySearchBar";
import { ParentTermMetadata } from "./gwas_tree_mappings";
import { useCategorizedStudies } from "./useCategorizedStudies";

/** Categories with no subdisease treemap to drill into */
const terminalCategories = ["Other disease", "Other trait", "Other measurement"];

export default function GWASLandingPage() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allStudies = useAllGWASStudies({
    parent_terms: activeCategory ? [activeCategory] : undefined,
  });

  const categories = useCategorizedStudies(allStudies.data, activeCategory, search);

  const onNodeClicked = useCallback(
    (node: TreemapNode<ParentTermMetadata>) => {
      const label = node.label;

      // Clicking a top level category drills into it, anything deeper opens that category's studies
      if (!activeCategory && !terminalCategories.includes(label)) {
        setActiveCategory(label);
        setExpanded(false);
        return;
      }
      setExpanded(label);
    },
    [activeCategory]
  );

  const backToGWASHome = () => {
    setActiveCategory(null);
    setExpanded(false);
  };

  return (
    <Box sx={{ marginX: "5%", marginY: 2 }}>
      <GWASLandingHeader activeCategory={activeCategory} backToGWASHome={backToGWASHome} />

      <GWASTreemap activeCategory={activeCategory} onNodeClicked={onNodeClicked} />

      <Box sx={{ width: "100%", margin: "auto", mt: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
        <StudySearchBar
          search={search}
          onSearchChange={setSearch}
          activeCategory={activeCategory}
          loading={allStudies.loading}
        />

        {categories.map((category) => (
          <CategoryAccordion
            key={category.term}
            category={category}
            expanded={expanded === category.term}
            onChange={(isExpanded) => setExpanded(isExpanded ? category.term : false)}
            loading={allStudies.loading}
          />
        ))}
      </Box>
    </Box>
  );
}
