/**
 * Send the request to our Server from a server component
 */
'use server'
import { ApolloQueryResult, gql } from "@apollo/client"
import { getClient } from "common/apollo/client";

const cCRE_QUERY = gql`
  query ccreSearchQuery_1(
    $accessions: [String!]
    $assembly: String!
    $cellType: String
    $coordinates: [GenomicRangeInput]
    $element_type: String
    $gene_all_start: Int
    $gene_all_end: Int
    $gene_pc_start: Int
    $gene_pc_end: Int
    $rank_ctcf_end: Float
    $rank_ctcf_start: Float
    $rank_dnase_end: Float
    $rank_dnase_start: Float
    $rank_enhancer_end: Float
    $rank_enhancer_start: Float
    $rank_promoter_end: Float
    $rank_promoter_start: Float
    $rank_atac_end: Float
    $rank_atac_start: Float
    $mammals_min: Float
    $mammals_max: Float
    $vertebrates_min: Float
    $vertebrates_max: Float
    $primates_min: Float
    $primates_max: Float
    $uuid: String
    $limit: Int
    $nearbygeneslimit: Int
    $nearbygenesdistancethreshold: Int
  ) {
    cCRESCREENSearch(
      assembly: $assembly
      accessions: $accessions
      cellType: $cellType
      coordinates: $coordinates
      element_type: $element_type
      gene_all_start: $gene_all_start
      gene_all_end: $gene_all_end
      gene_pc_start: $gene_pc_start
      gene_pc_end: $gene_pc_end
      rank_atac_end: $rank_atac_end
      rank_atac_start: $rank_atac_start
      rank_ctcf_end: $rank_ctcf_end
      rank_ctcf_start: $rank_ctcf_start
      rank_dnase_end: $rank_dnase_end
      rank_dnase_start: $rank_dnase_start
      rank_enhancer_end: $rank_enhancer_end
      rank_enhancer_start: $rank_enhancer_start
      rank_promoter_end: $rank_promoter_end
      rank_promoter_start: $rank_promoter_start
      mammals_min: $mammals_min
      mammals_max: $mammals_max
      vertebrates_min: $vertebrates_min
      vertebrates_max: $vertebrates_max
      primates_min: $primates_min
      primates_max: $primates_max
      uuid: $uuid
      limit: $limit
      nearbygeneslimit: $nearbygeneslimit
      nearbygenesdistancethreshold: $nearbygenesdistancethreshold
    ) {
      chrom
      start
      len
      pct
      vertebrates
      mammals
      primates
      ctcf_zscore
      dnase_zscore
      enhancer_zscore
      promoter_zscore
      atac_zscore
      ctspecific {
        ct
        dnase_zscore
        h3k4me3_zscore
        h3k27ac_zscore
        ctcf_zscore
        atac_zscore
      }
      info {
        accession
        isproximal
        concordant
      }
      nearestgenes {
        gene
        distance
      }
    }
  }
`

function cCRE_QUERY_VARIABLES(assembly: string, coordinates: {chromosome: string, start: number, end: number}[], biosample: string, nearbygenesdistancethreshold: number, nearbygeneslimit: number, accessions: string[], noLimit?: boolean) {
  let vars = {
    uuid: null,
    assembly: assembly,
    gene_all_start: 0,
    gene_all_end: 5000000,
    gene_pc_start: 0,
    gene_pc_end: 5000000,
    rank_dnase_start: -10,
    rank_dnase_end: 11,
    rank_atac_start: -10,
    rank_atac_end: 11,
    rank_promoter_start: -10,
    rank_promoter_end: 11,
    rank_enhancer_start: -10,
    rank_enhancer_end: 11,
    rank_ctcf_start: -10,
    rank_ctcf_end: 11,
    cellType: biosample,
    element_type: null,
    limit: noLimit ? null : 25000,
    nearbygenesdistancethreshold: nearbygenesdistancethreshold,
    nearbygeneslimit: nearbygeneslimit
  }
  //Can't just null out accessions field if not using due to API functionality as of writing this, so push to vars only if using
  if (accessions) {
    vars["accessions"] = accessions
  }
  if (coordinates) {
    vars["coordinates"] = coordinates
  }

  return vars
}


/**
 *
 * @param assembly string, "GRCh38" or "mm10"
 * @param chromosome string, ex: "chr11"
 * @param start number
 * @param end number
 * @param biosample a biosample selection. If not specified or "undefined", will be marked as "null" in gql query
 * @param nearbygenesdistancethreshold the distance from cCRE that will be used for distance-linked genes
 * @param nearbygeneslimit limit of returned ditance-linked genes
 * @param accessions a list of accessions to fetch information on. Set chromosome, start, end to "undefined" if using so they're set to null
 * @returns cCREs matching the search
 */
export async function MainQuery(assembly: string = null, chromosome: string = null, start: number = null, end: number = null, biosample: string = null, nearbygenesdistancethreshold: number, nearbygeneslimit: number, accessions: string[] = null, noLimit?: boolean) {
  let data: ApolloQueryResult<any>
  try {
    data = await getClient().query({
      query: cCRE_QUERY,
      variables: cCRE_QUERY_VARIABLES(assembly, chromosome ? [{chromosome, start, end}] : null, biosample, nearbygenesdistancethreshold, nearbygeneslimit, accessions, noLimit),
      //Telling it to not cache, next js caches also and for things that exceed the 2mb cache limit it slows down substantially for some reason
      fetchPolicy: "no-cache",
    })
  } catch (error) {
    console.error(error)
    throw error
  }
  
  return data
}

