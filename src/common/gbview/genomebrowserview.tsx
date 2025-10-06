"use client";
import {  Search } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import {
  BigBedConfig,
  BigWigConfig,
  Browser,
  BulkBedConfig,
  Chromosome,
  createBrowserStore,
  createTrackStore,
  DisplayMode,
  InitialBrowserState,
  Track,
  TrackStoreInstance,
  TrackType,
} from "@weng-lab/genomebrowser";
import { Domain, GenomeSearch, Result } from "@weng-lab/ui-components";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { RegistryBiosample } from "common/components/BiosampleTables/types";
import { useChromHMMData } from "common/hooks/useChromHmmData";
import { tissueColors } from "common/lib/colors";
import { RegistryBiosamplePlusRNA } from "common/_utility/types";
import { gql, useQuery } from "@apollo/client";

const FETCH_RNASEQ_TRACKS = gql`
  query fetchRNASeqData($assembly: String!, $biosample: [String]) {
    rnaSeqQuery(assembly: $assembly, biosample: $biosample) {
      expid
      biosample
      posfileid
      negfileid
      unstrandedfileid
    }
  }
`;


interface Transcript {
  id: string;
  name: string;
  coordinates: Domain;
  strand: string;
  exons?: Exon[];
  color?: string;
}

const colors = {
  ccre: "#D05F45",
  dnase: "#06da93",
  h3k4me3: "#ff0000",
  h3k27ac: "#ffcd00",
  ctcf: "#00b0d0",
  atac: "#02c7b9",
};

const SearchToScreenTypes: Record<Result["type"], AnyEntityType> = {
  "Coordinate": "region",
  "Gene": "gene",
  "SNP": "variant",
  "Study": "gwas",
  "cCRE": "ccre",
  "iCRE": "ccre"
}

const expansionPercentages: Record<AnyEntityType, number> = {
  ccre: 20,
  gene: 0.2,
  variant: 5.0,
  region: 0.25,
  gwas: 0.2 
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
  const [selectedBiosamples, setselectedBiosamples] = useState<RegistryBiosamplePlusRNA[] | null>(null);

  console.log("selectedBiosample", selectedBiosamples)
  // const { tracks: chromHmmTracks, processedTableData, loading, error } = useChromHMMData(coordinates);

  const initialState: InitialBrowserState = {
    domain: expandCoordinates(coordinates, type),
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
  
  const onBiosampleSelected = (biosamples: RegistryBiosamplePlusRNA[] | null) => {
    if (biosamples && biosamples.length === 0) {
      setselectedBiosamples(null);
    } else {
      setselectedBiosamples(biosamples);
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

    let biosampleTracks: Track[] = [];
    if (selectedBiosamples && 0>1 ) {
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

      const onClick = (item: Rect) => {
        onCcreClick(item);
      };

      biosampleTracks = generateBiosampleTracks(
        selectedBiosamples,
        onHover,
        onLeave,
        onClick,
        colors
      );
    }

    //console.log("rnaTracks in useMemo", rnaTracks)
    return [...defaultTracks, ...biosampleTracks,  ...tracks];
  }, [assembly, type, name, selectedBiosamples, addHighlight, removeHighlight, onGeneClick, onCcreClick]);

  const trackStore = useMemo(()=>{ return createTrackStore(initialTracks)},[initialTracks]) 
  
  const currentTracks = trackStore((state) => state.tracks);
  const editTrack = trackStore((state) => state.editTrack);
  const insertTrack = trackStore((state) => state.insertTrack);
  const removeTrack = trackStore((state) => state.removeTrack);

  const rnaseqTracks = useRNAseqTracks(
    assembly.toLowerCase(),
    selectedBiosamples,
    //insertTrack,
    //currentTracks
  //  removeTrack,
   // currentTracks
  );

  useEffect(() => {
    rnaseqTracks.forEach((track) => {
      // check if the track is not already in the browser state
      if (!currentTracks.some((t) => t.id === track.id)) {
       
        insertTrack(track);
      }
    });

    // Remove tracks that are no longer selected
    currentTracks.forEach((track) => {
      if (!rnaseqTracks.some((t) => t.id === track.id)) {
        removeTrack(track.id);
      }
    });
  }, [currentTracks, rnaseqTracks, insertTrack, removeTrack]);


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
            queries={["Gene", "SNP", "cCRE", "Coordinate"]}
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
          <GBButtons browserStore={browserStore} assembly={assembly} onBiosampleSelected={onBiosampleSelected} selectedBiosamples={selectedBiosamples}/>
        </Box>
        <DomainDisplay browserStore={browserStore} assembly={assembly} />
        <ControlButtons browserStore={browserStore} />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Browser browserStore={browserStore} trackStore={trackStore} />
      </Grid>
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
    </Grid>
  );
}

