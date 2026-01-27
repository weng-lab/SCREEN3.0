import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { GetcCreConservationDataQuery } from "common/types/generated/graphql";

export type usecCREConservationDataParams = {
  accession: string[],
  assembly: string
}

const cCREConservationData_Query = gql(`
query getcCREConservationData($accession: [String]!){
 	getcCREConservationDataQuery(accession: $accession) {  
    primates_43_phylop
    mammals_241_phylop
    vertebrates_100_phylop    
    primates_43_phastcons
    vertebrates_100_phastcons
    mammals_241_phastcons      
    mammals
    primates
    vertebrates
  }
}
`)

export type usecCREConservationDataReturn = { data: GetcCreConservationDataQuery['getcCREConservationDataQuery'] | undefined; loading: boolean; error: ApolloError }

export function useConservationData({ accession, assembly }: usecCREConservationDataParams) {
  const { data, loading, error } = useQuery(cCREConservationData_Query, {
    variables: { accession: accession },
    skip: !accession || (accession && accession.length ===0) || (assembly==="mm10"),
  });

  return {
    data: data?.getcCREConservationDataQuery,
    loading,
    error,
  } as usecCREConservationDataReturn;
}