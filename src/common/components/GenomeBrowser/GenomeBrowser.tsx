"use client";
import { Alert, CircularProgress } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { useMemo } from "react";
import GenomeBrowserView from "./GenomeBrowserView";
import { decodeRegions } from "common/utility";

export default function GenomeBrowser({ entity }: EntityViewComponentProps) {
  const { data, loading, error } = useEntityMetadata(entity);

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

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error" variant="outlined">
        Error Fetching Genome Browser
      </Alert>
    );

  return <GenomeBrowserView entity={entity} entityCoordinates={coordinates} />;
}
