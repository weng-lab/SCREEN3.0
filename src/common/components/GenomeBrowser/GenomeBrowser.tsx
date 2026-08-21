"use client";
import { Alert, CircularProgress } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/data/entity";
import { decodeRegions } from "common/utils";
import { useMemo } from "react";
import GenomeBrowserView from "./GenomeBrowserView";
import { useStableCoordinates } from "./utils";

export default function GenomeBrowser({ entity }: EntityViewComponentProps) {
  const { data, error } = useEntityMetadata(entity);

  const coordinates = useMemo(() => {
    if (!data || data.__typename === "GwasStudiesMetadata") return null;
    if (data.__typename === "Bed") {
      if (typeof window === "undefined") return null;
      const encoded = sessionStorage.getItem(entity.entityID);
      return decodeRegions(encoded);
    } else return data.coordinates;
  }, [data, entity.entityID]);

  const region = Array.isArray(coordinates) ? coordinates[0] : coordinates;
  const currentCoordinates = useStableCoordinates(region);

  if (error && !currentCoordinates)
    return (
      <Alert severity="error" variant="outlined">
        Error Fetching Genome Browser
      </Alert>
    );

  if (!currentCoordinates) return <CircularProgress />;

  return <GenomeBrowserView entity={entity} coordinates={currentCoordinates} />;
}
