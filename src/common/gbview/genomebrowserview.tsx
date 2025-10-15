"use client";
import { Search } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import {
  BigBedConfig,
  BigWigConfig,
  Browser,
  BulkBedConfig,
  Chromosome,
  createBrowserStoreMemo,
  createTrackStoreMemo,
  DisplayMode,
  InitialBrowserState,
  Track,
  TrackStoreInstance,
  TrackType,
} from "@weng-lab/genomebrowser";
import { Domain, GenomeSearch, Result } from "@weng-lab/ui-components";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Assembly, GenomicRange } from "types/globalTypes";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
import ControlButtons from "./controls";
import HighlightDialog from "./highlightDialog";
import { randomColor } from "./utils";
import { Exon } from "types/generated/graphql";
import { useRouter } from "next/navigation";
import { AnyEntityType } from "common/EntityDetails/entityTabsConfig";
import CCRETooltip from "./ccretooltip";
import DomainDisplay from "./domainDisplay";
import GBButtons from "./gbViewButtons";
import { RegistryBiosamplePlusRNA } from "common/components/BiosampleTables/types";
import { useChromHMMData } from "common/hooks/useChromHmmData";
import { tissueColors } from "common/lib/colors";
import { chromHmmStateDetails, humanDefaultTracks, mouseDefaultTracks } from "./constants";
import { useBiosampleTracks } from "./Biosample/useBiosampleTracks";
import { ChromHmmTooltip } from "./ChromHMM/ChromHmmTooltip";
import { capitalizeFirstLetter } from "common/utility";
import { getLocalBrowser, getLocalTracks, setLocalBrowser, setLocalTracks } from "common/hooks/useLocalStorage";

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

export default function GenomeBrowserView({
  coordinates,
  name,
  type,
  assembly,
}: {
  coordinates: GenomicRange;
  name: string;
  type: AnyEntityType;
  assembly: Assembly;
}) {
  const [selectedBiosamples, setSelectedBiosamples] = useState<RegistryBiosamplePlusRNA[] | null>(null);
  const [selectedChromHmmTissues, setSelectedChromHmmTissues] = useState<string[]>([]);

  const initialState: InitialBrowserState = useMemo(() => {
    return {
      domain: getLocalBrowser(name)?.domain || expandCoordinates(coordinates, type),
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
  }, [getLocalBrowser, coordinates, type, name]);

  const browserStore = createBrowserStoreMemo(initialState, [initialState]);
  const addHighlight = browserStore((state) => state.addHighlight);
  const removeHighlight = browserStore((state) => state.removeHighlight);
  const setDomain = browserStore((state) => state.setDomain);

  const domain = browserStore((state) => state.domain);
  const highlights = browserStore((state) => state.highlights);

  useEffect(() => {
    setLocalBrowser(name, { domain, highlights });
  }, [domain, highlights]);

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
      router.push(`/${assembly}/ccre/${accession}`);
    },
    [assembly, router]
  );

  const onGeneClick = useCallback(
    (gene: Transcript) => {
      const name = gene.name;
      if (name.includes("ENSG")) {
        return;
      }
      router.push(`/${assembly}/gene/${name}`);
    },
    [assembly, router]
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
          track.tooltip = (item: Rect) => <CCRETooltip assembly={assembly} name={item.name || ""} {...item} />;
        }
      });
      return localTracks;
    }
    const tracks = assembly === "GRCh38" ? humanDefaultTracks : mouseDefaultTracks;
    const defaultTracks: Track[] = [
      {
        id: "gene-track",
        title: "GENCODE genes",
        titleSize: 12,
        height: 50,
        color: "#AAAAAA",
        trackType: TrackType.Transcript,
        assembly: assembly,
        version: assembly === "GRCh38" ? 40 : 25,
        displayMode: DisplayMode.Squish,
        geneName: type === "gene" ? name : "",
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
        url: `https://downloads.wenglab.org/${assembly}-cCREs.DCC.bigBed`,
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
        tooltip: (rect: Rect) => <CCRETooltip assembly={assembly} name={rect.name || ""} {...rect} />,
      },
    ];

    return [...defaultTracks, ...tracks];
  }, [assembly, type, name, addHighlight, removeHighlight, onGeneClick, onCcreClick]);

  const trackStore = createTrackStoreMemo(initialTracks, [initialTracks]);

  const currentTracks = trackStore((state) => state.tracks);
  const insertTrack = trackStore((state) => state.insertTrack);
  const removeTrack = trackStore((state) => state.removeTrack);

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

  useBiosampleTracks(assembly, selectedBiosamples, trackStore, onHover, onLeave, onCcreClick);
  const { tracks: chromHmmTracks, processedTableData, loading, error } = useChromHMMData(coordinates, assembly);

  useEffect(() => {
    if (!chromHmmTracks) return;
    selectedChromHmmTissues.forEach((tissue) => {
      // for each selected tissue, add bulk bed of chrom hmm tracks if not already added
      if (!currentTracks.some((t) => t.id === tissue)) {
        const allTissueTracks = chromHmmTracks[tissue];
        const chromHmmTissueBulkBed: BulkBedConfig = {
          id: `ChromHmm_${tissue}_bulkbed`,
          titleSize: 12,
          color: tissueColors[tissue] ?? tissueColors.missing,
          trackType: TrackType.BulkBed,
          displayMode: DisplayMode.Full,
          datasets: allTissueTracks.map((sample, index) => {
            return {
              name: sample.displayName,
              url: sample.url,
            };
          }),
          title: `${capitalizeFirstLetter(tissue)} ChromHMM States`,
          height: 15 * allTissueTracks.length,
          tooltip: (rect) => ChromHmmTooltip(rect, tissue, rect.datasetName),
          onHover: (rect) => {
            addHighlight({
              color: rect.color,
              domain: { start: rect.start, end: rect.end },
              id: "tmp-bulkbed",
            });
          },
          onLeave: () => {
            removeHighlight("tmp-bulkbed");
          },
        };
        insertTrack(chromHmmTissueBulkBed);
      }
      currentTracks.forEach((track) => {
        if (
          track.id.includes("ChromHmm") &&
          !selectedChromHmmTissues.some((tissue) => tissue === track.id.split("_")[1])
        ) {
          removeTrack(track.id);
        }
      });
    });
  }, [addHighlight, chromHmmTracks, currentTracks, insertTrack, removeHighlight, removeTrack, selectedChromHmmTissues]);

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

  const geneVersion = assembly === "GRCh38" ? [29, 40] : 25;

  return (
    <Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
        <GenomeSearch
          size="small"
          assembly={assembly as Assembly}
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
        <GBButtons
          browserStore={browserStore}
          assembly={assembly}
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
        <DomainDisplay browserStore={browserStore} assembly={assembly} />
        <ControlButtons browserStore={browserStore} />
      </Stack>
      <Browser browserStore={browserStore} trackStore={trackStore} />
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
    </Stack>
  );
}
