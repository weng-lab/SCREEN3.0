"use client";
import { Search } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import { Box, Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import {
  BigBedTrackProps,
  BrowserActionType,
  DefaultBigBed,
  DefaultBigWig,
  DefaultTranscript,
  DisplayMode,
  GenomeBrowser,
  GQLCytobands,
  TranscriptHumanVersion,
  TranscriptTrackProps,
  useBrowserState,
} from "@weng-lab/genomebrowser";
import { Domain, GenomeSearch, Result } from "@weng-lab/ui-components";
import { useCallback, useEffect, useState } from "react";
import { Assembly, EntityType, GenomicRange } from "types/globalTypes";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
import AddTracksModal, { BigWig } from "./addTracksModal";
import ControlButtons from "./controls";
import HighlightDialog, { GBHighlight } from "./highlightDialog";
import { randomColor, trackColor } from "./utils";
import BedTooltip from "./bedTooltip";
import { Exon } from "types/generated/graphql";
import { useRouter } from "next/navigation";

interface Transcript {
  id: string;
  name: string;
  coordinates: Domain;
  strand: string;
  exons?: Exon[];
  color?: string;
}

function expandCoordinates(coordinates: GenomicRange) {
  let length = coordinates.end - coordinates.start;
  if (length <= 100) {
    length = 100;
  }
  const padding = Math.floor(length * 0.25);
  return {
    chromosome: coordinates.chromosome,
    start: coordinates.start - padding,
    end: coordinates.end + padding,
  };
}

export default function GenomeBrowserView({
  coordinates,
  name,
  type,
  assembly
}: {
  coordinates: GenomicRange;
  name: string;
  type: EntityType;
  assembly: string;
}) {
  const [browserState, browserDispatch] = useBrowserState({
    domain: expandCoordinates(coordinates),
    width: 1500,
    tracks: [],
    highlights: [],
  });

  const router = useRouter();

  // Bed track mouse over, out, and click handlers
  const icreMouseOver = useCallback(
    (item: Rect) => {
      const newHighlight = {
        domain: { start: item.start + 150, end: item.end + 150 },
        color: item.color || "red",
        id: item.name,
      };
      browserDispatch({
        type: BrowserActionType.ADD_HIGHLIGHT,
        highlight: newHighlight,
      });
    },
    [browserDispatch]
  );
  const icreMouseOut = useCallback(() => {
    browserDispatch({ type: BrowserActionType.REMOVE_LAST_HIGHLIGHT });
  }, [browserDispatch]);
  const onIcreClick = useCallback((item: Rect) => {
    const accession = item.name;
    router.push(`${assembly}/ccre/${accession}`);
  }, []);
  const onGeneClick = useCallback((gene: Transcript) => {
    const name = gene.name;
    if (name.includes("ENSG")) {
      return;
    }
    router.push(`${assembly}/gene/${name}`);
  }, []);

  // Initialize tracks and highlights
  useEffect(() => {
    const tracks = defaultTracks(
      type === "gene" ? name : "",
      icreMouseOver,
      icreMouseOut,
      onIcreClick,
      BedTooltip,
      onGeneClick
    );
    tracks.forEach((track) => {
      browserDispatch({ type: BrowserActionType.ADD_TRACK, track });
    });
    browserDispatch({
      type: BrowserActionType.ADD_HIGHLIGHT,
      highlight: {
        domain: {
          chromosome: coordinates.chromosome,
          start: coordinates.start,
          end: coordinates.end,
        },
        color: "blue",
        id: name,
      },
    });
  }, [coordinates, name, type, icreMouseOver, icreMouseOut, onIcreClick, browserDispatch]);

  // Bulk ATAC Modal
  const [showAddTracksModal, setShowAddTracksModal] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<BigWig[]>([]);

  useEffect(() => {
    selectedTracks.forEach((track) => {
      // check if the track is not already in the browser state
      if (!browserState.tracks.some((t) => t.id === track.name + "_temp")) {
        const trackToAdd = {
          ...DefaultBigWig,
          id: track.name + "_temp",
          title: track.assay + " " + track.displayName,
          url: track.url,
          color: trackColor(track.lineage),
          height: 100,
          titleSize: 16,
          displayMode: DisplayMode.FULL,
        };
        browserDispatch({ type: BrowserActionType.ADD_TRACK, track: trackToAdd });
      }
    });

    // Remove tracks that are no longer selected
    browserState.tracks.forEach((track) => {
      if (track.id.includes("_temp") && !selectedTracks.some((t) => t.name + "_temp" === track.id)) {
        browserDispatch({ type: BrowserActionType.DELETE_TRACK, id: track.id });
      }
    });
  }, [browserState.tracks, selectedTracks, browserDispatch]);

  const handeSearchSubmit = (r: Result) => {
    browserDispatch({
      type: BrowserActionType.SET_LOADING,
    });
    if (r.type === "Gene") {
      browserDispatch({
        type: BrowserActionType.UPDATE_PROPS,
        id: "default-gene",
        props: {
          geneName: r.title,
        },
      });
    }
    // Only remove if there is more than one highlight
    if (browserState.highlights.length > 1) {
      browserDispatch({
        type: BrowserActionType.REMOVE_LAST_HIGHLIGHT,
      });
    }
    browserDispatch({
      type: BrowserActionType.ADD_HIGHLIGHT,
      highlight: {
        domain: r.domain,
        color: randomColor(),
        id: r.title,
      },
    });
    browserDispatch({
      type: BrowserActionType.SET_DOMAIN,
      domain: expandCoordinates(r.domain),
    });
  };

  const theme = useTheme();
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);

  return (
    <Grid container spacing={2} sx={{ mt: "0rem", mb: "1rem" }} justifyContent="center" alignItems="center">
      <Grid
        size={{ xs: 12, lg: 12 }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <GenomeSearch
            size="small"
            assembly={assembly as Assembly}
            onSearchSubmit={handeSearchSubmit}
            queries={["Gene", "SNP", "iCRE", "Coordinate"]}
            geneLimit={3}
            sx={{ width: "400px" }}
            slots={{
              button: (
                <IconButton sx={{ color: theme.palette.primary.main }}>
                  <Search />
                </IconButton>
              ),
            }}
            slotProps={{
              input: {
                label: "Change browser region",
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
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<HighlightIcon />}
              size="small"
              onClick={() => setHighlightDialogOpen(true)}
            >
              View Current Highlights
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
              onClick={() => setShowAddTracksModal(true)}
            >
              Add signal tracks
            </Button>
          </Box>
        </Box>
        <AddTracksModal
          open={showAddTracksModal}
          setOpen={setShowAddTracksModal}
          setSelectedTracks={setSelectedTracks}
          selectedTracks={selectedTracks}
        />
        <Box
          width={"100%"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          display={"flex"}
          alignItems={"center"}
        >
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
            {browserState.domain.chromosome}:{browserState.domain.start.toLocaleString()}-
            {browserState.domain.end.toLocaleString()}
          </h3>

          <svg id="cytobands" width={"700px"} height={20}>
            <GQLCytobands
              assembly="hg38"
              chromosome={browserState.domain.chromosome}
              currentDomain={browserState.domain}
            />
          </svg>
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>hg38</h3>
        </Box>
        <ControlButtons browserState={browserState} browserDispatch={browserDispatch} />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <GenomeBrowser width={"100%"} browserState={browserState} browserDispatch={browserDispatch} />
      </Grid>
      <Box
        sx={{
          width: "100%",
          height: 40,
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></Box>
      <HighlightDialog
        open={highlightDialogOpen}
        setOpen={setHighlightDialogOpen}
        highlights={browserState.highlights as GBHighlight[]}
      />
    </Grid>
  );
}

function defaultTracks(
  geneName: string,
  icreMouseOver: (item: Rect) => void,
  icreMouseOut: () => void,
  onIcreClick: (item: Rect) => void,
  tooltipContent: React.FC<Rect>,
  onGeneClick: (gene: Transcript) => void
) {
  const geneTrack = {
    ...DefaultTranscript,
    titleSize: 16,
    id: "default-gene",
    title: "GENCODE genes",
    height: 100,
    color: "#AAAAAA",
    version: TranscriptHumanVersion.V40,
    assembly: "GRCh38",
    queryType: "gene",
    displayMode: DisplayMode.SQUISH,
    geneName: geneName,
    onTranscriptClick: onGeneClick,
  } as TranscriptTrackProps;

  const icreTrack = {
    ...DefaultBigBed,
    titleSize: 16,
    id: "default-icre",
    title: "All Immune cCREs",
    displayMode: DisplayMode.DENSE,
    color: "#9378bc",
    rowHeight: 10,
    height: 50,
    onMouseOver: icreMouseOver,
    onMouseOut: icreMouseOut,
    onClick: onIcreClick,
    tooltipContent: tooltipContent,
    url: "http://downloads.wenglab.org/igscreen/iCREs.bigBed",
  } as BigBedTrackProps;

  const atacBigWig = {
    ...DefaultBigWig,
    title: "ATAC merged signal",
    url: "https://downloads.wenglab.org/igscreen/ATAC_merged_signal.bigWig",
    color: "#02c7b9",
    height: 100,
    titleSize: 16,
    displayMode: DisplayMode.FULL,
    id: "atac-bigwig",
  };

  const dnaseBigWig = {
    ...DefaultBigWig,
    title: "DNase merged signal",
    url: "https://downloads.wenglab.org/igscreen/DNase_merged_signal.bigWig",
    color: "#06DA93",
    height: 100,
    titleSize: 16,
    displayMode: DisplayMode.FULL,
    id: "dnase-bigwig",
  };
  return [geneTrack, icreTrack, atacBigWig, dnaseBigWig];
}
