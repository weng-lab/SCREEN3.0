"use client";

// @mui
import { Stack } from "@mui/material";

// @weng-lab
import { GenomeBrowser } from "@weng-lab/genomebrowser";
import { LDDataContext } from "./modules/ld";
import type { LDSnp } from "./modules/ldData";

// internal
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { GenomicRange } from "common/types/globalTypes";
import BrowserControls from "./Controls/BrowserControls";
import { useBrowserSession } from "./Context/useBrowserSession";

// icons
import DomainDisplay from "./Controls/DomainDisplay";
export type GenomeBrowserViewProps = EntityViewComponentProps & {
  coordinates: GenomicRange;
  ldData?: { data: readonly LDSnp[]; loading: boolean; error?: string };
  handleSelectLDBlock?: () => void;
};

const EMPTY_LD_DATA = { data: [], loading: false } satisfies NonNullable<GenomeBrowserViewProps["ldData"]>;

export default function GenomeBrowserView(props: GenomeBrowserViewProps) {
  const { assembly, entityType, entityID } = props.entity;
  return <EntityBrowserSession key={`${assembly}:${entityType}:${entityID}`} {...props} />;
}

function EntityBrowserSession({ entity, coordinates, ldData, handleSelectLDBlock }: GenomeBrowserViewProps) {
  const name =
    entity.entityType === "region"
      ? entity.entityID.replace("%3A", ":")
      : entity.entityType === "bed"
        ? `${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`
        : entity.entityID;

  const { useBrowserStore, useTrackStore, callbacks, expandedCoordinates } = useBrowserSession(entity, coordinates);
  const setDomain = useBrowserStore((state) => state.setRegion);

  return (
    <Stack sx={{ overflow: "hidden" }}>
      <BrowserControls
        browserStore={useBrowserStore}
        trackStore={useTrackStore}
        assembly={entity.assembly}
        callbacks={callbacks}
        canSelectTracks={entity.entityType !== "gwas"}
        onRecenter={entity.entityType === "gwas" ? undefined : () => setDomain(expandedCoordinates)}
        recenterLabel={`Recenter on ${name || "Selected Region"}`}
        onSelectLDBlock={entity.entityType === "gwas" ? handleSelectLDBlock : undefined}
      />
      <DomainDisplay browserStore={useBrowserStore} assembly={entity.assembly} />
      <LDDataContext.Provider value={ldData ?? EMPTY_LD_DATA}>
        <GenomeBrowser browserStore={useBrowserStore} trackStore={useTrackStore} />
      </LDDataContext.Provider>
    </Stack>
  );
}
