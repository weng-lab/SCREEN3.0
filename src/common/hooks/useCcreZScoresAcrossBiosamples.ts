import type { ErrorLike } from "@apollo/client";
import type { Assembly, CcreClass, CcreZScores } from "common/types/globalTypes";

type CcreZScoreExperimentAccessions = {
  dnaseAccession?: string;
  atacAccession?: string;
  h3k4me3Accession?: string;
  h3k27acAccession?: string;
  ctcfAccession?: string;
};

type CcreBiosampleZScores = CcreZScores & CcreZScoreExperimentAccessions;

export type CcreBiosampleActivityRow = CcreBiosampleZScores & {
  name?: string;
  displayname: string;
  sampleType?: string;
  lifeStage?: string;
  ontology: string;
  class: CcreClass;
  collection: "core" | "partial" | "ancillary";
  tf?: string;
};

type UseCcreZScoresAcrossBiosamplesParams = {
  accession: string;
  assembly: Assembly;
  skip?: boolean;
};

type UseCcreZScoresAcrossBiosamplesReturn = {
  data: CcreBiosampleActivityRow[] | undefined;
  loading: boolean;
  error: ErrorLike | undefined;
};

/**
 * Opinionated return made for BiosampleActivity
 */
export const useCcreZScoresAcrossBiosamples = ({
  accession,
  assembly,
  skip,
}: UseCcreZScoresAcrossBiosamplesParams): UseCcreZScoresAcrossBiosamplesReturn => {
  void accession;
  void assembly;
  void skip;

  // TODO: wire to getcCREZScoresQuery and move BiosampleActivity row shaping here.
  // This hook should own sample collection and cCRE classification logic for that page.
  return {
    data: undefined,
    loading: false,
    error: undefined,
  };
};
