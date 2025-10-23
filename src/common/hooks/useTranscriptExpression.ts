import { ApolloError, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { gql } from "types/generated/gql";
import { TssRampageQuery } from "types/generated/graphql";

const TSS_RAMPAGE_QUERY = gql(`
  query tssRampage($gene: String!) {
  tssrampageQuery(genename: $gene) {
    start    
    organ   
    strand
    peakId
    biosampleName
    biosampleType
    biosampleSummary
    peakType
    expAccession
    value
    start
    end 
    chrom    
    genes {
      geneName
        locusType
    }
  }
}`);

export type ExpressionParams = {
  gene: string;
};

type TssRampage = NonNullable<NonNullable<TssRampageQuery["tssrampageQuery"]>[number]>;

export type UseTranscriptExpressionReturn = {
  data: TssRampage[] | undefined;
  peaks: PeakInfo[];
  loading: boolean;
  error: ApolloError;
};

export type PeakInfo = {
  peakID: string;
  peakType: string;
  locusType: string;
  coordinates: {
    chrom: string;
    start: number;
    end: number;
  };
};

export const useTranscriptExpression = ({ gene }: ExpressionParams): UseTranscriptExpressionReturn => {
  const { data, loading, error } = useQuery(TSS_RAMPAGE_QUERY, {
    variables: {
      gene: gene,
    },
    skip: !gene,
  });

  const peaks: PeakInfo[] = useMemo(() => {
    if (!data?.tssrampageQuery) return [];

    return Array.from(
      new Map(
        data?.tssrampageQuery.map((x) => [
          x.peakId,
          {
            peakID: x.peakId,
            peakType: x.peakType,
            locusType: x.genes[0].locusType,
            coordinates: { chrom: x.chrom, start: x.start, end: x.end },
          },
        ])
      ).values()
    );
  }, [data]);

  return {
    data: data?.tssrampageQuery ?? [],
    peaks: peaks,
    loading,
    error,
  };
};
