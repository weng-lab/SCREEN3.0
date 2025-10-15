"use client"
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
/**
 * @todo we are relying on this transient dependency that is only present because of umms-gb. If we remove umms-gb this will break
 */
import { BigBedData } from "bigwig-reader";
import { gql } from "types/generated/gql";
import { Assembly, GenomicRange } from "types/globalTypes";

export const BIG_QUERY = gql(`
  query BigRequests($bigRequests: [BigRequest!]!) {
    bigRequests(requests: $bigRequests) {
      data
      error {
        errortype
        message
      }
    }
  }
`);

export type ChromTrack = {
  sample: string;
  displayName: string;
  url: string;
};

export const CHROM_HMM_STATES = [
  "TssFlnk",
  "TssFlnkD",
  "TssFlnkU",
  "Tss",
  "Enh1",
  "Enh2",
  "EnhG1",
  "EnhG2",
  "TxWk",
  "Biv",
  "ReprPC",
  "Quies",
  "Het",
  "ZNF/Rpts",
  "Tx",
] as const;

export type ChromHmmState = typeof CHROM_HMM_STATES[number]

export const stateDetails: Record<ChromHmmState, { description: string; stateno: string; color: string }> = {
  ["TssFlnk"]: { description: "Flanking TSS", stateno: "E1", color: "#FF4500" },
  ["TssFlnkD"]: {
    description: "Flanking TSS downstream",
    stateno: "E2",
    color: "#FF4500",
  },
  ["TssFlnkU"]: {
    description: "Flanking TSS upstream",
    stateno: "E3",
    color: "#FF4500",
  },
  ["Tss"]: { description: "Active TSS", stateno: "E4", color: "#FF0000" },
  ["Enh1"]: { description: "Enhancer", stateno: "E5", color: "#FFDF00" },
  ["Enh2"]: { description: "Enhancer", stateno: "E6", color: "#FFDF00" },
  ["EnhG1"]: {
    description: "Enhancer in gene",
    stateno: "E7",
    color: "#AADF07",
  },
  ["EnhG2"]: {
    description: "Enhancer in gene",
    stateno: "E8",
    color: "#AADF07",
  },
  ["TxWk"]: {
    description: "Weak transcription",
    stateno: "E9",
    color: "#3F9A50",
  },
  ["Biv"]: { description: "Bivalent", stateno: "E10", color: "#CD5C5C" },
  ["ReprPC"]: {
    description: "Repressed by Polycomb",
    stateno: "E11",
    color: "#8937DF",
  },
  ["Quies"]: { description: "Quiescent", stateno: "E12", color: "#DCDCDC" },
  ["Het"]: { description: "Heterochromatin", stateno: "E13", color: "#4B0082" },
  ["ZNF/Rpts"]: {
    description: "ZNF genes repeats",
    stateno: "E14",
    color: "#68cdaa",
  },
  ["Tx"]: { description: "Transcription", stateno: "E15", color: "#008000" },
};

export function getChromHmmStateDisplayname(state: ChromHmmState){
  return stateDetails[state].description + " (" + stateDetails[state].stateno + ")";
}

export const ChromHmmTissues = [
    "adipose",
    "adrenal gland",
    "blood",
    "blood vessel",
    "bone",
    "bone marrow",
    "brain",
    "breast",
    "connective tissue",
    "embryo",
    "esophagus",
    "heart",
    "large intestine",
    "liver",
    "lung",
    "muscle",
    "nerve",
    "ovary",
    "pancreas",
    "paraythroid gland",
    "penis",
    "placenta",
    "prostate",
    "skin",
    "small intestine",
    "spleen",
    "stomach",
    "testis",
    "thymus",
    "thyroid",
    "uterus",
    "vagina"
];

export function useChromHMMData(coordinates: GenomicRange, assembly: Assembly = "GRCh38") {
  const [tracks, setTracks] = useState<Record<string, ChromTrack[]>>(null);
  const [chromHmmTracksWithTissue, setChromhmmTracksWithTissue] = useState<
    {
      tissue: string;
      url: string;
      biosample: string;
    }[]
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        // Skip fetching if not GRCh38
        if (assembly !== "GRCh38") {
          setTracks(null);
          setChromhmmTracksWithTissue(null);
          setLoading(false);
          return;
        }

        // Fetch tracks
        const tracksData = await getTracks();
        setTracks(tracksData);

        // Process tracks into flat structure
        const flatTracks = Object.keys(tracksData)
          .map((tissue) => {
            return tracksData[tissue].map((track) => ({
              tissue: tissue,
              url: track.url,
              biosample: track.displayName,
            }));
          })
          .flat();

        setChromhmmTracksWithTissue(flatTracks);
      } catch (error) {
        console.error("Error fetching ChromHMM data:", error);
        setError(true)
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, [assembly]);

  // BigQuery for the table data
  const { data: bigQueryData, loading: bigQueryLoading, error: bigQueryError } =
    useQuery(BIG_QUERY, {
      variables: {
        bigRequests:
          chromHmmTracksWithTissue?.map((track) => ({
            chr1: coordinates.chromosome!,
            start: coordinates.start,
            end: coordinates.end,
            preRenderedWidth: 1400,
            url: track.url,
          })) || [],
      },
      skip: !chromHmmTracksWithTissue || assembly !== "GRCh38",
    });

  // Process the data for the table view
  const processedTableData = useMemo(() => {
    if (!bigQueryData || !chromHmmTracksWithTissue || bigQueryLoading)
      return undefined;

    return bigQueryData.bigRequests.map((b, i) => {
      const f = b.data[0] as BigBedData;
      return {
        start: f.start,
        end: f.end,
        state: f.name as ChromHmmState,
        chr: f.chr,
        color: f.color,
        tissue: chromHmmTracksWithTissue[i].tissue,
        biosample: chromHmmTracksWithTissue[i].biosample,
      };
    });
  }, [bigQueryData, chromHmmTracksWithTissue, bigQueryLoading]);

  return {
    tracks,
    processedTableData,
    loading: loading || bigQueryLoading,
    error: error || bigQueryError
  };
}

async function getTracks() {
  const response = await fetch("https://downloads.wenglab.org/humanchromhmmchipseq.tsv");
  const text = await response.text();

  const chromHMMData: Record<string, ChromTrack[]> = {};
  text.split("\n").forEach((line) => {
    const [sample, fileId, tissue, displayName] = line.split("\t");

    if (!tissue) return;

    const trackData: ChromTrack = {
      sample,
      displayName,
      url: `https://downloads.wenglab.org/ChIP_${fileId}.bigBed`,
    };

    if (chromHMMData[tissue]) {
      chromHMMData[tissue].push(trackData);
    } else {
      chromHMMData[tissue] = [trackData];
    }
  });

  return chromHMMData;
}
