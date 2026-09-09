import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Box, Stack, Typography } from "@mui/material";
import type { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import { Cytobands } from "@weng-lab/genomebrowser-ui";
import { readCytobands, type Cytoband } from "@weng-lab/genomic-reader";
import { useEffect, useRef, useState } from "react";

const MOUSE_CYTOBANDS = gql`
  query BrowserMouseCytobands($chromosome: String!) {
    cytoband(assembly: "mm10", chromosome: $chromosome) {
      stain
      coordinates {
        chromosome
        start
        end
      }
    }
  }
`;
type MouseCytobands = {
  cytoband: { stain: string; coordinates: { chromosome: string; start: number; end: number } }[];
};

export default function DomainDisplay({
  browserStore: useBrowserStore,
  assembly,
}: {
  browserStore: BrowserStoreInstance;
  assembly: string;
}) {
  const region = useBrowserStore((s) => s.region);
  const chromosomeLength = useBrowserStore((s) => s.assembly.chromosomes[region.chromosome]);
  const mouse = useQuery<MouseCytobands>(MOUSE_CYTOBANDS, {
    variables: { chromosome: region.chromosome },
    skip: assembly !== "mm10",
  });
  const [bands, setBands] = useState<readonly Cytoband[]>([]);
  const [error, setError] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  useEffect(() => {
    if (assembly !== "GRCh38") return;
    const controller = new AbortController();
    readCytobands({
      url: new URL("/genome-browser/hg38.cytoBand.txt", window.location.href).href,
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) {
          setBands(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [assembly]);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const resize = () => setWidth(element.clientWidth);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <Stack alignItems="center" sx={{ width: "100%", maxWidth: 450 }}>
      <Typography>
        {region.chromosome}:{region.start.toLocaleString()}-{region.end.toLocaleString()}
      </Typography>
      <Box ref={container} sx={{ width: "100%", minHeight: 20 }}>
        {(assembly === "mm10" ? mouse.error : error) ? (
          <Typography variant="caption">Unable to load chromosome bands</Typography>
        ) : (
          <Cytobands
            bands={
              assembly === "mm10"
                ? (mouse.data?.cytoband ?? []).map((b) => ({ ...b.coordinates, name: "", stain: b.stain }))
                : bands
            }
            chromosome={region.chromosome}
            chromosomeLength={chromosomeLength}
            currentRegion={region}
            width={width}
            height={20}
          />
        )}
      </Box>
    </Stack>
  );
}
