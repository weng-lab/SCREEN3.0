"use client";
import { EntityType } from "common/entityTabsConfig";
import { useEffect, useRef, useState } from "react";

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

  // rsids is often passed as a fresh array literal on every render, so compare
  // its content instead of its identity to decide when a new fetch is needed.
  const rsidsKey = rsids && rsids.length > 0 ? [...new Set(rsids)].join(",") : "";
  const prevRsidsKey = useRef<string | null>(null);
  if (rsidsKey !== "" && rsidsKey !== prevRsidsKey.current) {
    prevRsidsKey.current = rsidsKey;
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    if (entityType !== undefined && entityType !== "variant") return;

    // loading is set to true (above) before this effect runs for a new rsidsKey,
    // so it isn't part of this guard; data is the source of truth for "already fetched."
    if (data || !rsids || rsids.length === 0) return; // Avoid fetching if no rsids are provided

    // Prevent multiple fetch calls for the same rsid
    const rsidsToFetch = [...new Set(rsids)];

    if (rsidsToFetch.length === 0) return; // If all rsids are already fetched, do nothing

    const fetchData = async () => {
      try {
        const results: { [rsid: string]: SnpFrequencies | null } = { ...data };

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

              const frequencies = fetchedData["populations"]
                .filter((p: any) => pop.includes(p["population"]) && p["allele"] === ref)
                .map((f: any) => ({
                  population: f.population.replace("1000GENOMES:phase_3:", ""),
                  frequency: f.frequency,
                }));

              results[rsid] = { ref, alt, frequencies };
            } catch (err: any) {
              results[rsid] = null; // If an error occurs for a specific rsid, set it as null
            }
          })
        );

        setData(results); // Update state with new results
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rsids]); // Only trigger fetch if rsids array changes or new rsids are added

  return { data, loading, error };
}
