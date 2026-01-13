import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";
import { GetconservationHeatmapCoordsQuery } from "common/types/generated/graphql";

export type useConservationHeatmapDataParams = {
    accession: string[],
    assembly: string
};

const Conservation_Query = gql(`
query getconservationHeatmapCoords($accession: [String]!) {
  conservationHeatmapQuery(accession: $accession) {
    x_coord
    y_coord
    accession
    ccre_class
  }
}
`);

export type useConservationHeatmapDataReturn = {
    data: GetconservationHeatmapCoordsQuery["conservationHeatmapQuery"] | undefined;
    loading: boolean;
    error: ApolloError;
};

export function useConservationHeatmapData({
    accession, assembly
}: useConservationHeatmapDataParams) {
    const { data, loading, error } = useQuery(Conservation_Query, {
        variables: { accession },
        skip: assembly === "mm10",
    });

    return {
        data: data?.conservationHeatmapQuery,
        loading,
        error,
    } as useConservationHeatmapDataReturn;
}