function Tooltip(rect: Rect, tissue: string) {
  return (
    <g>
      <rect
        width={240}
        height={70}
        fill="white"
        stroke="none"
        filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.2))"
      />
      <rect
        width={15}
        height={15}
        fill={stateDetails[rect.name].color}
        x={10}
        y={10}
      />
      <text x={35} y={22} fontSize={12} fontWeight="bold">
        {stateDetails[rect.name].description}({stateDetails[rect.name].stateno})
      </text>
      <text x={10} y={40} fontSize={12}>
        {rect.name}
      </text>
      <text x={10} y={58} fontSize={12}>
        {tissue}
      </text>
    </g>
  );
}

export const stateDetails = {
  ["TssFlnk"]: { description: "Flanking TSS", stateno: "E1", color: "#FF4500" },
  ["TssFlnkD"]: {
    description: "Flanking TSS downstream",
    stateno: "E2",
    color: "#FF4500",
  },
  ["TssFlnkU"]: {
    description: "Flanking TSS upstream",
    stateno: "E3",
    color: "#FF4500",
  },
  ["Tss"]: { description: "Active TSS", stateno: "E4", color: "#FF0000" },
  ["Enh1"]: { description: "Enhancer", stateno: "E5", color: "#FFDF00" },
  ["Enh2"]: { description: "Enhancer", stateno: "E6", color: "#FFDF00" },
  ["EnhG1"]: {
    description: "Enhancer in gene",
    stateno: "E7",
    color: "#AADF07",
  },
  ["EnhG2"]: {
    description: "Enhancer in gene",
    stateno: "E8",
    color: "#AADF07",
  },
  ["TxWk"]: {
    description: "Weak transcription",
    stateno: "E9",
    color: "#3F9A50",
  },
  ["Biv"]: { description: "Bivalent", stateno: "E10", color: "#CD5C5C" },
  ["ReprPC"]: {
    description: "Repressed by Polycomb",
    stateno: "E11",
    color: "#8937DF",
  },
  ["Quies"]: { description: "Quiescent", stateno: "E12", color: "#DCDCDC" },
  ["Het"]: { description: "Heterochromatin", stateno: "E13", color: "#4B0082" },
  ["ZNF/Rpts"]: {
    description: "ZNF genes repreats",
    stateno: "E14",
    color: "#68cdaa",
  },
  ["Tx"]: { description: "Transcription", stateno: "E15", color: "#008000" },
};

