import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { FetchDynamicEnhancersQuery } from "common/types/generated/graphql";

export type useDynamicEnhancersDataParams = {
  accession: string[],
  assembly: string
}

const DynamicEnhancers_Query = gql(`
query fetchDynamicEnhancers($accession: [String]!) {  
  dynamicEnhancersQuery(accession: $accession) {
    celltype
    accession
  }
}
`)

export type useDynamicEnhancersDataReturn = { data: FetchDynamicEnhancersQuery['dynamicEnhancersQuery'] | undefined; loading: boolean; error: ApolloError }

export function useDynamicEnhancersData({ accession, assembly }: useDynamicEnhancersDataParams) {
  const { data, loading, error } = useQuery(DynamicEnhancers_Query, {
    variables: { accession: accession },
    skip: !accession || (assembly==="mm10"),
  });

  return {
    data: data?.dynamicEnhancersQuery,
    loading,
    error,
  } as useDynamicEnhancersDataReturn;
}