import type { ErrorLike } from "@apollo/client";
import type { Assembly, CcreZScoresAndClass } from "common/types/globalTypes";

type UseCcreMaxZScoresParams = {
  accessions: string[];
  assembly: Assembly;
  skip?: boolean;
};

type UseCcreMaxZScoresReturn = {
  data: Record<string, CcreZScoresAndClass> | undefined;
  loading: boolean;
  error: ErrorLike | undefined;
};

//This handles returning both group and MaxZ since consumers displaying Max Z also display Classification

export const useCcreMaxZScores = ({
  accessions,
  assembly,
  skip,
}: UseCcreMaxZScoresParams): UseCcreMaxZScoresReturn => {
  void accessions;
  void assembly;
  void skip;

  // TODO: wire to getcCREZScoresQuery or getmaxZScoresQuery and normalize by accession.
  return {
    data: undefined,
    loading: false,
    error: undefined,
  };
};
