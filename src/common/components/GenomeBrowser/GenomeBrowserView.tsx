"use client";

// @mui
import { Search } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// @weng-lab
import { Browser, Chromosome, DataStoreInstance, Rect, TrackStoreInstance } from "@weng-lab/genomebrowser";
import { Domain, GenomeSearch, Result } from "@weng-lab/ui-components";

// internal
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { GenomicRange } from "common/types/globalTypes";
import HighlightDialog from "./Dialogs/HighlightDialog";
import { expandCoordinates, randomColor, SearchToScreenTypes } from "./utils";
import TrackSelectModal from "./TrackSelect/TrackSelectModal";
import { useLocalBrowser, useLocalTracks } from "./Context/useLocalBrowser";

// icons
import PageviewIcon from "@mui/icons-material/Pageview";
import ControlButtons from "./Controls/ControlButtons";
import DomainDisplay from "./Controls/DomainDisplay";
import { useCallback, useEffect, useMemo } from "react";
import { TrackCallbacks } from "./TrackSelect/defaultTracks";
import { Exon } from "common/types/generated/graphql";
import { useRouter } from "next/navigation";

interface Transcript {
  id: string;
  name: string;
  coordinates: Domain;
  strand: string;
  exons?: Exon[];
  color?: string;
}

export type GenomeBrowserViewProps = EntityViewComponentProps & {
  coordinates: GenomicRange;
  dataStore?: DataStoreInstance;
};

export default function GenomeBrowserView({ entity, coordinates, dataStore }: GenomeBrowserViewProps) {
  /**
   * @todo when refactoring this to include GWAS need to change this logic
   */
  const name =
    entity.entityType === "region"
      ? entity.entityID.replace("%3A", ":")
      : entity.entityType === "bed"
        ? `${coordinates[0].chromosome}:${coordinates[0].start}-${coordinates[0].end}`
        : entity.entityID;

  const browserStore = useLocalBrowser(entity.entityID, entity.assembly, coordinates, entity.entityType);

  const setDomain = browserStore((s) => s.setDomain);
  useEffect(() => {
    setDomain({ ...coordinates, chromosome: coordinates.chromosome as Chromosome });
  }, [coordinates, setDomain]);

  // interaction callback functions
  const addHighlight = browserStore((s) => s.addHighlight);
  const removeHighlight = browserStore((s) => s.removeHighlight);
  const onHover = useCallback(
    (item: Rect | Transcript) => {
      const domain =
        "start" in item
          ? { start: item.start, end: item.end }
          : { start: item.coordinates.start, end: item.coordinates.end };

      addHighlight({
        id: "hover-highlight",
        domain,
        color: item.color || "blue",
      });
    },
    [addHighlight]
  );
  const onLeave = useCallback(() => {
    removeHighlight("hover-highlight");
  }, [removeHighlight]);

  const router = useRouter();
  const onCCREClick = useCallback(
    (item: Rect) => {
      const accession = item.name;
      router.push(`/${entity.assembly}/ccre/${accession}`);
    },
    [entity.assembly, router]
  );
  const onGeneClick = useCallback(
    (gene: Transcript) => {
      const name = gene.name;
      if (name.includes("ENSG")) {
        return;
      }
      router.push(`/${entity.assembly}/gene/${name}`);
    },
    [entity.assembly, router]
  );

  // Bundle callbacks for track injection
  const callbacks = useMemo<TrackCallbacks>(
    () => ({
      onHover,
      onLeave,
      onCCREClick,
      onGeneClick,
    }),
    [onHover, onLeave, onCCREClick, onGeneClick]
  );
  const trackStore = useLocalTracks(entity.assembly, entity.entityType, callbacks);

  const editTrack = trackStore((state) => state.editTrack);
  const handeSearchSubmit = (r: Result) => {
    if (r.type === "Gene") {
      editTrack("ignore-gene-track", {
        geneName: r.title,
      });
    }
    addHighlight({
      domain: r.domain,
      color: randomColor(),
      id: r.title,
      opacity: 0.1,
    });

    setDomain(expandCoordinates(r.domain, SearchToScreenTypes[r.type]));
  };

  const theme = useTheme();

  const geneVersion = entity.assembly === "GRCh38" ? [29, 40] : 25;

  useDataLogger(trackStore, dataStore);

  return (
    <Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
        <Box display="flex" gap={2} alignItems="center" flex={1}>
          <GenomeSearch
            size="small"
            assembly={entity.assembly}
            geneVersion={geneVersion}
            onSearchSubmit={handeSearchSubmit}
            queries={["Gene", "SNP", "cCRE", "Coordinate"]}
            geneLimit={3}
            sx={{ minWidth: 300, maxWidth: 450, flex: 1 }}
            slots={{
              button: (
                <IconButton sx={{ color: theme.palette.primary.main }}>
                  <Search />
                </IconButton>
              ),
            }}
            slotProps={{
              input: {
                label: "Change Browser Region",
                sx: {
                  backgroundColor: "white",
                  "& label.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              },
            }}
          />
          {entity.entityType !== "gwas" && (
            <Button
              variant="contained"
              startIcon={<PageviewIcon />}
              color="primary"
              size="small"
              onClick={() =>
                setDomain(
                  expandCoordinates(Array.isArray(coordinates) ? coordinates[0] : coordinates, entity.entityType)
                )
              }
            >
              Recenter on {name || "Selected Region"}
            </Button>
          )}
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <HighlightDialog browserStore={browserStore} />
          <TrackSelectModal trackStore={trackStore} assembly={entity.assembly} callbacks={callbacks} />
        </Box>
        {/* Add new track select button and modal here */}
      </Stack>
      {/* Browser Controls */}
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        justifyContent={"space-between"}
        alignItems={"center"}
        border={"1px solid rgb(204, 204, 204)"}
        borderBottom={"none"}
        p={1}
        mt={2}
      >
        <DomainDisplay browserStore={browserStore} assembly={entity.assembly} />
        <ControlButtons browserStore={browserStore} />
      </Stack>
      <Browser browserStore={browserStore} trackStore={trackStore} externalDataStore={dataStore} />
    </Stack>
  );
}

function useDataLogger(trackStore: TrackStoreInstance, dataStore: DataStoreInstance) {
  const ids = trackStore((s) => s.ids);

  useEffect(() => {
    const unsubscribe = dataStore.subscribe((state) => {
      console.log("=== Data Store Updated ===");
      ids.forEach((id) => {
        const data = state.getTrackData(id);
        console.log(`Track ${id}:`, data);
      });
    });

    return unsubscribe;
  }, [ids, dataStore]);
}
