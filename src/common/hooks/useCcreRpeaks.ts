import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";
import { GetcCrerPeaksDataQuery } from "common/types/generated/graphql";

export type useCcreRpeaksParams = {
  accession: string[],
  assembly: string
}

const cCRERPeaksDataQuery = gql(`
query getcCRERPeaksData($accession: [String]!) {
  getcCRERPeaksQuery(accession: $accession) {
    rpeak_id
    rpeak_chromosome
    rpeak_start
    rpeak_stop
    tf
    tf_number
    decorator_stop
    decorator_start
    decorator_chromosome
    decorator_tf_number
    strand
  }
}
`)

export type useCcreRpeaksReturn = { data: GetcCrerPeaksDataQuery['getcCRERPeaksQuery'] | undefined; loading: boolean; error: ApolloError }

export function useCcreRpeaks({ accession, assembly }: useCcreRpeaksParams) {
  const { data, loading, error } = useQuery(cCRERPeaksDataQuery, {
    variables: { accession: accession },
    skip: !accession ||  (accession && accession.length ===0) || (assembly==="mm10"),
  });

  return {
    data: data?.getcCRERPeaksQuery,
    loading,
    error,
  } as useCcreRpeaksReturn;
}