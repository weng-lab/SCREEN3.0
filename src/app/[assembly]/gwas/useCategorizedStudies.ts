import { useMemo } from "react";
import { GwasStudiesMetadata } from "common/types/generated/graphql";
import { capitalizeFirstLetter } from "common/utils";
import { subdisease_treemap } from "./gwas_tree_mappings";

export type CategoryGroup = {
  /** Grouping key. Matches the treemap node label, and is what accordion expansion is tracked by */
  term: string;
  /** Name shown in the accordion summary */
  label: string;
  /** Studies remaining after the search filter */
  studies: GwasStudiesMetadata[];
  /** Study count before the search filter was applied */
  total: number;
};

/** Groups every study under each of its parent terms — the top level treemap view */
function groupByParentTerm(studies: GwasStudiesMetadata[]): Record<string, GwasStudiesMetadata[]> {
  return studies.reduce(
    (acc, study) => {
      for (const term of study.parent_terms || []) {
        if (!acc[term]) acc[term] = [];
        acc[term].push(study);
      }
      return acc;
    },
    {} as Record<string, GwasStudiesMetadata[]>
  );
}

/** Groups studies under the layer 2 terms of a single parent category — the drilled-in treemap view */
function groupByLayer2Term(
  studies: GwasStudiesMetadata[],
  activeCategory: string
): Record<string, GwasStudiesMetadata[]> {
  // Lowercase each label once up front instead of once per study
  const labels = (subdisease_treemap?.[activeCategory]?.[0]?.children || []).map((child) => ({
    label: child.label,
    lowercased: child.label.toLowerCase(),
  }));

  const result: Record<string, GwasStudiesMetadata[]> = {};
  for (const { label } of labels) result[label] = [];

  for (const study of studies) {
    // Set lookup so each label check is constant time rather than a scan of the study's terms
    const layer2Terms = new Set(study.layer_2_terms || []);
    for (const { label, lowercased } of labels) {
      if (layer2Terms.has(lowercased)) {
        result[label].push(study);
      }
    }
  }

  return result;
}

/** `search` is expected to already be lowercased and trimmed */
function studyMatches(study: GwasStudiesMetadata, search: string): boolean {
  return Boolean(
    study.disease_trait?.toLowerCase().includes(search) ||
    study.author?.toLowerCase().includes(search) ||
    study.population?.toLowerCase().includes(search) ||
    study.studyid?.toLowerCase().includes(search)
  );
}

/**
 * Buckets studies into the categories shown by the treemap currently in view, then applies the search
 * filter. A category whose own name matches the search keeps all of its studies. Categories the search
 * empties out are kept in the list, and render as disabled accordions showing their unfiltered total.
 */
export function useCategorizedStudies(
  studies: GwasStudiesMetadata[] | undefined,
  activeCategory: string | null,
  search: string
): CategoryGroup[] {
  const normalizedSearch = search.toLowerCase().trim();

  const grouped: CategoryGroup[] = useMemo(() => {
    if (!studies) return [];

    const groups = activeCategory ? groupByLayer2Term(studies, activeCategory) : groupByParentTerm(studies);

    return Object.entries(groups)
      .map(([term, termStudies]) => ({
        term,
        // Layer 2 terms come through lowercased, parent terms are already display ready
        label: activeCategory ? capitalizeFirstLetter(term) : term,
        studies: termStudies,
        total: termStudies.length,
      }))
      .sort((a, b) => b.total - a.total);
  }, [studies, activeCategory]);

  return useMemo(() => {
    if (!normalizedSearch) return grouped;

    return grouped
      .map((group) =>
        group.term.toLowerCase().includes(normalizedSearch)
          ? group
          : { ...group, studies: group.studies.filter((study) => studyMatches(study, normalizedSearch)) }
      )
      .sort((a, b) => {
        const aMatches = a.studies.length;
        const bMatches = b.studies.length;

        // Categories with matches first, then by match count descending
        if (aMatches > 0 && bMatches === 0) return -1;
        if (aMatches === 0 && bMatches > 0) return 1;
        return bMatches - aMatches;
      });
  }, [grouped, normalizedSearch]);
}
