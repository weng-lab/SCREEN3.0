import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { IcreQuery } from "types/generated/graphql";
import { GenomicElementType, GenomicRange } from "types/globalTypes";

const ICRES_QUERY = gql(`
  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {
    iCREQuery(coordinates: $coordinates, accession: $accession) {
      accession
      group
      ataccelltypes: celltypes
      dnasecelltypes
      coordinates {
        start
        end
        chromosome
      }
    }
  }
`)

type UseIcreDataParams = 
  | { accession: string | string[]; coordinates?: never; elementType?: GenomicElementType }
  | { coordinates: GenomicRange | GenomicRange[]; accession?: never; elementType?: GenomicElementType }

export type UseIcreDataReturn<T extends UseIcreDataParams> = 
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { accession: string[] })
  ? { data: IcreQuery["iCREQuery"] | undefined; loading: boolean; error: ApolloError }
  : { data: IcreQuery["iCREQuery"][0] | undefined; loading: boolean; error: ApolloError };

export const useIcreData = <T extends UseIcreDataParams>({accession, coordinates, elementType}: T): UseIcreDataReturn<T> => {

  const { data, loading, error } = useQuery(
    ICRES_QUERY,
    {
      variables: {
        coordinates,
        accession
      },
      skip: (elementType !== undefined) && elementType !== 'icre'
    },
  );

  return {
    /**
     * if have coordinates or multiple accession, return whole array
     * otherwise is single accession so return first item
     */
    data: (coordinates || typeof accession === "object") ? data?.iCREQuery : data?.iCREQuery[0],
    loading,
    error,
  } as UseIcreDataReturn<T>
}