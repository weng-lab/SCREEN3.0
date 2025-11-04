import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated";
import { LinkedCcresQuery } from "common/types/generated/graphql";

export type useLinkedCcresParams = {
  geneid: string
}

type BaseReturn = LinkedCcresQuery["linkedcCREs"][number]

interface LinkedCcreInfo extends BaseReturn {
  assay?: "RNAPII-ChIAPET" | "CTCF-ChIAPET" | "Intact-HiC" | "CRISPRi-FlowFISH";
};

export type useLinkedCcresReturn = { data: LinkedCcreInfo[] | undefined; loading: boolean; error: ApolloError }

export function useLinkedCcres({ geneid }: useLinkedCcresParams) {
  const { data, loading, error } = useQuery(LINKED_CCRE_QUERY, {
    variables: { geneid: [geneid.split(".")[0]], assembly: "grch38" },
    skip: !geneid,
  });

  return {
    data: data?.linkedcCREs,
    loading,
    error,
  } as useLinkedCcresReturn;
}
const LINKED_CCRE_QUERY = gql(`
  query LinkedCcres($geneid: [String!]!, $assembly: String!) {
    linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {
      accession
      p_val
      gene
      geneid
      genetype
      method
      grnaid
      effectsize
      assay
      celltype
      experiment_accession
      tissue
      variantid
      source
      slope
      score
      displayname
      __typename
    }
  }
`);
