import { Assembly } from "common/types/globalTypes";
import { useCcreData } from "./useCcreData";

export type UseCcreParams = {
  assembly: Assembly;
  accession: string;
  skip?: boolean;
};

/**
 * useCcreData wrapper to cover single-accession cases where we will need to index into the 0th item
 */
export const useCcre = ({ assembly, accession, skip }: UseCcreParams) => {
  const { data, loading, error } = useCcreData({assembly, accessions: [accession], skip })

  return {
    data: data ? data[0] : undefined,
    loading,
    error,
  };
};
