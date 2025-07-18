/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n    closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n      gene {\n        chromosome\n        stop\n        start\n        name\n        type\n      }\n      ccre\n      chromosome\n      stop\n      start\n    }\n  }\n": typeof types.GetclosestGenetocCreDocument,
    "\n  query getcCREDetails(\n    $accessions: [String!]\n    $coordinates: [GenomicRangeInput!]\n  ) {\n    cCREQuery(\n      assembly: \"grch38\"\n      accession: $accessions\n      coordinates: $coordinates\n    ) {\n      group\n      accession\n      coordinates {\n        start\n        chromosome\n        end\n      }\n    }\n  }\n": typeof types.GetcCreDetailsDocument,
    "\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      author\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n      study_link\n    }\n  }": typeof types.GetimmuneGwasLdrDocument,
    "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n": typeof types.GeneDocument,
    "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n": typeof types.GeneExpressionDocument,
    "\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n": typeof types.IcresZscoresDocument,
    "\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n": typeof types.NearbyAndLinkedGenesDocument,
    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession    \n    isiCRE    \n  }\n}": typeof types.CCreAutocompleteQueryDocument,
    "\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  ": typeof types.LinkedcCrEsDocument,
    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n    \n  }\n}": typeof types.CCreAutocompleteQueryDocument,
    "\nquery getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n     gene {\n      chromosome\n      stop\n      start\n      name\n      type\n    }\n    ccre\n    chromosome\n    stop\n    start\n  }\n}\n  ": typeof types.GetclosestGenetocCreDocument,
    "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": typeof types.SnpDocument,
};
const documents: Documents = {
    "\n  query getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n    closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n      gene {\n        chromosome\n        stop\n        start\n        name\n        type\n      }\n      ccre\n      chromosome\n      stop\n      start\n    }\n  }\n": types.GetclosestGenetocCreDocument,
    "\n  query getcCREDetails(\n    $accessions: [String!]\n    $coordinates: [GenomicRangeInput!]\n  ) {\n    cCREQuery(\n      assembly: \"grch38\"\n      accession: $accessions\n      coordinates: $coordinates\n    ) {\n      group\n      accession\n      coordinates {\n        start\n        chromosome\n        end\n      }\n    }\n  }\n": types.GetcCreDetailsDocument,
    "\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      author\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n      study_link\n    }\n  }": types.GetimmuneGwasLdrDocument,
    "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n": types.GeneDocument,
    "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n": types.GeneExpressionDocument,
    "\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n": types.IcresZscoresDocument,
    "\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n": types.NearbyAndLinkedGenesDocument,
    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession    \n    isiCRE    \n  }\n}": types.CCreAutocompleteQueryDocument,
    "\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  ": types.LinkedcCrEsDocument,
    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n    \n  }\n}": types.CCreAutocompleteQueryDocument,
    "\nquery getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n     gene {\n      chromosome\n      stop\n      start\n      name\n      type\n    }\n    ccre\n    chromosome\n    stop\n    start\n  }\n}\n  ": types.GetclosestGenetocCreDocument,
    "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": types.SnpDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n    closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n      gene {\n        chromosome\n        stop\n        start\n        name\n        type\n      }\n      ccre\n      chromosome\n      stop\n      start\n    }\n  }\n"): (typeof documents)["\n  query getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n    closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n      gene {\n        chromosome\n        stop\n        start\n        name\n        type\n      }\n      ccre\n      chromosome\n      stop\n      start\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getcCREDetails(\n    $accessions: [String!]\n    $coordinates: [GenomicRangeInput!]\n  ) {\n    cCREQuery(\n      assembly: \"grch38\"\n      accession: $accessions\n      coordinates: $coordinates\n    ) {\n      group\n      accession\n      coordinates {\n        start\n        chromosome\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query getcCREDetails(\n    $accessions: [String!]\n    $coordinates: [GenomicRangeInput!]\n  ) {\n    cCREQuery(\n      assembly: \"grch38\"\n      accession: $accessions\n      coordinates: $coordinates\n    ) {\n      group\n      accession\n      coordinates {\n        start\n        chromosome\n        end\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      author\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n      study_link\n    }\n  }"): (typeof documents)["\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      author\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n      study_link\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n"): (typeof documents)["\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n"): (typeof documents)["\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n"): (typeof documents)["\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n"): (typeof documents)["\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession    \n    isiCRE    \n  }\n}"): (typeof documents)["query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession    \n    isiCRE    \n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  "): (typeof documents)["\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n    \n  }\n}"): (typeof documents)["query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n    \n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n     gene {\n      chromosome\n      stop\n      start\n      name\n      type\n    }\n    ccre\n    chromosome\n    stop\n    start\n  }\n}\n  "): (typeof documents)["\nquery getclosestGenetocCRE($geneid: [String],$ccre: [String]) {\n  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {\n     gene {\n      chromosome\n      stop\n      start\n      name\n      type\n    }\n    ccre\n    chromosome\n    stop\n    start\n  }\n}\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;