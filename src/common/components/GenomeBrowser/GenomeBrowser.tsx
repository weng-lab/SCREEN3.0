"use client";
import { Alert, CircularProgress } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/data/entity";
import type { GenomicRange } from "common/types/globalTypes";
import { decodeRegions } from "common/utils";
import { useMemo } from "react";
import GenomeBrowserView from "./GenomeBrowserView";

export default function GenomeBrowser({ entity }: EntityViewComponentProps) {
  const { data, loading, error } = useEntityMetadata(entity);

  const coordinates = useMemo(() => {
    if (!data || data.__typename === "GwasStudiesMetadata") return null;
    if (data.__typename === "Bed") {
      if (typeof window === "undefined") return null;
      const encoded = sessionStorage.getItem(entity.entityID);
      return decodeRegions(encoded);
    } else return data.coordinates;
  }, [data, entity.entityID]);

  /**
   * The metadata hooks rebuild region objects on every render, so key the memo on the values
   * themselves. That way GenomeBrowserView only sees a new reference when the region actually
   * changes, instead of on every render.
   */
  const region = Array.isArray(coordinates) ? coordinates[0] : coordinates;
  const chromosome = region?.chromosome;
  const start = region?.start;
  const end = region?.end;
  const currentCoordinates = useMemo<GenomicRange | null>(
    () => (chromosome === undefined ? null : { chromosome, start, end }),
    [chromosome, start, end]
  );

  if (!currentCoordinates && loading) return <CircularProgress />;
  if (error && !currentCoordinates)
    return (
      <Alert severity="error" variant="outlined">
        Error Fetching Genome Browser
      </Alert>
    );

  if (!currentCoordinates) return <CircularProgress />;

  return <GenomeBrowserView entity={entity} coordinates={currentCoordinates} />;
}
