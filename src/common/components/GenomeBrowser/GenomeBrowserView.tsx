"use client";
import { Search } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Browser,
  Chromosome,
  createBrowserStoreMemo,
  createTrackStoreMemo,
  DisplayMode,
  InitialBrowserState,
  Rect,
  Track,
  TrackType,
} from "@weng-lab/genomebrowser";
import { Domain, GenomeSearch, Result } from "@weng-lab/ui-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenomicRange } from "common/types/globalTypes";
import ControlButtons from "./ControlButtons";
import HighlightDialog from "./HighlightDialog";
import { randomColor } from "./utils";
import { Exon } from "common/types/generated/graphql";
import { useRouter } from "next/navigation";
import { AnyEntityType, EntityViewComponentProps } from "common/entityTabsConfig";
import CCRETooltip from "./CcreTooltip";
import DomainDisplay from "./DomainDisplay";
import GBButtons from "./GBButtons";
import { RegistryBiosamplePlusRNA } from "common/components/BiosampleTables/types";
import { humanDefaultTracks, mouseDefaultTracks } from "./constants";
import { useBiosampleTracks } from "./Biosample/useBiosampleTracks";
import { useChromHmmTracks } from "./ChromHMM/useChromHmmTracks";
import {
  getLocalBrowser,
  getLocalTracks,
  setLocalBrowser,
  setLocalTracks,
  getLocalBiosamples,
  setLocalBiosamples,
  getLocalChromHmmTissues,
  setLocalChromHmmTissues,
} from "common/hooks/useLocalStorage";
import PageviewIcon from "@mui/icons-material/Pageview";

interface Transcript {
  id: string;
  name: string;
  coordinates: Domain;
  strand: string;
  exons?: Exon[];
  color?: string;
}

const SearchToScreenTypes: Record<Result["type"], AnyEntityType> = {
  Coordinate: "region",
  Gene: "gene",
  SNP: "variant",
  Study: "gwas",
  cCRE: "ccre",
  iCRE: "ccre",
};

const expansionPercentages: Record<AnyEntityType, number> = {
  ccre: 20,
  gene: 0.2,
  variant: 5.0,
  region: 0.25,
  gwas: 0.2,
};

function expandCoordinates(coordinates: GenomicRange, type: AnyEntityType) {
  let length = coordinates.end - coordinates.start;

  if (length <= 100) {
    length = 100;
  }

  const expansionPercentage = expansionPercentages[type];
  const padding = Math.floor(length * expansionPercentage);

  return {
    chromosome: coordinates.chromosome as Chromosome,
    start: Math.max(0, coordinates.start - padding),
    end: coordinates.end + padding,
  };
}

type GenomeBrowserViewProps = EntityViewComponentProps & { coordinates: GenomicRange };

