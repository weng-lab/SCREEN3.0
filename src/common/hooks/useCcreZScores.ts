import type { ErrorLike } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import type { Assembly, CcreClass, CcreZScores, CcreZScoresAndGroup } from "common/types/globalTypes";
import { useMemo } from "react";

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

//This handles returning both group and MaxZ since consumers displaying Max Z also display Classification

const GET_CCRE_MAX_Z = gql(`
  query maxZ(
    $assembly: String!
    $accessions: [String!]
  ) {
    getmaxZScoresQuery(
      assembly: $assembly
      accession: $accessions
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
    ) {
      accession
      zscores
    }
  }
`)

/**
 * Format of `zscores` is:
 * [
 *   exp_accession
 *   file_accession
 *   assay
 *   biosample_value
 *   biosample_name  - null since include_biosample_details: false
 *   ontology  - null since include_biosample_details: false
 *   sample_type - null since include_biosample_details: false
 *   lifestage  - null since include_biosample_details: false
 *   score
 * ]
 */

type ZScoresEntry = [string, string, string, string, null, null, null, null, number]

const extractBiosampleZScores = (zscoresArray: ZScoresEntry[]): CcreZScores => {
  const zScores: CcreZScores = {};
  zscoresArray.forEach(experiment => {
    const assay = experiment[2]
    const score = experiment[8]
    switch (assay) {
      case "DNase": zScores.dnase = score; break;
      case "H3K4me3": zScores.h3k4me3 = score; break;
      case "H3K27ac": zScores.h3k27ac = score; break;
      case "CTCF": zScores.ctcf = score; break;
      case "ATAC": zScores.atac = score; break;
    }
  })
  return zScores
}

export const useCcreZScores = ({
  accessions,
  assembly,
  biosample,
  skip,
}: UseCcreZScoresParams): UseCcreZScoresReturn => {

  //So need to fetch z scores, tf info, and distance to TSS here

  const { data: dataMaxZ, loading: loadingMaxZ, error: errorMaxZ } = useQuery(GET_CCRE_MAX_Z, {
    variables: { accessions, assembly },
    skip: skip || biosample !== undefined,
  });

    const { data: dataBiosampleZ, loading: loadingBiosampleZ, error: errorBiosampleZ } = useQuery(GET_CCRE_BIOSAMPLE_Z, {
    variables: { accessions, assembly, biosample },
    skip: skip || biosample == undefined,
  });

  const ccreMap: UseCcreZScoresReturn["data"] = useMemo(() => {
    if (biosample) {
      if (!dataBiosampleZ) return undefined;
      return Object.fromEntries(
        dataBiosampleZ.getcCREZScoresQuery.map((entry) => [
          entry.accession,
          {
            ...extractBiosampleZScores(entry.zscores as ZScoresEntry[]),
            group: "noclass", // @TODO replace with actual classification once have tf and TSS staticly
          },
        ])
      );
    } else {
      if (!dataMaxZ) return undefined;
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
