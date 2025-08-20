import { gql } from "types/generated";
import { GetcCreBiosampleMetadataQueryQuery } from "types/generated/graphql";
import { ApolloError, useQuery } from "@apollo/client";

const CCRE_BIOSAMPLE_QUERY = gql(`
  query GetcCreBiosampleMetadataQuery($assembly: String!) {
    ccREBiosampleQuery(assembly: $assembly) {
      biosamples {
        name
        ontology
        lifeStage      
        sampleType
        displayname
        __typename
      }
      __typename
    }
  }`)


  export type UseCcreBiosampleParams = {
    assembly: string
  }

  export type UseCcreBiosampleReturn = {
    data: GetcCreBiosampleMetadataQueryQuery["ccREBiosampleQuery"] | undefined;
    loading: boolean;
    error: ApolloError
  }
  
  export const useCcreBiosampleData = ({ assembly }: UseCcreBiosampleParams): UseCcreBiosampleReturn => {
  
    console.log(assembly)
    const { data, loading, error } = useQuery(CCRE_BIOSAMPLE_QUERY,
      {
        variables: {assembly: "grch38"},
        skip: !assembly
      },
    );
  
    return {
      data: data?.ccREBiosampleQuery,
      loading,
      error
    }
  }