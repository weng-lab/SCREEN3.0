import type { ErrorLike } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import type { Assembly, CcreClass, CcreZScoresAndGroup } from "common/types/globalTypes";
import { useEffect, useMemo, useRef } from "react";
import { classifyCcre } from "common/ccre";
import { parseZScoresArray, ZScoresEntry } from "common/ccre";

type UseCcreZScoresParams = {
  accessions: string[];
  assembly: Assembly;
  biosample?: string;
  skip?: boolean;
};

type UseCcreZScoresReturn = {
  data: Record<string, CcreZScoresAndGroup> | undefined;
  loading: boolean;
  error: ErrorLike | undefined;
};

const GET_CCRE_Z_SCORES = gql(`
  query ccreZScores(
    $assembly: String!
    $accessions: [String!]
    $biosample: [String]
  ) {
    getcCREZScoresQuery(
      assembly: $assembly
      accession: $accessions
      biosample_value: $biosample
      include_biosample_details: false
      nearbygeneslimit: 1
    ) {
      accession
      ccre_group
      h3k4me3_max_zscore
      h3k27ac_max_zscore
      dnase_max_zscore
      ctcf_max_zscore
      atac_max_zscore
      midccre_nearestgenes {
        distance
      }
      zscores
    }
  }
`)

export const useCcreZScores = ({
  accessions,
  assembly,
  biosample,
  skip,
}: UseCcreZScoresParams): UseCcreZScoresReturn => {
  const {
    data,
    previousData,
    loading,
    error,
  } = useQuery(GET_CCRE_Z_SCORES, {
    variables: { accessions, assembly, biosample: biosample ? [biosample] : [] },
    skip: skip || accessions.length === 0,
    notifyOnNetworkStatusChange: true,
  });

  const queryKey = useMemo(() => JSON.stringify({ assembly, accessions }), [assembly, accessions]);
  const lastDataQueryKey = useRef(queryKey);

  useEffect(() => {
    if (data) lastDataQueryKey.current = queryKey;
  }, [data, queryKey]);

  const canUsePreviousData = lastDataQueryKey.current === queryKey;
  const displayData = data ?? (canUsePreviousData ? previousData : undefined);

  const ccreMap: UseCcreZScoresReturn["data"] = useMemo(() => {
    if (!displayData?.getcCREZScoresQuery?.length) return undefined;

    return Object.fromEntries(
      displayData.getcCREZScoresQuery.flatMap((entry) => {
        if (!entry?.accession) return [];

        const distance = entry.midccre_nearestgenes?.[0]?.distance ?? Infinity;
        const zScores = biosample && entry.zscores?.length
          ? parseZScoresArray(entry.zscores as ZScoresEntry<null>[])
          : undefined;

        return [
          [
            entry.accession,
            {
              dnase: zScores?.dnase ?? entry.dnase_max_zscore,
              atac: zScores?.atac ?? entry.atac_max_zscore,
              h3k4me3: zScores?.h3k4me3 ?? entry.h3k4me3_max_zscore,
              h3k27ac: zScores?.h3k27ac ?? entry.h3k27ac_max_zscore,
              ctcf: zScores?.ctcf ?? entry.ctcf_max_zscore,
              group: zScores ? classifyCcre(zScores, zScores.tf, distance) : (entry.ccre_group as CcreClass),
            },
          ],
        ];
      })
    );
  }, [biosample, displayData]);

  return {
    data: ccreMap,
    loading,
    error,
  };
};
