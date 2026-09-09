import { Box, Stack, Typography } from "@mui/material";
import type { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import { Cytobands } from "@weng-lab/genomebrowser-ui";
import { readCytobands, type Cytoband } from "@weng-lab/genomic-reader";
import { useEffect, useRef, useState } from "react";
import { assemblies } from "common/assemblies";
import type { Assembly } from "common/types/globalTypes";

export default function DomainDisplay({
  browserStore: useBrowserStore,
  assembly,
}: {
  browserStore: BrowserStoreInstance;
  assembly: Assembly;
}) {
  const region = useBrowserStore((s) => s.region);
  const chromosomeLength = useBrowserStore((s) => s.assembly.chromosomes[region.chromosome]);
  const [bands, setBands] = useState<{ assembly: Assembly; data: readonly Cytoband[] } | null>(null);
  const [error, setError] = useState<Assembly | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  useEffect(() => {
    const controller = new AbortController();
    readCytobands({
      url: new URL(assemblies[assembly].files.cytobands, window.location.href).href,
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) {
          setBands({ assembly, data });
          setError(null);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(assembly);
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
        {error === assembly ? (
          <Typography variant="caption">Unable to load chromosome bands</Typography>
        ) : (
          <Cytobands
            bands={bands?.assembly === assembly ? bands.data : []}
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
