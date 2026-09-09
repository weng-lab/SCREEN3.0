import { firstPartyTrackModules } from "@weng-lab/genomebrowser-tracks";
import { bigBedModule } from "@weng-lab/genomebrowser-tracks/bigbed";
import { ccreBigBedModule } from "@weng-lab/genomebrowser-tracks/ccre";
import { bulkBedModule } from "@weng-lab/genomebrowser-tracks/bulkbed";
import type { Assembly } from "common/types/globalTypes";
import CCRETooltip from "../Tooltips/CcreTooltip";
import ChromHmmTooltip from "../Tooltips/ChromHMMTooltip";
import { catalogEntries, isChromHmm } from "../TrackSelect/collections";
import { tfPeaksModule } from "./tfPeaks";
import { ldModule } from "./ld";

// Customize only tooltip components; fetching, rendering and settings remain first-party.
// Resolve host metadata by URL, keeping it out of validated runtime config and persisted callbacks.
export function createScreenModules(assembly: Assembly) {
  const entries = catalogEntries(assembly);
  const byUrl = new Map(entries.filter((e) => typeof e.config.url === "string").map((e) => [String(e.config.url), e]));
  const ccre = {
    ...ccreBigBedModule,
    tooltipComponent: ({ item, context }) => {
      const entry = byUrl.get(context.config.url);
      const metadata = entry?.metadata;
      const sample = metadata?.sourceSampleId;
      return (
        <CCRETooltip
          assembly={assembly}
          classification={item.ccreClass}
          color={item.color}
          name={item.name ?? item.fields[0]}
          biosample={
            typeof sample === "string" && sample !== "aggregate-biosample-data"
              ? { name: sample, displayname: String(metadata.displayName ?? sample) }
              : undefined
          }
        />
      );
    },
  } satisfies typeof ccreBigBedModule;
  const bed = {
    ...bigBedModule,
    tooltipComponent: ({ item, context }) => {
      const entry = byUrl.get(context.config.url);
      if (String(entry?.metadata.assay).toLowerCase() === "ccre") {
        const sample = entry.metadata.sourceSampleId;
        return (
          <CCRETooltip
            assembly={assembly}
            name={item.name ?? item.fields[0]}
            biosample={
              typeof sample === "string" && sample !== "aggregate-biosample-data"
                ? { name: sample, displayname: String(entry.metadata.displayName ?? sample) }
                : undefined
            }
          />
        );
      }
      return entry && isChromHmm(entry) ? (
        <ChromHmmTooltip rect={item} tissue={String(entry.metadata.displayName)} assembly={assembly} />
      ) : (
        <bigBedModule.tooltipComponent item={item} context={context} />
      );
    },
  } satisfies typeof bigBedModule;
  const bulk = {
    ...bulkBedModule,
    tooltipComponent: ({ item }) => <ChromHmmTooltip rect={item} tissue={item.datasetName ?? ""} assembly={assembly} />,
  } satisfies typeof bulkBedModule;
  return [
    ...firstPartyTrackModules.filter((m) => !["bigbed", "ccre-bigbed", "bulkbed"].includes(m.type)),
    bed,
    ccre,
    bulk,
    tfPeaksModule,
    ldModule,
  ];
}
