import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { LinkedGenesQuery } from "../../types/generated/graphql";

export type LinkedGeneInfo = {  
  p_val?: number | null;
  gene: string; 
  geneid: string; 
  genetype: string; 
  method: string; 
  accession: string; 
  grnaid?: string | null;
  effectsize?: number | null;
  assay?: string | null; 
  celltype?: string | null;
  experiment_accession?: string | null;
  tissue?: string | null;
   score?: number | null; 
  variantid?: string | null;
  source?: string | null; 
  slope?: number | null; 
  displayname?: string | null
};
/*
export const ComputationalGeneLinks_Query = gql(`
  query ComputationalGeneLinks($accession: [String]!){
    ComputationalGeneLinksQuery(accession: $accession){
      genename
      geneid
      genetype
      method
      celltype
      score
      methodregion
      fileaccession
    }
  }
`)
*/
export const BED_INTERSECT= gql(`
    query bedIntersectCCRE ($inp: [cCRE]!, $assembly: String!, $maxOutputLength: Int) {
      intersection (
        userCcres: $inp,
        assembly: $assembly,
        maxOutputLength: $maxOutputLength
      )
    }
  `)

const GWAS_SNP_QUERY = gql(`
  query getSNPsforgivengwasStudy($study: [String!]!) {
    getSNPsforGWASStudies(study: $study) {
      snpid
      ldblock
      rsquare
      chromosome
      stop
      start
      ldblocksnpid
      __typename
    }
  }`)

  export const LINKED_GENES = gql(`
    query linkedGenes(
      $assembly: String!
      $accessions: [String]!
      $methods: [String]
      $celltypes: [String]
    ) {
      linkedGenesQuery(
        assembly: $assembly
        accession: $accessions
        method: $methods
        celltype: $celltypes
      ) {
        p_val
        gene
        geneid
        genetype
        method
        accession
        grnaid
        effectsize
        assay
        celltype
        experiment_accession
        tissue
        score
        variantid
        source
        slope
        tissue
        displayname
      }
    }
  `)
  
  
  
  export type useGWASSnpscCREsGenesParams = {
    study: string[]
  }
  
  export type useGWASSnpscCREsGenesReturn = {
    data: LinkedGenesQuery['linkedGenesQuery'] | undefined;
    loading: boolean;
    error: ApolloError  | undefined;
  }
  
  
  export const useGWASSnpscCREsGenesData = ({ study }: useGWASSnpscCREsGenesParams): useGWASSnpscCREsGenesReturn => {
  
    const { data: gwasstudySNPs, loading: gwasstudySNPsLoading, error } = useQuery(
        GWAS_SNP_QUERY,
      {
        variables: {
          study: ["Dastani_Z-22479202-Adiponectin_levels"]
        },
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        skip: !study || study.length === 0
      },
    );

    let snpsRegions = gwasstudySNPs && gwasstudySNPs.getSNPsforGWASStudies.map(g => {
        return [g.chromosome.toString(), g.start.toString(), g.stop.toString(), g.snpid.toString(), g.rsquare.toString(), g.ldblocksnpid.toString(), g.ldblock.toString()]
      })

    console.log("snpsRegions",snpsRegions)
    const {
        data: cCREIntersections, loading: cCREIntersectionsLoading, error: cCREIntersectionsError
      } = useQuery(BED_INTERSECT, {
        variables: {
          inp: snpsRegions,
          assembly: "grch38",
          maxOutputLength: 10000
        },
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        skip: gwasstudySNPsLoading || (gwasstudySNPs && gwasstudySNPs.getSNPsforGWASStudies.length === 0) || (!snpsRegions) || (snpsRegions.length === 0),
        
      })
  
      let studycCREs = cCREIntersections && cCREIntersections.intersection.map((g) => {
        return g[4]
      })
      
      const uniqueAccessions= cCREIntersections && cCREIntersections.intersection.length > 0 ? [...new Set(studycCREs)] :[];

      //console.log("studyccresgenes", uniqueAccessions)
      const { data: studyGenes, loading: studyGenesLoading, error: studyGenesError } = useQuery(
        LINKED_GENES,
      {
        variables: {
            assembly: "grch38",
            accessions: uniqueAccessions
        },
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        skip: !uniqueAccessions || uniqueAccessions.length === 0
      },
    );

   /* const { data: studyCompuLinkedGenes, loading: studyCompuLinkedGenesLoading, error: studyCompuLinkedGenesError } = useQuery(
      ComputationalGeneLinks_Query,
    {
      variables: {
          //assembly: "grch38",
          accession: uniqueAccessions
      },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      skip: !uniqueAccessions || uniqueAccessions.length === 0
    },
  );*/
         
    return {
      data: studyGenes ? studyGenes.linkedGenesQuery : undefined,
      loading: gwasstudySNPsLoading || cCREIntersectionsLoading || studyGenesLoading,
      error: error || cCREIntersectionsError || studyGenesError,
    }
  }