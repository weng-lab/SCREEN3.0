"use client";
import { EntityType } from "common/entityTabsConfig";
import { useEffect, useState } from "react";

interface Frequency {
  population: string;
  frequency: number;
}

interface SnpFrequencies {
  ref: string;
  alt: string;
  frequencies: Frequency[];
}

export interface UseSnpFrequenciesResult {
  data: { [rsid: string]: SnpFrequencies | null };
  loading: boolean;
  error: string | null;
}

export function useSnpFrequencies(
  rsids: string[],
  entityType: EntityType<"GRCh38"> = "variant"
): UseSnpFrequenciesResult {
  const [data, setData] = useState<{ [rsid: string]: SnpFrequencies | null }>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const rsidKey = rsids ? [...new Set(rsids)].sort().join(",") : "";

  useEffect(() => {
    if (entityType !== undefined && entityType !== "variant") return;

    if (!rsidKey) return; // Nothing to fetch

    const rsidsToFetch = rsidKey.split(",");

    // A superseded fetch must not clobber the state of a newer one
    let cancelled = false;

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Built fresh rather than spread over the previous `data`, which would be a stale read from
        // this closure. The result then always describes exactly the rsids that were requested.
        const results: { [rsid: string]: SnpFrequencies | null } = {};

        // Fetch data for the remaining rsids concurrently using Promise.all
        await Promise.all(
          rsidsToFetch.map(async (rsid) => {
            try {
              const response = await fetch(
                `https://rest.ensembl.org/variation/homo_sapiens/${rsid}?content-type=application/json;pops=1`
              );
              if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
              }

              const fetchedData = await response.json();

              const allele = fetchedData["mappings"][0]["allele_string"].split("/");
              const ref = allele[0];
              const alt = allele.slice(1).join(",");

              const pop = [
                "1000GENOMES:phase_3:AMR",
                "1000GENOMES:phase_3:EUR",
                "1000GENOMES:phase_3:AFR",
                "1000GENOMES:phase_3:SAS",
                "1000GENOMES:phase_3:EAS",
              ];

              const frequencies = fetchedData["populations"].flatMap((p: any) =>
                pop.includes(p["population"]) && p["allele"] === ref
                  ? [
                      {
                        population: p.population.replace("1000GENOMES:phase_3:", ""),
                        frequency: p.frequency,
                      },
                    ]
                  : []
              );

              results[rsid] = { ref, alt, frequencies };
            } catch (err: any) {
              results[rsid] = null; // If an error occurs for a specific rsid, set it as null
            }
          })
        );

        if (!cancelled) setData(results); // Update state with new results
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Unknown error");
          setData({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [rsidKey, entityType]); // Value-based key, so equal rsid sets do not refetch

  return { data, loading, error };
}
