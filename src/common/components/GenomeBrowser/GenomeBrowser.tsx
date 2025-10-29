"use client";

import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { useMemo } from "react";
import GenomeBrowserView from "./GenomeBrowserView";
import { Alert, CircularProgress } from "@mui/material";

export default function GenomeBrowser({ entity }: EntityViewComponentProps) {
  const { data, loading, error } = useEntityMetadata(entity);

  const coordinates = useMemo(() => {
    if (!data || data.__typename === "GwasStudies") return null;
    if (data.__typename === "SCREENSearchResult") {
      return { chromosome: data.chrom, start: data.start, end: data.start + data.len };
    } else return data.coordinates;
  }, [data]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error" variant="outlined">
        Error Fetching Genome Browser
      </Alert>
    );

  return <GenomeBrowserView entity={entity} coordinates={coordinates} />;
}
