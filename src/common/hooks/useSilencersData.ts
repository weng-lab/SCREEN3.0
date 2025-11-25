import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { SilencersQueryQuery } from "common/types/generated/graphql";

export type useSilencersDataParams = {
  accession: string[],
  assembly: string
}

const Silencers_Query = gql(`
query silencersQuery($accession: [String]!){
  silencersQuery(accession: $accession){
   silencer_studies
  }
}
`)

export type useSilencersDataReturn = { data: SilencersQueryQuery['silencersQuery'] | undefined; loading: boolean; error: ApolloError }

export function useSilencersData({ accession, assembly }: useSilencersDataParams) {
  const { data, loading, error } = useQuery(Silencers_Query, {
    variables: { accession: accession },
    skip: !accession || (assembly==="mm10"),
  });

  return {
    data: data?.silencersQuery,
    loading,
    error,
  } as useSilencersDataReturn;
}