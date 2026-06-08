import type { ErrorLike } from "@apollo/client";
import type { Assembly, CcreClass } from "common/types/globalTypes";

type CcreBiosampleActivityRow = {
  name?: string;
  displayname: string;
  sampleType?: string;
  lifeStage?: string;
  ontology: string;
  tf?: string;

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

  collection: "core" | "partial" | "ancillary";
  group: CcreClass
};

type UseBiosampleActivityParams = {
  accession: string;
  assembly: Assembly;
  skip?: boolean;
};

type UseBiosampleActivityReturn = {
  data: CcreBiosampleActivityRow[] | undefined;
  loading: boolean;
  error: ErrorLike | undefined;
};

/**
 * This hook owns fetching biosample metadata, biosample z scores, assigning biosample collection, and celltype-specific classification
 */
export const useBiosampleActivity = ({
  accession,
  assembly,
  skip,
}: UseBiosampleActivityParams): UseBiosampleActivityReturn => {
  void accession;
  void assembly;
  void skip;

  // @todo fetch all biosample info with getcCREZScoresQuery. Reuse ZScoresEntry and create something like extractBiosampleZScores but for all metadata
  // @todo fetch tf info using getcCRETFQuery
  // @todo fetch distance from cCRE to TSS using either dumb region search or with any newly available return data from Nishi
  // @todo move collection assignment here
  // @todo move cCRE classification in biosample here

  // TODO: wire to getcCREZScoresQuery and move BiosampleActivity row shaping here.
  // This hook should own sample collection and cCRE classification logic for that page.
  return {
    data: undefined,
    loading: false,
    error: undefined,
  };
};