function useRNAseqTracks(
  assembly: string,
  selectedBiosamples: RegistryBiosamplePlusRNA[] | null,
  //trackStore: TrackStoreInstance
  //insertTrack: (track: Track, index?: number) => void,
  //removeTrack: (id: string) => void,
  //currentTracks: Track[] 

) {
  //  const insertTrack = trackStore((state) => state.insertTrack);
   // const currentTracks = trackStore((state) => state.tracks);
    //const editTrack = trackStore((state) => state.editTrack);    
    //const removeTrack = trackStore((state) => state.removeTrack);
  // condition: only run if selectedBiosamples exist AND at least one has rnaseq=true
  const biosampleNames =
    selectedBiosamples && selectedBiosamples.some(b => b.rnaseq)
      ? selectedBiosamples.map(b => b.name) // adjust if biosample key is different
      : null;

  const { data, loading, error } = useQuery(FETCH_RNASEQ_TRACKS, {
    variables: { assembly, biosample: biosampleNames },
    skip: !biosampleNames,
  });

  const rnaTracks: Track[] = useMemo(() => {
    if (!biosampleNames || loading || error || !data?.rnaSeqQuery) return [];

    const tracks: Track[] = [];

    data.rnaSeqQuery.forEach((entry: any) => {
      const { expid, biosample, posfileid, negfileid, unstrandedfileid } = entry;

      // helper to build a track
      const makeTrack = (expid: string, fileId: string, strand: string, color: string) => { return {
        id: `${expid}-${fileId}-${strand}`,
        title: `RNA-seq ${strand} strand signal of unique reads rep 1 ${expid} ${fileId}`,
        height: 100,
        titleSize: 12,
        trackType: TrackType.BigWig,
        color,
        url: `https://www.encodeproject.org/files/${fileId}/@@download/${fileId}.bigWig?proxy=true`,
        displayMode: DisplayMode.Full,
       
        
      } as BigWigConfig};

      if (posfileid) tracks.push(makeTrack(expid,posfileid, "plus", "#00AA00"));
      if (negfileid) tracks.push(makeTrack(expid,negfileid, "minus", "#00AA00"));
      if (unstrandedfileid) tracks.push(makeTrack(expid, unstrandedfileid, "unstranded", "#00AA00"));
    });

    return tracks;
  }, [biosampleNames, data, loading, error]);

  return rnaTracks;
  /*rnaTracks.forEach(r=>{
    if (!currentTracks.some((t) => t.id === r.id)) {
      insertTrack(r)
    }
  });*/
  
    // Remove tracks that are no longer selected
    /*currentTracks.forEach((track) => {
      if (!rnaTracks.some((t) => t.id === track.id)) {
        removeTrack(track.id);
      }
    });*/
}
function generateBiosampleTracks(
  biosamples: RegistryBiosample[],
  onHover: (item: Rect) => void,
  onLeave: (item: Rect) => void,
  onClick: (item: Rect) => void,
  colors: {
    ccre: string;
    dnase: string;
    h3k4me3: string;
    h3k27ac: string;
    ctcf: string;
  }
): Track[] {
  const tracks: Track[] = [];

  for (const biosample of biosamples) {
    // Get available signal accessions (remove null values)
    const signals = [
      biosample.dnase_signal,
      biosample.h3k4me3_signal,
      biosample.h3k27ac_signal,
      biosample.ctcf_signal,
    ].filter((signal): signal is string => !!signal);

    if (signals.length > 0) {
      const bigBedUrl = `https://downloads.wenglab.org/Registry-V4/${signals.join(
        "_"
      )}.bigBed`;

      const ccreTrack: BigBedConfig = {
        id: `biosample-ccre-${biosample.name}`,
        title: `cCREs in ${biosample.displayname}`,
        titleSize: 12,
        trackType: TrackType.BigBed,
        displayMode: DisplayMode.Dense,
        color: colors.ccre,
        height: 20,
        url: bigBedUrl,
        onHover,
        onLeave,
        onClick,
      };
      tracks.push(ccreTrack);
    }

    if (biosample.dnase_signal) {
      tracks.push({
        id: `biosample-dnase-${biosample.name}`,
        title: `DNase-seq signal in ${biosample.displayname}`,
        titleSize: 12,
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        color: colors.dnase,
        height: 100,
        url: `https://www.encodeproject.org/files/${biosample.dnase_signal}/@@download/${biosample.dnase_signal}.bigWig`,
      } as BigWigConfig);
    }

    if (biosample.h3k4me3_signal) {
      tracks.push({
        id: `biosample-h3k4me3-${biosample.name}`,
        title: `H3K4me3 ChIP-seq signal in ${biosample.displayname}`,
        titleSize: 12,
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        color: colors.h3k4me3,
        height: 100,
        url: `https://www.encodeproject.org/files/${biosample.h3k4me3_signal}/@@download/${biosample.h3k4me3_signal}.bigWig`,
      } as BigWigConfig);
    }

    if (biosample.h3k27ac_signal) {
      tracks.push({
        id: `biosample-h3k27ac-${biosample.name}`,
        title: `H3K27ac ChIP-seq signal in ${biosample.displayname}`,
        titleSize: 12,
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        color: colors.h3k27ac,
        height: 100,
        url: `https://www.encodeproject.org/files/${biosample.h3k27ac_signal}/@@download/${biosample.h3k27ac_signal}.bigWig`,
      } as BigWigConfig);
    }

    if (biosample.ctcf_signal) {
      tracks.push({
        id: `biosample-ctcf-${biosample.name}`,
        title: `CTCF ChIP-seq signal in ${biosample.displayname}`,
        titleSize: 12,
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        color: colors.ctcf,
        height: 100,
        url: `https://www.encodeproject.org/files/${biosample.ctcf_signal}/@@download/${biosample.ctcf_signal}.bigWig`,
      } as BigWigConfig);
    }
  }

  return tracks;
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