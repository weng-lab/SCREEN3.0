"use client";
import { CircularProgress, Alert, Box } from "@mui/material";
import GenomeBrowserView from "common/components/GenomeBrowser/GenomeBrowserView";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASSnpsData } from "common/hooks/data/gwas";
import { useMemo, useState } from "react";
import SelectLdBlock from "./SelectLdBlock";
import { useStableCoordinates } from "common/components/GenomeBrowser/utils";
import { createDataStoreMemo, useCustomData } from "@weng-lab/genomebrowser";
import type { GenomicRange } from "common/types/globalTypes";
import type { LdBlock } from "./types";

/** Shown when a study has no LD blocks to focus the browser on */
const FALLBACK_COORDINATES: GenomicRange = { chromosome: "chr1", start: 1000000, end: 1500000 };

export default function GwasBrowser({ entity }: EntityViewComponentProps) {
  const { data: data, loading: loading, error: error } = useGWASSnpsData({ studyid: [entity.entityID] });

  const ldblockStats = useMemo<LdBlock[]>(() => {
    if (!data) return [];

    const map = new Map<number, LdBlock>();

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

  /**
   * Keyed by study so a block picked for one study is never applied to the next one. Storing the
   * key alongside the selection removes the need for an effect that clears it on entity change.
   */
  const [selection, setSelection] = useState<{ studyId: string; ldblock: LdBlock } | null>(null);
  const selectedLdBlock = selection?.studyId === entity.entityID ? selection.ldblock : null;

  /**
   * Falling back to the first block during render, rather than assigning it in an effect, means the
   * first render after data arrives already has the default block. The effect version rendered once
   * with no selection first, briefly showing an unexpanded domain before widening it.
   */
  const activeLdBlock = selectedLdBlock ?? ldblockStats[0] ?? null;

  const [ldblockOpen, setLdBlockOpen] = useState(false);

  const handleSelectLDblockClick = () => {
    setLdBlockOpen(!ldblockOpen);
  };

  const handleLdBlockSelected = (ldblock: LdBlock) => {
    setSelection({ studyId: entity.entityID, ldblock });
  };

  // Passed unpadded - GenomeBrowserView owns the one call to expandCoordinates
  const stableLdBlock = useStableCoordinates(activeLdBlock);
  const currentCoordinates = stableLdBlock ?? (loading ? null : FALLBACK_COORDINATES);

  const dataStore = createDataStoreMemo();

  useCustomData(
    "ld-track-ignore",
    {
      data: data,
      loading: loading,
      error: error ? { message: error.message } : undefined,
    },
    dataStore
  );

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
          ldblock={activeLdBlock}
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
