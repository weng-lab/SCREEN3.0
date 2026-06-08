"use client";
import { CircularProgress, Alert, Box } from "@mui/material";
import GenomeBrowserView from "common/components/GenomeBrowser/GenomeBrowserView";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASSnpsData } from "common/hooks/useGWASSnpsData";
import { useEffect, useMemo, useState } from "react";
import SelectLdBlock from "./SelectLdBlock";
import { expandCoordinates } from "common/components/GenomeBrowser/utils";
import { createDataStoreMemo, useCustomData } from "@weng-lab/genomebrowser";
import type { GenomicRange } from "common/types/globalTypes";

export default function GwasBrowser({ entity }: EntityViewComponentProps) {
  const { data: data, loading: loading, error: error } = useGWASSnpsData({ studyid: [entity.entityID] });
  const [resolvedCoordinates, setResolvedCoordinates] = useState<{ key: string; coordinates: GenomicRange } | null>(
    null
  );

  const ldblockStats = useMemo(() => {
    if (!data) return [];

    const map = new Map<number, { ldblock: number; chromosome: string; start: number; end: number }>();

    for (const { ldblock, chromosome, start, stop } of data) {
      if (!map.has(ldblock)) {
        map.set(ldblock, { ldblock, chromosome, start, end: stop });
      } else {
        const entry = map.get(ldblock)!;
        entry.start = Math.min(entry.start, start);
        entry.end = Math.max(entry.end, stop);
      }
    }

    return Array.from(map.values()).sort((a, b) => a.ldblock - b.ldblock);
  }, [data]);

  const [selectedLdBlock, setselectedLdBlock] = useState<{
    ldblock: number;
    chromosome: string;
    start: number;
    end: number;
  } | null>(null);

  useEffect(() => {
    if (ldblockStats.length > 0 && !selectedLdBlock) {
      setselectedLdBlock(ldblockStats[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ldblockStats]);

  useEffect(() => {
    setselectedLdBlock(null);
    setResolvedCoordinates(null);
  }, [entity.entityID]);

  const [ldblockOpen, setLdBlockOpen] = useState(false);
  const onLdBlockSelected = (ldblock: { ldblock: number; chromosome: string; start: number; end: number }) => {
    setselectedLdBlock(ldblock);
  };

  const handleSelectLDblockClick = () => {
    setLdBlockOpen(!ldblockOpen);
  };

  const handleLdBlockSelected = (ldblock: { ldblock: number; chromosome: string; start: number; end: number }) => {
    onLdBlockSelected(ldblock);
  };

  const coordinates = useMemo<GenomicRange | null>(() => {
    if (selectedLdBlock) {
      return expandCoordinates(
        {
          chromosome: selectedLdBlock.chromosome,
          start: selectedLdBlock.start,
          end: selectedLdBlock.end,
        },
        "gwas"
      );
    }
    if (!ldblockStats || ldblockStats === null || ldblockStats.length === 0) {
      if (loading) return null;
      return {
        chromosome: "chr1",
        start: 1000000,
        end: 1500000,
      };
    }
    return { chromosome: ldblockStats[0].chromosome, start: ldblockStats[0].start, end: ldblockStats[0].end };
  }, [selectedLdBlock, ldblockStats, loading]);

  useEffect(() => {
    if (!coordinates) return;
    setResolvedCoordinates((current) =>
      current?.key === entity.entityID &&
      current.coordinates.chromosome === coordinates.chromosome &&
      current.coordinates.start === coordinates.start &&
      current.coordinates.end === coordinates.end
        ? current
        : { key: entity.entityID, coordinates }
    );
  }, [coordinates, entity.entityID]);

  const dataStore = createDataStoreMemo();

  useCustomData(
    "ld-track-ignore",
    {
      data: data,
      loading: loading,
      error: error as any,
    },
    dataStore
  );

  const currentCoordinates = resolvedCoordinates?.key === entity.entityID ? resolvedCoordinates.coordinates : null;

  if (!currentCoordinates && loading) return <CircularProgress />;
  if (error && !currentCoordinates)
    return (
      <Alert severity="error" variant="outlined">
        Error Fetching Genome Browser
      </Alert>
    );

  if (!currentCoordinates) return <CircularProgress />;

  return (
    <>
      <Box display="flex" gap={2}>
        <SelectLdBlock
          open={ldblockOpen}
          setOpen={handleSelectLDblockClick}
          onLdBlockSelect={handleLdBlockSelected}
          ldblockList={ldblockStats}
          ldblock={selectedLdBlock ?? null}
        />
      </Box>
      <GenomeBrowserView
        entity={entity}
        coordinates={currentCoordinates}
        dataStore={dataStore}
        handleSelectLDBlock={handleSelectLDblockClick}
      />
    </>
  );
}
