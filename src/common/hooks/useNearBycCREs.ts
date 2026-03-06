import { gql, useQuery } from "@apollo/client";
import { Transcript } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_cCREs/DistanceLinkedCcres";
import { useMemo } from "react";
import { Assembly } from "common/types/globalTypes";
import { UseGeneDataReturn } from "./useGeneData";

const CCRE_ICRE_QUERY = gql(`query cCREAutocompleteQuery(
  $accession: [String!]
  $assembly: String!
  $includeiCREs: Boolean  
) {
  cCREAutocompleteQuery(
    includeiCREs: $includeiCREs
    assembly: $assembly    
    accession: $accession
  ) {    
    accession
    isiCRE

  }
}`);

export default function useNearbycCREs(
  geneData: UseGeneDataReturn<{ name: string; assembly: Assembly }>,
  method: string,
  assembly: Assembly,
  distance: number
) {
  //coordiantes used to determine nearby ccres if method is not 3 closest genes
  const regions: Coordinate[] = useMemo(() => {
    if (!geneData.data) return [];

    if (method === "tss") {
      return getRegions(geneData.data.transcripts, distance);
    } else if (method === "body") {
      const { __typename, ...coords } = geneData.data.coordinates;
      return [coords];
    } else {
      return [];
    }
  }, [geneData, distance, method]);

  const { data: regionCcreData, loading: regionCcreLoading } = useQuery(CCRE_RANGE_QUERY, {
    variables: {
      assembly,
      coordinates: regions,
    },
    skip: regions.length === 0 || method === "3gene",
  });

  const {
    data: nearbyGeneData,
    loading: nearbyGeneLoading,
    error,
  } = useQuery(NEAR_BY_CCRES_QUERY, {
    variables: { geneid: [geneData.data?.id.split(".")[0]] },
    skip: !geneData.data || method !== "3gene",
  });

  const accessions =
    method === "3gene"
      ? [...new Set(nearbyGeneData?.closestGenetocCRE.map((l) => l.ccre))]
      : [...new Set(regionCcreData?.cCRESCREENSearch.map((l) => l.info.accession))];

  const { data: ccredata } = useQuery(CCRE_ICRE_QUERY, {
    variables: {
      assembly,
      includeiCREs: true,
      accession: accessions,
    },
    skip: method === "3gene" ? nearbyGeneLoading || !nearbyGeneData : regionCcreLoading || !regionCcreData,
  });

  const cCREDetails: { [key: string]: boolean } = {};
  if (ccredata?.cCREAutocompleteQuery?.length > 0) {
    ccredata.cCREAutocompleteQuery.forEach((c) => {
      cCREDetails[c.accession] = c.isiCRE;
    });
  }

  let results: NearBycCREs[] = [];

  if (method === "3gene" && nearbyGeneData) {
    results = Object.values(
      nearbyGeneData.closestGenetocCRE.reduce((acc, obj) => ({ ...acc, [obj.ccre]: obj }), {})
    ).map((l: any) => ({
      ...l,
      isiCRE: cCREDetails[l.ccre] ?? false,
    }));
  } else if (regionCcreData) {
    results = regionCcreData.cCRESCREENSearch.map((entry: any) => ({
      ...entry,
      ccre: entry.info.accession,
      isiCRE: cCREDetails[entry.info.accession] ?? false,
    }));
  }

  return {
    data: results as NearBycCREs[],
    loading: method === "3gene" ? nearbyGeneLoading : regionCcreLoading,
    error,
  };
}

export type NearBycCREs = {
  isiCRE?: boolean;
  group?: string;
  stop?: number;
  start?: number;
  chromosome?: string;
  ccre?: string;
};

type Coordinate = {
  chromosome: string;
  start: number;
  end: number;
};

function getRegions(transcripts: Transcript[], distance: number): Coordinate[] {
  if (transcripts.length === 0) return [];

  return transcripts.map((t) => {
    const tss = t.strand === "+" ? t.coordinates.start : t.coordinates.end;
    return {
      chromosome: t.coordinates.chromosome,
      start: Math.max(0, tss - distance), // prevent negative start
      end: tss + distance,
    };
  });
}

const NEAR_BY_CCRES_QUERY = gql(`
query getclosestGenetocCRE($geneid: [String],$ccre: [String]) {
  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {
     gene {
      chromosome
      stop
      start
      name
      type
    }
    ccre
    chromosome
    stop
    start
  }
}
  `);

const CCRE_RANGE_QUERY = gql(`
    query cCREQuery(
      $assembly: String!
      $coordinates: [GenomicRangeInput]
    ) {
      cCRESCREENSearch(
        assembly: $assembly
        coordinates: $coordinates
      ) {
        chrom
        start
        len
        pct
        info {
          accession
        }
        ctcf_zscore
        dnase_zscore
        enhancer_zscore
        promoter_zscore
        atac_zscore
        nearestgenes {
          gene        
          distance
        }
        ctspecific {
          ct
          dnase_zscore
          h3k4me3_zscore
          h3k27ac_zscore
          ctcf_zscore
          atac_zscore
        }  
      }
    }
  `);
