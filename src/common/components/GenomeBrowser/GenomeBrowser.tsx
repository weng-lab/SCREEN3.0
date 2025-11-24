"use client";
import { Alert, CircularProgress } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { useMemo } from "react";
import useLocalBrowser from "./Context/useBrowserStore";
import GenomeBrowserView from "./GenomeBrowserView";

export default function GenomeBrowser({ entity }: EntityViewComponentProps) {
  const { data, loading, error } = useEntityMetadata(entity);

  const coordinates = useMemo(() => {
    if (!data || data.__typename === "GwasStudiesMetadata") return null;
    if (data.__typename === "SCREENSearchResult") {
      return { chromosome: data.chrom, start: data.start, end: data.start + data.len };
    } else return data.coordinates;
  }, [data]);

  const { browserStore, trackStore } = useLocalBrowser(entity.entityID, coordinates, entity.entityType);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error" variant="outlined">
        Error Fetching Genome Browser
      </Alert>
    );

  return (
    <GenomeBrowserView
      entity={entity}
      entityCoordinates={coordinates}
      browserStore={browserStore}
      trackStore={trackStore}
    />
  );
}
