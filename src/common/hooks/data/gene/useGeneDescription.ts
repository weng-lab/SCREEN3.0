"use client";
import { useEffect, useState } from "react";
import type { GeneDescriptionResponse } from "app/api/ncbi/gene-description/route";

export interface UseGeneDescriptionResult {
  description: string | null;
  loading: boolean;
  error: string | null;
}

export interface UseGeneDescriptionOptions {
  /** Skip fetching entirely, for callers that only sometimes describe a gene */
  skip?: boolean;
}

/**
 * Looks up an NCBI gene description via the /api/ncbi/gene-description proxy, which caches the
 * upstream NLM request and matches the gene symbol exactly.
 *
 * `description` is null when the gene has no matching entry.
 */
export function useGeneDescription(name: string, options: UseGeneDescriptionOptions = {}): UseGeneDescriptionResult {
  const { skip = false } = options;

  const requestKey = skip || !name ? null : name;

  const [result, setResult] = useState<{ key: string; description: string | null; error: string | null } | null>(null);

  useEffect(() => {
    if (!requestKey) return;

    // A superseded fetch must not clobber the state of a newer one
    let cancelled = false;

    const fetchDescription = async () => {
      try {
        const response = await fetch(`/api/ncbi/gene-description?name=${encodeURIComponent(requestKey)}`);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data: GeneDescriptionResponse = await response.json();
        if (!cancelled) setResult({ key: requestKey, description: data.description, error: null });
      } catch (err) {
        if (!cancelled) {
          setResult({
            key: requestKey,
            description: null,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    };

    fetchDescription();

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  // Derived rather than stored, so a changed gene reports as loading during the same render that
  // changed it, and a description belonging to an older gene is never shown
  const current = result?.key === requestKey ? result : null;

  return {
    description: current?.description ?? null,
    loading: requestKey !== null && current === null,
    error: current?.error ?? null,
  };
}
