import { useQuery } from "@apollo/client";
import { gql } from "common/types/generated";
import { GetimmuneGwasLdrQuery } from "common/types/generated/graphql";

function useImmuneGWASLdr(icres?: string[], snps?: string[]) {
  const { loading, error, data } = useQuery(GWAS_LDR_QUERY, {
    variables: {
      icres: icres,
      snps: snps,
    },
  });

  return { data: data?.immuneGWASLdrQuery as useGWASLdrReturn, loading, error };
}

export default useImmuneGWASLdr;

export type useGWASLdrReturn = GetimmuneGwasLdrQuery["immuneGWASLdrQuery"];

const GWAS_LDR_QUERY = gql(`
query getimmuneGWASLdr($icres: [String], $snps: [String]) {
    immuneGWASLdrQuery(snps: $snps, icres: $icres) {
      snp_chr
      snp_end
      snp_start
      snpid
      icre
      ref_allele
      author
      effect_allele
      zscore
      study_source
      disease
      icre_chr
      icre_start
      icre_end
      icre_class
      study
      study_link
    }
  }`);
