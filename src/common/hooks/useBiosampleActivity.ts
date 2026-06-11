import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { gql } from "common/types/generated";
import { classifyCcre } from "common/utility";
import type { Assembly, CcreClass, CcreZScoresAndGroup } from "common/types/globalTypes";

type CcreBiosampleActivityRow = {
  // sample metadata
  name: string;
  displayname: string;
  sampleType: string;
  lifeStage: string;
  ontology: string;

  // tf into
  tf?: string;

  // assays
  dnaseExpAccession?: string;
  dnaseFileAccession?: string;
  dnaseZ?: number;

  atacExpAccession?: string;
  atacFileAccession?: string;
  atacZ?: number;

  h3k4me3ExpAccession?: string;
  h3k4me3FileAccession?: string;
  h3k4me3Z?: number;

  h3k27acExpAccession?: string;
  h3k27acFileAccession?: string;
  h3k27acZ?: number

  ctcfExpAccession?: string;
  ctcfFileAccession?: string;
  ctcfZ?: number

  // derived from assays + tf + distance to TSS
  collection: "core" | "partial" | "ancillary";
  group: CcreClass
};

type UseBiosampleActivityParams = {
  accession: string;
  assembly: Assembly;
  skip?: boolean;
};

const GET_CCRE_BIOSAMPLE_INFO = gql(`
  query GetcCREZScoresQuery($assembly: String!, $accession: String!) {
    getcCREZScoresQuery(assembly: $assembly, accession: [$accession], nearbygeneslimit: 1, include_biosample_details: true) {
      dnase_max_zscore
      h3k4me3_max_zscore
      h3k27ac_max_zscore
      ctcf_max_zscore
      atac_max_zscore
      ccre_group
      midccre_nearestgenes {
        distance
      }
      zscores
    }
  }
`)

type DetailedZScoresEntry = [
  string, // 0 experiment_accession
  string, // 1 file_accession
  string, // 2 assay
  string, // 3 biosample name (internal, used as the grouping key)
  string, // 4 biosample displayname
  string, // 5 ontology
  string, // 6 sample_type
  string, // 7 lifestage
  number, // 8 score
  "yes" | "no" | "na" // 9 tf
];

/**
 * Groups the cross-biosample `zscores` array (one entry per biosample+assay) into one row per
 * biosample, collapsing each assay's score/accessions, then classifies and assigns the collection
 * with the same logic as useCcreZScores / BiosampleActivity.
 */
const parseBiosampleRows = (
  zscores: DetailedZScoresEntry[],
  distanceToTSS: number
): CcreBiosampleActivityRow[] => {

  // Experiments not run through the ENCODE pipeline come back with fileAccession "NA" and a junk
  // fallback score (-10). Treat them as nonexistent. Filtering before grouping means a biosample
  // whose only experiment is invalid drops out entirely, while one with other valid assays just
  // loses that assay.
  const byBiosample = new Map<string, DetailedZScoresEntry[]>();
  for (const entry of zscores) {
    if (entry[1] === "NA") continue;
    const name = entry[3];
    const group = byBiosample.get(name);
    if (group) group.push(entry);
    else byBiosample.set(name, [entry]);
  }

  return Array.from(byBiosample.values()).map((entries) => {
    const [first] = entries;

    const row: CcreBiosampleActivityRow = {
      name: first[3],
      displayname: first[4],
      ontology: first[5],
      sampleType: first[6],
      lifeStage: first[7],
      tf: first[9],
      collection: "ancillary", // set properly below
      group: "noclass", // set properly below
    };

    for (const exp of entries) {
      const expAccession = exp[0];
      const fileAccession = exp[1];
      const score = exp[8];
      switch (exp[2]) {
        case "DNase":
          row.dnaseZ = score; row.dnaseExpAccession = expAccession; row.dnaseFileAccession = fileAccession; break;
        case "ATAC":
          row.atacZ = score; row.atacExpAccession = expAccession; row.atacFileAccession = fileAccession; break;
        case "H3K4me3":
          row.h3k4me3Z = score; row.h3k4me3ExpAccession = expAccession; row.h3k4me3FileAccession = fileAccession; break;
        case "H3K27ac":
          row.h3k27acZ = score; row.h3k27acExpAccession = expAccession; row.h3k27acFileAccession = fileAccession; break;
        case "CTCF":
          row.ctcfZ = score; row.ctcfExpAccession = expAccession; row.ctcfFileAccession = fileAccession; break;
      }
    }

    row.group = classifyCcre(
      { dnase: row.dnaseZ, atac: row.atacZ, h3k4me3: row.h3k4me3Z, h3k27ac: row.h3k27acZ, ctcf: row.ctcfZ },
      first[9] === "yes",
      distanceToTSS
    );

    // Mirrors BiosampleActivity: no DNase → ancillary; DNase + all three marks → core; otherwise partial.
    // Absence of an assay is `undefined` here rather than the old -11 sentinel.
    row.collection =
      row.dnaseZ === undefined
        ? "ancillary"
        : row.ctcfZ !== undefined && row.h3k27acZ !== undefined && row.h3k4me3Z !== undefined
          ? "core"
          : "partial";

    return row;
  });
};

/**
 * This hook owns fetching biosample metadata, biosample z scores, assigning biosample collection, and celltype-specific classification
 */
export const useBiosampleActivity = ({
  accession,
  assembly,
  skip,
}: UseBiosampleActivityParams) => {
  const { data, loading, error } = useQuery(GET_CCRE_BIOSAMPLE_INFO, { variables: { accession, assembly }, skip });

  const d = data?.getcCREZScoresQuery.length ? data?.getcCREZScoresQuery[0] : undefined

  const celltypeAgnosticRow: CcreZScoresAndGroup = d
    ? {
        dnase: d.dnase_max_zscore,
        h3k4me3: d.h3k4me3_max_zscore,
        h3k27ac: d.h3k27ac_max_zscore,
        ctcf: d.ctcf_max_zscore,
        atac: d.atac_max_zscore,
        group: d.ccre_group as CcreClass,
      }
    : undefined;

  const biosampleRows = useMemo(() => {
    const entry = data?.getcCREZScoresQuery?.[0];
    if (!entry) return undefined;
    const distance = entry.midccre_nearestgenes[0].distance;
    return parseBiosampleRows(entry.zscores as DetailedZScoresEntry[], distance);
  }, [data]);

  return {
    biosampleRows,
    celltypeAgnosticRow,
    loading,
    error,
  };
};
