import { useEffect, useMemo } from "react";
import type { EntityViewComponentProps } from "common/entityTabsConfig/types";
import type { GenomicRange } from "common/types/globalTypes";
import { expandCoordinates } from "../utils";
import { useLocalBrowser, useLocalTracks } from "./useLocalBrowser";
import { useEntityInteractions } from "./useEntityInteractions";

/** Owned by the keyed entity view: coordinates seed the session; navigation changes it explicitly. */
export function useBrowserSession(entity: EntityViewComponentProps["entity"], coordinates: GenomicRange) {
  const { chromosome, start, end } = coordinates;
  const expandedCoordinates = useMemo(
    () => expandCoordinates({ chromosome, start, end }, entity.entityType),
    [chromosome, start, end, entity.entityType]
  );
  const useBrowserStore = useLocalBrowser({
    name: entity.entityID,
    assembly: entity.assembly,
    entityCoordinates: coordinates,
    browserDomain: expandedCoordinates,
    type: entity.entityType,
  });
  const callbacks = useEntityInteractions(useBrowserStore, entity.assembly);
  const useTrackStore = useLocalTracks(entity.assembly, entity.entityType, entity.entityID, callbacks);
  useEffect(() => {
    if (entity.entityType === "gwas") useBrowserStore.getState().setRegion(expandedCoordinates);
  }, [expandedCoordinates, useBrowserStore, entity.entityType]);
  return { useBrowserStore, useTrackStore, callbacks, expandedCoordinates };
}
