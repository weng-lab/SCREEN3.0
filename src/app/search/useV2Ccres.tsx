import { useQuery } from "@apollo/client";
import { gql } from "common/types/generated";
import { Assembly } from "common/types/globalTypes";

const GET_V2_CCRE_MAPPINGS = gql(` 
  query getv2cCREMappings($v2_accession: [String]!, $assembly: String!) {
    getv2cCREMappings(v2_accession: $v2_accession, assembly: $assembly) {
      v2_region
      v4_accession
      v2_accession
      v4_region
    }
  }`);

export const useV2Ccres = (accessions: string[], assembly: Assembly) => {
  return useQuery(GET_V2_CCRE_MAPPINGS, {
    variables: { assembly, v2_accession: accessions },
  });
}