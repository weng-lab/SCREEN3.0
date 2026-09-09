"use client";

// @mui
import { Search } from "@mui/icons-material";
import { Alert, Box, Button, IconButton, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

// @weng-lab
import { GenomeBrowser, createSettingsStore } from "@weng-lab/genomebrowser";
import { TrackBaseSettings } from "@weng-lab/genomebrowser-tracks/shared";
import { LDDataContext } from "./modules/ld";
import type { LDSnp } from "./modules/ldData";
import { GenomeSearch, Result } from "@weng-lab/ui-components";

// internal
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { GenomicRange } from "common/types/globalTypes";
import HighlightDialog from "./Dialogs/HighlightDialog";
import SettingsModal from "./Dialogs/SettingsModal";
import { expandCoordinates, randomColor, SearchToScreenTypes } from "./utils";
import TrackSelectModal from "./TrackSelect/TrackSelectModal";
import { useLocalBrowser, useLocalTracks } from "./Context/useLocalBrowser";

// icons
import PageviewIcon from "@mui/icons-material/Pageview";
import ControlButtons from "./Controls/ControlButtons";
import DomainDisplay from "./Controls/DomainDisplay";
import { useEffect, useMemo, useRef } from "react";
import { TrackCallbacks } from "./TrackSelect/defaultTracks";
import { useRouter } from "next/navigation";
export type GenomeBrowserViewProps = EntityViewComponentProps & {
  coordinates: GenomicRange;
  ldData?: { data: readonly LDSnp[]; loading: boolean; error?: string };
  handleSelectLDBlock?: () => void;
};

const EMPTY_LD_DATA = { data: [], loading: false } satisfies NonNullable<GenomeBrowserViewProps["ldData"]>;

export default function GenomeBrowserView({
  entity,
  coordinates,
  ldData,
  handleSelectLDBlock,
}: GenomeBrowserViewProps) {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const breakpoint: "sm" | "md" | undefined = isSmall ? "sm" : isMedium ? "md" : undefined;

  /**
   * @todo when refactoring this to include GWAS need to change this logic
   */
  const name =
    entity.entityType === "region"
      ? entity.entityID.replace("%3A", ":")
      : entity.entityType === "bed"
        ? `${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`
        : entity.entityID;

  /**
   * The single place entity coordinates get padded for the browser. Callers pass the feature's own
   * coordinates and everything downstream - the starting domain, the GWAS domain sync, and the
   * recenter button - uses this one value, so the padding can never be applied twice.
   */
  const expandedCoordinates = useMemo(
    () => expandCoordinates(coordinates, entity.entityType),
    [coordinates, entity.entityType]
  );

  const useBrowserStore = useLocalBrowser({
    name: entity.entityID,
    assembly: entity.assembly,
    entityCoordinates: coordinates,
    browserDomain: expandedCoordinates,
    type: entity.entityType,
    breakpoint,
  });

  const setDomain = useBrowserStore((s) => s.setRegion);
  useEffect(() => {
    if (entity.entityType !== "gwas") return;
    setDomain(expandedCoordinates);
  }, [expandedCoordinates, setDomain, entity.entityType]);

  // interaction callback functions
  const addHighlight = useBrowserStore((s) => s.addHighlight);
  const removeHighlight = useBrowserStore((s) => s.removeHighlight);
  const router = useRouter();
  const callbacks = useMemo<TrackCallbacks>(() => {
    const hover = (item: { chromosome?: string; start: number; end: number; color?: string }) =>
      addHighlight({
        id: "hover-highlight",
        region: {
          chromosome: item.chromosome ?? useBrowserStore.getState().region.chromosome,
          start: item.start,
          end: item.end,
        },
        color: item.color || "#0000ff",
        opacity: 0.2,
      });
    const leave = () => removeHighlight("hover-highlight");
    return {
      regions: {
        onHover: hover,
        onLeave: leave,
        onClick: (item) => {
          const name = item.name ?? item.fields[0];
          if (name) router.push(`/${entity.assembly}/ccre/${encodeURIComponent(name)}`);
        },
      },
      genes: {
        onHover: (item) => hover(item.feature),
        onLeave: leave,
        onClick: (item) => {
          const name = item.feature.geneName;
          if (name && !name.startsWith("ENSG")) router.push(`/${entity.assembly}/gene/${encodeURIComponent(name)}`);
        },
      },
    };
  }, [addHighlight, removeHighlight, router, entity.assembly, useBrowserStore]);
  const useTrackStore = useLocalTracks(entity.assembly, entity.entityType, entity.entityID, callbacks);
  const useSettingsStore = useMemo(
    () => createSettingsStore({ baseSettingsComponent: TrackBaseSettings, modalComponent: SettingsModal }),
    []
  );
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resize = () =>
      useBrowserStore
        .getState()
        .setTrackWidth(Math.max(1, container.clientWidth - useBrowserStore.getState().marginWidth));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [useBrowserStore]);

  const handeSearchSubmit = (r: Result) => {
    if (r.type === "Gene") {
      for (const track of useTrackStore.getState().tracks) {
        if (track.type === "gene")
          useTrackStore.getState().updateTrack(track.base.id, { config: { geneName: r.title } });
      }
    }
    addHighlight({
      region: r.domain,
      color: randomColor(),
      id: r.title,
      opacity: 0.1,
    });

    setDomain(expandCoordinates(r.domain, SearchToScreenTypes[r.type] ?? "region"));
  };

  const geneVersion = entity.assembly === "GRCh38" ? [29, 40] : 25;

  return (
    <Stack ref={containerRef} sx={{ overflow: "hidden" }}>
      {entity.assembly === "mm10" && (
        <Alert severity="info">
          Mouse gene annotations are not yet available. Biosample tracks are available below.
        </Alert>
      )}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent={"space-between"}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ width: "100%", maxWidth: "100%", pt: 1 }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{ width: { xs: "100%", md: "auto" }, flex: { md: 1 }, maxWidth: { md: 600 } }}
        >
          <Box
            sx={{ width: { xs: "100%", md: "auto" }, minWidth: { md: 300 }, maxWidth: { md: 450 }, flex: { md: 1 } }}
          >
            <GenomeSearch
              size="small"
              assembly={entity.assembly}
              geneVersion={geneVersion}
              graphqlUrl="/api/graphql"
              onSearchSubmit={handeSearchSubmit}
              queries={["Gene", "SNP", "cCRE", "Coordinate"]}
              sx={{ width: "100%" }}
              slots={{
                button: IconButton,
              }}
              slotProps={{
                button: {
                  sx: { color: theme.palette.primary.main },
                  children: <Search />,
                },
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
          </Box>
          {entity.entityType !== "gwas" && (
            <Button
              variant="contained"
              startIcon={<PageviewIcon />}
              color="primary"
              size="small"
              onClick={() => setDomain(expandedCoordinates)}
              sx={{
                width: { xs: "100%", md: "auto" },
                whiteSpace: "nowrap",
                minHeight: 44,
              }}
            >
              Recenter on {name || "Selected Region"}
            </Button>
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "stretch", md: "flex-end" },
            "& > button": {
              flex: { xs: 1, md: "none" },
            },
          }}
        >
          <HighlightDialog browserStore={useBrowserStore} />
          {entity.entityType === "gwas" && (
            <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => handleSelectLDBlock?.()}>
              Select LD Block
            </Button>
          )}
          {entity.entityType !== "gwas" && (
            <TrackSelectModal trackStore={useTrackStore} assembly={entity.assembly} callbacks={callbacks} />
          )}
        </Stack>
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
        <DomainDisplay browserStore={useBrowserStore} assembly={entity.assembly} />
        <ControlButtons browserStore={useBrowserStore} />
      </Stack>
      <LDDataContext.Provider value={ldData ?? EMPTY_LD_DATA}>
        <GenomeBrowser
          key={`${entity.assembly}:${entity.entityType}:${entity.entityID}`}
          browserStore={useBrowserStore}
          trackStore={useTrackStore}
          settingsStore={useSettingsStore}
        />
      </LDDataContext.Provider>
    </Stack>
  );
}
