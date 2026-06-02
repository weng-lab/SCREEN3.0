import type { ErrorLike } from "@apollo/client";
import type { Assembly, CcreZScoresAndClass } from "common/types/globalTypes";

type UseCcreBiosampleZScoresParams = {
  accessions: string[];
  assembly: Assembly;
  biosample: string | undefined;
  skip?: boolean;
};

type UseCcreBiosampleZScoresReturn = {
  data: Record<string, CcreZScoresAndClass> | undefined;
  loading: boolean;
  error: ErrorLike | undefined;
};

export const useCcreBiosampleZScores = ({
  accessions,
  assembly,
  biosample,
  skip,
}: UseCcreBiosampleZScoresParams): UseCcreBiosampleZScoresReturn => {
  void accessions;
  void assembly;
  void biosample;
  void skip;

  // TODO: wire to getcCREZScoresQuery with biosample filtering and normalize by accession.
  return {
    data: undefined,
    loading: false,
    error: undefined,
  };
};
