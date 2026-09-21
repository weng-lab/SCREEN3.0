import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import type { Assembly } from "common/types/globalTypes";
import type { TrackCallbacks } from "../TrackSelect/defaultTracks";

/** SCREEN routing and hover policy; track modules remain independent of entity navigation. */
export function useEntityInteractions(useBrowserStore: BrowserStoreInstance, assembly: Assembly) {
  // interaction callback functions
  const addHighlight = useBrowserStore((s) => s.addHighlight);
  const removeHighlight = useBrowserStore((s) => s.removeHighlight);
  const router = useRouter();
  return useMemo<TrackCallbacks>(() => {
    const hover = (item: { chromosome?: string; start: number; end: number; color?: string }) =>
      addHighlight({
        id: "hover-highlight",
        region: {
          chromosome: item.chromosome ?? useBrowserStore.getState().region.chromosome,
          start: item.start,
          end: item.end,
        },
        color: item.color || "#0000ff",
        opacity: 0.2,
      });
    const leave = () => removeHighlight("hover-highlight");
    return {
      regions: {
        onHover: hover,
        onLeave: leave,
        onClick: (item) => {
          const name = item.name ?? item.fields[0];
          if (name) router.push(`/${assembly}/ccre/${encodeURIComponent(name)}`);
        },
      },
      genes: {
        onHover: (item) => hover(item.feature),
        onLeave: leave,
        onClick: (item) => {
          const name = item.feature.geneName;
          if (name && !name.startsWith("ENSG")) router.push(`/${assembly}/gene/${encodeURIComponent(name)}`);
        },
      },
    };
  }, [addHighlight, removeHighlight, router, assembly, useBrowserStore]);
}
