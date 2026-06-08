"use client";
import { Alert, CircularProgress } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import type { GenomicRange } from "common/types/globalTypes";
import { decodeRegions } from "common/utility";
import { useEffect, useMemo, useState } from "react";
import GenomeBrowserView from "./GenomeBrowserView";

export default function GenomeBrowser({ entity }: EntityViewComponentProps) {
  const { data, loading, error } = useEntityMetadata(entity);
  const entityKey = `${entity.assembly}:${entity.entityType}:${entity.entityID}`;
  const [resolvedCoordinates, setResolvedCoordinates] = useState<{ key: string; coordinates: GenomicRange } | null>(null);

  const coordinates = useMemo(() => {
    if (!data || data.__typename === "GwasStudiesMetadata") return null;
    if (data.__typename === "SCREENSearchResult") {
      return { chromosome: data.chrom, start: data.start, end: data.start + data.len };
    }
    if (data.__typename === "Bed") {
      if (typeof window === "undefined") return null;
      const encoded = sessionStorage.getItem(entity.entityID);
      return decodeRegions(encoded);
    } else return data.coordinates;
  }, [data, entity.entityID]);

  useEffect(() => {
    setResolvedCoordinates(null);
  }, [entityKey]);

  useEffect(() => {
    if (!coordinates) return;
    const nextCoordinates = Array.isArray(coordinates) ? coordinates[0] : coordinates;
    setResolvedCoordinates((current) =>
      current?.key === entityKey &&
      current.coordinates.chromosome === nextCoordinates.chromosome &&
      current.coordinates.start === nextCoordinates.start &&
      current.coordinates.end === nextCoordinates.end
        ? current
        : { key: entityKey, coordinates: nextCoordinates }
    );
  }, [coordinates, entityKey]);

  const currentCoordinates = resolvedCoordinates?.key === entityKey ? resolvedCoordinates.coordinates : null;

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
