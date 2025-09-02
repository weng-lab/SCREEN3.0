"use client";
import { Search } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import { Box, Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import {
  BigWigConfig,
  Browser,
  BrowserStoreInstance,
  Chromosome,
  createBrowserStore,
  createTrackStore,
  DisplayMode,
  InitialBrowserState,
  Track,
  TrackType,
} from "@weng-lab/genomebrowser";
import { Domain, GenomeSearch, Result } from "@weng-lab/ui-components";
import { useCallback, useMemo, useState } from "react";
import { Assembly, EntityType, GenomicRange } from "types/globalTypes";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
import ControlButtons from "./controls";
import HighlightDialog from "./highlightDialog";
import { randomColor } from "./utils";
import { Exon } from "types/generated/graphql";
import { useRouter } from "next/navigation";
import CCRETooltip from "./ccretooltip";

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
    chromosome: coordinates.chromosome as Chromosome,
    start: coordinates.start - padding,
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
  type: EntityType;
  assembly: string;
}) {
  const initialState: InitialBrowserState = {
    domain: expandCoordinates(coordinates),
    marginWidth: 150,
    trackWidth: 1350,
    multiplier: 3,
    highlights: [
      {
        id: name || coordinates.chromosome + ":" + coordinates.start + "-" + coordinates.end,
        domain: { chromosome: coordinates.chromosome, start: coordinates.start, end: coordinates.end },
        color: randomColor(),
      },
    ],
  };
  const browserStore = createBrowserStore(initialState);
  const addHighlight = browserStore((state) => state.addHighlight);
  const removeHighlight = browserStore((state) => state.removeHighlight);
  const setDomain = browserStore((state) => state.setDomain);

  const router = useRouter();

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
    const tracks = assembly === "GRCh38" ? humanTracks : mouseTracks;
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

  const trackStore = createTrackStore(initialTracks);
  const editTrack = trackStore((state) => state.editTrack);

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
    setDomain(expandCoordinates(r.domain));
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
              // onClick={() => }
            >
              Select Biosample
            </Button>
          </Box>
        </Box>
        <Box
          width={"100%"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          display={"flex"}
          alignItems={"center"}
        >
          <DomainDisplay browserStore={browserStore} />
          <svg id="cytobands" width={"700px"} height={20}>
            {/* <GQLCytobands
              assembly="hg38"
              chromosome={browserState.domain.chromosome}
              currentDomain={browserState.domain}
            /> */}
          </svg>
          <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>hg38</h3>
        </Box>
        <ControlButtons browserStore={browserStore} />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Browser browserStore={browserStore} trackStore={trackStore} />
      </Grid>
      <Box
        sx={{
          width: "100%",
          height: 40,
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></Box>
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
    </Grid>
  );
}

function DomainDisplay({ browserStore }: { browserStore: BrowserStoreInstance }) {
  const currentDomain = browserStore((state) => state.domain);
  return (
    <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
      {currentDomain.chromosome}:{currentDomain.start.toLocaleString()}-{currentDomain.end.toLocaleString()}
    </h3>
  );
}

const humanTracks: Track[] = [
  {
    id: "default-dnase",
    title: "Agregated DNase-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#06da93",
    height: 100,
    url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-h3k4me3",
    title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#ff0000",
    height: 100,
    url: "https://downloads.wenglab.org/H3K4me3_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-h3k27ac",
    title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#ffcd00",
    height: 100,
    url: "https://downloads.wenglab.org/H3K27ac_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-ctcf",
    title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#00b0d0",
    height: 100,
    url: "https://downloads.wenglab.org/CTCF_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-atac",
    title: "Aggregated ATAC ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#02c7b9",
    height: 100,
    url: "https://downloads.wenglab.org/ATAC_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
];

const mouseTracks: Track[] = [
  {
    id: "default-dnase",
    title: "Aggregated DNase-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#06da93",
    height: 100,
    url: "https://downloads.wenglab.org/DNase_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-h3k4me3",
    title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#ff0000",
    height: 100,
    url: "https://downloads.wenglab.org/H3K4me3_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-h3k27ac",
    title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#ffcd00",
    height: 100,
    url: "https://downloads.wenglab.org/H3K27ac_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-ctcf",
    title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#00b0d0",
    height: 100,
    url: "https://downloads.wenglab.org/CTCF_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-atac",
    title: "Aggregated ATAC ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: "#02c7b9",
    height: 100,
    url: "https://downloads.wenglab.org/ATAC_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
];
