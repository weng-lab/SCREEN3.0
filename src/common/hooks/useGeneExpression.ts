import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { gql } from "common/types/generated/gql";
import { Assembly } from "common/types/globalTypes";
import { human_RNA_map, mouse_RNA_map } from "./consts";

const GET_GENE_EXPRESSION = gql(`
query geneexpression($assembly: String!, $gene_id: String) {
  gene_dataset(processed_assembly: $assembly) {
    biosample
    tissue
    biosample_type
  	assay_term_name
    exp_accession: accession
    replicates: gene_quantification_files(assembly: $assembly) {
      file_accession: accession
      biorep
      techrep
      quantification: quantifications(gene_id_prefix: [$gene_id]) {
        tpm
      }
    }
  }
}
 `);

export type UseGeneExpressionDataParams = {
  id: string;
  assembly: Assembly;
  skip?: boolean
};

export const useGeneExpression = ({ id, assembly, skip }: UseGeneExpressionDataParams) => {
  const { data, loading, error } = useQuery(GET_GENE_EXPRESSION, {
    variables: {
      gene_id: id?.split(".")[0],
      assembly: assembly,
    },
    skip: skip || !id,
  });

  const correctedData = useMemo(() => {
    if (!data) return undefined;
    return {
      ...data,
      gene_dataset: data.gene_dataset.map((x) => {
        return {
          ...x,
          replicates: [
            ...x.replicates.map((rep) => ({
              file_accession: rep.file_accession,
              biorep: rep.biorep,
              techrep: rep.techrep,
              tpm: rep.quantification[0]?.tpm,
            })),
          ],
          umap_1: (assembly === "mm10"
            ? mouse_RNA_map[x.exp_accession][0]
            : human_RNA_map[x.exp_accession][0]) as number,
          umap_2: (assembly === "mm10"
            ? mouse_RNA_map[x.exp_accession][1]
            : human_RNA_map[x.exp_accession][1]) as number,
        };
      }),
    };
  }, [assembly, data]);

  return {
    data: correctedData?.gene_dataset,
    loading,
    error,
  };
};
