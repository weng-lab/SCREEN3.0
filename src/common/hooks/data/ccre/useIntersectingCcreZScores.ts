import type { ErrorLike } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import type { Assembly, CcreClass, CcreZScores, GenomicRange } from "common/types/globalTypes";
import { useEffect, useMemo, useRef } from "react";
import { classifyCcre } from "common/ccre";
import { parseZScoresArray, ZScoresEntry } from "common/ccre";

export type UseIntersectingCcreZScoresParams = {
  assembly: Assembly;
  coordinates?: GenomicRange[] | null;
  biosample?: string;
  skip?: boolean;
};

export type IntersectingCcreZScore = CcreZScores & {
  accession: string;
  coordinates: GenomicRange;
  group: CcreClass;
};

export type UseIntersectingCcreZScoresReturn = {
  data: IntersectingCcreZScore[] | undefined;
  rowsLoading: boolean;
  scoresLoading: boolean;
  error: ErrorLike | undefined;
};

const GET_INTERSECTING_CCRE_Z_SCORES = gql(`
  query intersectingCcreZScores(
    $assembly: String!
    $coordinates: [GenomicRangeInput]
    $biosample: [String]
  ) {
    getcCREZScoresQuery(
      assembly: $assembly
      coordinates: $coordinates
      biosample_value: $biosample
      include_biosample_details: false
      nearbygeneslimit: 1
    ) {
      accession
      chromosome
      start
      stop
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
`);

export const useIntersectingCcreZScores = ({
  assembly,
  coordinates,
  biosample,
  skip,
}: UseIntersectingCcreZScoresParams): UseIntersectingCcreZScoresReturn => {
  const shouldSkip = skip || !coordinates?.length;

  const {
    data,
    previousData,
    loading,
    error,
  } = useQuery(GET_INTERSECTING_CCRE_Z_SCORES, {
    variables: { assembly, coordinates, biosample: biosample ? [biosample] : [] },
    skip: shouldSkip,
    notifyOnNetworkStatusChange: true,
  });

  const regionKey = useMemo(() => JSON.stringify({ assembly, coordinates }), [assembly, coordinates]);
  const lastDataRegionKey = useRef(regionKey);

  useEffect(() => {
    if (data) lastDataRegionKey.current = regionKey;
  }, [data, regionKey]);

  const canUsePreviousData = lastDataRegionKey.current === regionKey;
  const displayData = data ?? (canUsePreviousData ? previousData : undefined);

  const ccreRows: UseIntersectingCcreZScoresReturn["data"] = useMemo(() => {
    if (!displayData?.getcCREZScoresQuery?.length) return undefined;

    return displayData.getcCREZScoresQuery.flatMap((entry) => {
      if (!entry?.accession || !entry.chromosome || entry.start == null || entry.stop == null) return [];

      const distance = entry.midccre_nearestgenes?.[0]?.distance ?? Infinity;
      const zScores = biosample && entry.zscores?.length
        ? parseZScoresArray(entry.zscores as ZScoresEntry<null>[])
        : undefined;

      return [
        {
          accession: entry.accession,
          coordinates: {
            chromosome: entry.chromosome,
            start: entry.start,
            end: entry.stop,
          },
          dnase: zScores?.dnase ?? entry.dnase_max_zscore,
          atac: zScores?.atac ?? entry.atac_max_zscore,
          h3k4me3: zScores?.h3k4me3 ?? entry.h3k4me3_max_zscore,
          h3k27ac: zScores?.h3k27ac ?? entry.h3k27ac_max_zscore,
          ctcf: zScores?.ctcf ?? entry.ctcf_max_zscore,
          group: zScores ? classifyCcre(zScores, zScores.tf, distance) : (entry.ccre_group as CcreClass),
        },
      ];
    });
  }, [biosample, displayData]);

  return {
    data: ccreRows,
    rowsLoading: loading && !displayData,
    scoresLoading: loading && !!displayData,
    error,
  };
};
