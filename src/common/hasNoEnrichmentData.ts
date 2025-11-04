"use client";
import { makeClient } from "common/apollo/apollo-wrapper";
import { gql } from "common/types/generated";

const QUERY = gql(
  `query getGWASStudyMetadataEnrichment($studyid: [String], $limit: Int, $studyname_prefix: [String], $parent_terms: [String]){  
    getGWASStudiesMetadata(studyid: $studyid, limit: $limit, parent_terms: $parent_terms, studyname_prefix: $studyname_prefix )  
    {
      has_enrichment_info
    }
  }`
);

export async function hasNoEnrichmentData(entityID: string) {
  
  try {
    // importantly this is not currently setup to allow using useQuery
    // maybe we can transition this all to using some custom hook to allow that
    // for now use makeClient().query()
    const { data } = await makeClient().query({
      query: QUERY,
      variables: { studyid: [entityID] },
    });

    return data ? !data.getGWASStudiesMetadata[0].has_enrichment_info : false;
  } catch (error) {
    console.error("Error fetching data for: " + entityID, error);
    return false;
  }
}