import type { ErrorLike } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import type { Assembly, CcreClass, CcreZScores, CcreZScoresAndGroup } from "common/types/globalTypes";
import { useMemo } from "react";
import { classifyCcre } from "common/utility";

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

const GET_CCRE_MAX_Z = gql(`
  query maxZ(
    $assembly: String!
    $accessions: [String!]
  ) {
    getmaxZScoresQuery(
      assembly: $assembly
      accession: $accessions
      nearbygeneslimit: 1
    ) {
      accession
      ccre_group
      h3k4me3_max_zscore
      h3k27ac_max_zscore
      dnase_max_zscore
      ctcf_max_zscore
      atac_max_zscore
    }
  }
`)

const GET_CCRE_BIOSAMPLE_Z = gql(`
  query BiosampleZ(
    $assembly: String!
    $accessions: [String!]
    $biosample: [String]
  ) {
    getcCREZScoresQuery(
      assembly: $assembly
      biosample_value: $biosample
      accession: $accessions
      include_biosample_details: false
      nearbygeneslimit: 1
    ) {
      accession
      midccre_nearestgenes {
        distance
      }
      zscores
    }
  }
`)

export type ZScoresEntry<Details extends string | null = string | null> = [
  string,              // 0 experiment_accession
  string,              // 1 file_accession
  string,              // 2 assay
  string,              // 3 biosample name (internal, used as the grouping key)
  Details,             // 4 biosample displayname
  Details,             // 5 ontology
  Details,             // 6 sample_type
  Details,             // 7 lifestage
  number,              // 8 score
  "yes" | "no" | "na", // 9 tf
];

const parseZScoresArray = (zScoresArray: ZScoresEntry<null>[]) => {
  const zScoresAndTf: CcreZScores & { tf: boolean } = { tf: zScoresArray[0][9] === "yes" };
  zScoresArray.forEach((experiment) => {
    const assay = experiment[2];
    const score = experiment[8];
    switch (assay) {
      case "DNase":
        zScoresAndTf.dnase = score;
        break;
      case "H3K4me3":
        zScoresAndTf.h3k4me3 = score;
        break;
      case "H3K27ac":
        zScoresAndTf.h3k27ac = score;
        break;
      case "CTCF":
        zScoresAndTf.ctcf = score;
        break;
      case "ATAC":
        zScoresAndTf.atac = score;
        break;
    }
  });
  return zScoresAndTf;
};

export const useCcreZScores = ({
  accessions,
  assembly,
  biosample,
  skip,
}: UseCcreZScoresParams): UseCcreZScoresReturn => {
  
  // used if no biosample is passed
  const {
    data: dataMaxZ,
    loading: loadingMaxZ,
    error: errorMaxZ,
  } = useQuery(GET_CCRE_MAX_Z, {
    variables: { accessions, assembly },
    skip: skip || biosample !== undefined,
  });

  // used if biosample is passed
  const {
    data: dataBiosampleZ,
    loading: loadingBiosampleZ,
    error: errorBiosampleZ,
  } = useQuery(GET_CCRE_BIOSAMPLE_Z, {
    variables: { accessions, assembly, biosample },
    skip: skip || biosample === undefined,
  });

  const ccreMap: UseCcreZScoresReturn["data"] = useMemo(() => {
    if (biosample) {
      if (!dataBiosampleZ?.getcCREZScoresQuery.length) return undefined;
      return Object.fromEntries(
        dataBiosampleZ.getcCREZScoresQuery.map((entry) => {
          const {tf, ...zScores} = parseZScoresArray(entry.zscores as ZScoresEntry<null>[])
          const distance = entry.midccre_nearestgenes[0].distance
          const group = classifyCcre(zScores, tf, distance)

          return [
            entry.accession,
            {
              ...zScores,
              group,
            },
          ];
        })
      );
    } else {
      if (!dataMaxZ?.getmaxZScoresQuery.length) return undefined;
      return Object.fromEntries(
        dataMaxZ.getmaxZScoresQuery.map((entry) => [
          entry.accession,
          {
            dnase: entry.dnase_max_zscore,
            atac: entry.atac_max_zscore,
            h3k4me3: entry.h3k4me3_max_zscore,
            h3k27ac: entry.h3k27ac_max_zscore,
            ctcf: entry.ctcf_max_zscore,
            group: entry.ccre_group as CcreClass,
          },
        ])
      );
    }
  }, [dataMaxZ, dataBiosampleZ]);

  return {
    data: ccreMap,
    loading: loadingMaxZ || loadingBiosampleZ,
    error: errorMaxZ || errorBiosampleZ,
  };
};
