"use client";
import { useEffect, useState } from "react";
import type { Frequency, SnpAlleles, SnpAllelesResponse } from "app/api/ensembl/variation/route";

export type { Frequency, SnpAlleles, SnpAllelesResponse };

export interface UseSnpAllelesResult {
  data: SnpAllelesResponse;
  loading: boolean;
  error: string | null;
}

export interface UseSnpAllelesOptions {
  /**
   * Fetch population allele frequencies alongside ref/alt. Off by default - frequencies are roughly
   * 14x the payload and most callers only read the alleles.
   */
  includeFrequencies?: boolean;
  /** Skip fetching entirely, for callers that only sometimes describe a variant */
  skip?: boolean;
}

/**
 * Looks up reference/alternate alleles (and optionally population frequencies) for a set of rsIDs
 * via the /api/ensembl/variation proxy, which batches and caches the upstream Ensembl requests.
 *
 * rsIDs with no matching variant are present in `data` with a value of null.
 */
export function useSnpAlleles(rsids: string[], options: UseSnpAllelesOptions = {}): UseSnpAllelesResult {
  const { includeFrequencies = false, skip = false } = options;

  // Value-based key, so equal rsid sets do not refetch. Sorted and deduplicated to match the cache
  // key the route handler builds.
  const rsidKey = rsids ? [...new Set(rsids)].sort().join(",") : "";
  const requestKey = skip || !rsidKey ? null : `${includeFrequencies ? "freq" : "alleles"}:${rsidKey}`;

  const [result, setResult] = useState<{ key: string; data: SnpAllelesResponse; error: string | null } | null>(null);

  useEffect(() => {
    if (!requestKey) return;

    // A superseded fetch must not clobber the state of a newer one
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch("/api/ensembl/variation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rsids: rsidKey.split(","), includeFrequencies }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data: SnpAllelesResponse = await response.json();
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      } catch (err) {
        if (!cancelled) {
          setResult({ key: requestKey, data: {}, error: err instanceof Error ? err.message : "Unknown error" });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [requestKey, rsidKey, includeFrequencies]);

  // Derived rather than stored, so a changed rsid set reports as loading during the same render that
  // changed it, and a result belonging to an older set is never shown
  const current = result?.key === requestKey ? result : null;

  return {
    data: current?.data,
    loading: requestKey !== null && current === null,
    error: current?.error ?? null,
  };
}