export default function GenomeBrowserView({ entity, coordinates }: GenomeBrowserViewProps) {
  /**
   * @todo when refactoring this to include GWAS need to change this logic
   */
  const name = entity.entityType === "region" ? entity.entityID.replace("%3A", ":") : entity.entityID;

  const [selectedBiosamples, setSelectedBiosamples] = useState<RegistryBiosamplePlusRNA[] | null>(getLocalBiosamples());
  const [selectedChromHmmTissues, setSelectedChromHmmTissues] = useState<string[]>(getLocalChromHmmTissues());

  const initialState: InitialBrowserState = useMemo(() => {
    return {
      domain: getLocalBrowser(name)?.domain ?? expandCoordinates(coordinates, entity.entityType),
      marginWidth: 150,
      trackWidth: 1350,
      multiplier: 3,
      highlights: getLocalBrowser(name)?.highlights || [
        {
          id: name || coordinates.chromosome + ":" + coordinates.start + "-" + coordinates.end,
          domain: { chromosome: coordinates.chromosome, start: coordinates.start, end: coordinates.end },
          color: randomColor(),
        },
      ],
    };
  }, [name, coordinates, entity.entityType]);

  const browserStore = createBrowserStoreMemo(initialState, [initialState]);
  const addHighlight = browserStore((state) => state.addHighlight);
  const removeHighlight = browserStore((state) => state.removeHighlight);
  const setDomain = browserStore((state) => state.setDomain);

  const domain = browserStore((state) => state.domain);
  const highlights = browserStore((state) => state.highlights);

  useEffect(() => {
    setLocalBrowser(name, { domain, highlights });
  }, [domain, highlights, name]);

  useEffect(() => {
    setLocalBiosamples(selectedBiosamples);
  }, [selectedBiosamples]);

  useEffect(() => {
    setLocalChromHmmTissues(selectedChromHmmTissues);
  }, [selectedChromHmmTissues]);

  const router = useRouter();

  const onBiosampleSelected = (biosamples: RegistryBiosamplePlusRNA[] | null) => {
    if (biosamples && biosamples.length === 0) {
      setSelectedBiosamples(null);
    } else {
      setSelectedBiosamples(biosamples);
    }
  };

  const onCcreClick = useCallback(
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

  const initialTracks: Track[] = useMemo(() => {
    const localTracks = getLocalTracks();

    if (localTracks.length > 0) {
      // Set interaction callbacks for tracks
      localTracks.forEach((track) => {
        if (track.trackType === TrackType.Transcript) {
          track.geneName = name;
          track.onHover = (item: Transcript) => {
            addHighlight({
              id: item.name + "-temp" || "dsadsfd",
              domain: { start: item.coordinates.start, end: item.coordinates.end },
              color: item.color || "blue",
            });
          };
          track.onLeave = (item: Transcript) => {
            removeHighlight(item.name + "-temp" || "dsadsfd");
          };
          track.onClick = (item: Transcript) => {
            onGeneClick(item);
          };
        }
        if (track.trackType === TrackType.BigBed) {
          track.onHover = (item: Rect) => {
            addHighlight({
              id: item.name + "-temp" || "ihqoviun",
              domain: { start: item.start, end: item.end },
              color: item.color || "blue",
            });
          };
          track.onLeave = (item: Rect) => {
            removeHighlight(item.name + "-temp" || "ihqoviun");
          };
          track.onClick = (item: Rect) => {
            onCcreClick(item);
          };
          track.tooltip = (item: Rect) => <CCRETooltip assembly={entity.assembly} name={item.name || ""} {...item} />;
        }
      });
      return localTracks;
    }
    const tracks = entity.assembly === "GRCh38" ? humanDefaultTracks : mouseDefaultTracks;
    const defaultTracks: Track[] = [
      {
        id: "gene-track",
        title: "GENCODE genes",
        titleSize: 12,
        height: 50,
        color: "#AAAAAA",
        trackType: TrackType.Transcript,
        assembly: entity.assembly,
        version: entity.assembly === "GRCh38" ? 40 : 25,
        displayMode: DisplayMode.Squish,
        geneName: entity.entityType === "gene" ? name : "",
        onHover: (item: Transcript) => {
          addHighlight({
            id: item.name + "-temp" || "dsadsfd",
            domain: { start: item.coordinates.start, end: item.coordinates.end },
            color: item.color || "blue",
          });
        },
        onLeave: (item: Transcript) => {
          removeHighlight(item.name + "-temp" || "dsadsfd");
        },
        onClick: (item: Transcript) => {
          onGeneClick(item);
        },
      },
      {
        id: "ccre-track",
        title: "All cCREs colored by group",
        titleSize: 12,
        height: 20,
        color: "#D05F45",
        trackType: TrackType.BigBed,
        displayMode: DisplayMode.Dense,
        url: `https://downloads.wenglab.org/${entity.assembly}-cCREs.DCC.bigBed`,
        onHover: (rect) => {
          addHighlight({
            id: rect.name + "-temp" || "ihqoviun",
            domain: { start: rect.start, end: rect.end },
            color: rect.color || "blue",
          });
        },
        onLeave: (rect) => {
          removeHighlight(rect.name + "-temp" || "ihqoviun");
        },
        onClick: (item: Rect) => {
          onCcreClick(item);
        },
        tooltip: (rect: Rect) => <CCRETooltip assembly={entity.assembly} name={rect.name || ""} {...rect} />,
      },
    ];

    return [...defaultTracks, ...tracks];
  }, [entity.assembly, entity.entityType, name, addHighlight, removeHighlight, onGeneClick, onCcreClick]);

  const trackStore = createTrackStoreMemo(initialTracks, [initialTracks]);

  const currentTracks = trackStore((state) => state.tracks);

  const editTrack = trackStore((state) => state.editTrack);

  const onHover = (item: Rect) => {
    addHighlight({
      color: item.color || "blue",
      domain: { start: item.start, end: item.end },
      id: "tmp-ccre",
    });
  };

  const onLeave = () => {
    removeHighlight("tmp-ccre");
  };

  useBiosampleTracks(entity.assembly, selectedBiosamples, trackStore, onHover, onLeave, onCcreClick);
  useChromHmmTracks(selectedChromHmmTissues, coordinates, entity.assembly, trackStore, addHighlight, removeHighlight);

  useEffect(() => {
    setLocalTracks(currentTracks);
  }, [currentTracks]);

  const handeSearchSubmit = (r: Result) => {
    if (r.type === "Gene") {
      editTrack("gene-track", {
        geneName: r.title,
      });
    }
    addHighlight({
      domain: r.domain,
      color: randomColor(),
      id: r.title,
    });

    setDomain(expandCoordinates(r.domain, SearchToScreenTypes[r.type]));
  };

  const theme = useTheme();
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);

  const geneVersion = entity.assembly === "GRCh38" ? [29, 40] : 25;

  return (
    <Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
        <Box display="flex" gap={2} alignItems="center">
          <GenomeSearch
            size="small"
            assembly={entity.assembly}
            geneVersion={geneVersion}
            onSearchSubmit={handeSearchSubmit}
            queries={["Gene", "SNP", "cCRE", "Coordinate"]}
            geneLimit={3}
            sx={{ minWidth: "200px", width: "350px", flexShrink: 1 }}
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
          <Button
            variant="contained"
            startIcon={<PageviewIcon />}
            color="primary"
            size="small"
            onClick={() => setDomain(expandCoordinates(coordinates, entity.entityType))}
          >
            Recenter on {name || "Selected Region"}
          </Button>
        </Box>

        <GBButtons
          browserStore={browserStore}
          assembly={entity.assembly}
          onBiosampleSelected={onBiosampleSelected}
          selectedBiosamples={selectedBiosamples}
          selectedChromHmmTissues={selectedChromHmmTissues}
          setSelectedChromHmmTissues={setSelectedChromHmmTissues}
        />
      </Stack>
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
      <Browser browserStore={browserStore} trackStore={trackStore} />
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
    </Stack>
  );
}
