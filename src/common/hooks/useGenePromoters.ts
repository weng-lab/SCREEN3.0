import { useQuery } from "@apollo/client/react";
import type { ErrorLike } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { GetGenePromoterDataQuery } from "common/types/generated/graphql";

export type useGenePromotersDataParams = {
  geneid: string[],
}

const genePromoterData_Query = gql(`
query getGenePromoterData($geneid: [String]){
    genePromoterQuery(geneid: $geneid) {  
    chromosome
    stop
    start
    ccre_group
    accession
  }
}
`)

export type useGenePromotersDataReturn = { data: GetGenePromoterDataQuery['genePromoterQuery'] | undefined; loading: boolean; error: ErrorLike }

export function useGenePromotersData({ geneid }: useGenePromotersDataParams) {
  const { data, loading, error } = useQuery(genePromoterData_Query, {
    variables: { geneid: geneid },
    skip: !geneid || (geneid && geneid.length ===0) ,
  });

  return {
    data: data?.genePromoterQuery,
    loading,
    error,
  } as useGenePromotersDataReturn;
}