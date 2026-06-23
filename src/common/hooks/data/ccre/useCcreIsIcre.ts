import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import { Assembly } from "common/types/globalTypes";

const CCRE_ICRE_QUERY = gql(`
  query CcreIsIcre(
    $accession: [String!]
    $assembly: String!
  ) {
    cCREAutocompleteQuery(
      includeiCREs: true
      assembly: $assembly    
      accession: $accession
    ) {    
      accession
      isiCRE
    }
  }
`);

type UseCcreIsIcreParams = {
  accessions: string[];
  assembly: Assembly;
}

export const useCcreIsIcre = ({ accessions, assembly }: UseCcreIsIcreParams) => {
  const { data, loading, error } =  useQuery(CCRE_ICRE_QUERY, {
    variables: {
      assembly: "grch38",
      accession: accessions,
    },
    skip: !accessions || !accessions.length || assembly !== "GRCh38",
  });

  const CcreIcreMap = data?.cCREAutocompleteQuery
    ? Object.fromEntries(data?.cCREAutocompleteQuery.map((ccre) => [ccre.accession, ccre.isiCRE]))
    : undefined;

  return {
    data: CcreIcreMap,
    loading,
    error,
  };
};