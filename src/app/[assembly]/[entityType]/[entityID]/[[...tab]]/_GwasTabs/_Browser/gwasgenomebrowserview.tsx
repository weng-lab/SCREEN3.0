"use client";
import { Search } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import {
  Browser,
  Chromosome,
  createBrowserStore,
  createDataStore,
  createTrackStore,
  DisplayMode,
  Track,
  TrackType,
  useCustomData,
} from "@weng-lab/genomebrowser";
import { Domain, GenomeSearch, Result } from "@weng-lab/ui-components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GenomicRange } from "common/types/globalTypes";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
//import GenomeBrowserView from "common/gbview/genomebrowserview";
import ControlButtons from "common/components/gbview/ControlButtons";
import HighlightDialog from "common/components/gbview/HighlightDialog";
import { randomColor } from "common/components/gbview/utils";
import { Exon } from "common/types/generated/graphql";
import { useRouter } from "next/navigation";
import CCRETooltip from "common/components/gbview/CcreTooltip";
import DomainDisplay from "common/components/gbview/DomainDisplay";
import { useGWASSnpsData } from "common/hooks/useGWASSnpsData";
import SelectLdBlock from "./SelectLdBlock";
import { gql, useQuery } from "@apollo/client";

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

const browserStore = createBrowserStore({
  domain: { chromosome: "chr1", start: 52000, end: 53000 },
  marginWidth: 150,
  trackWidth: 1350,
  multiplier: 3,
});
const trackStore = createTrackStore([]);
const dataStore = createDataStore();

export default function GWASGenomeBrowserView({ study_name }: { study_name: string }) {
  //const [selectedBiosamples, setselectedBiosamples] = useState<RegistryBiosample[] | null>(null);

  const {
    data: dataGWASSnps,
    loading: loadingGWASSnps,
    error: errorGWASSnps,
  } = useGWASSnpsData({ study: [study_name] });
  useCustomData(
    "ld-track",
    {
      data: dataGWASSnps,
      loading: loadingGWASSnps,
      error: errorGWASSnps,
    },
    dataStore
  );

  const ldblockStats = useMemo(() => {
    if (!dataGWASSnps) return [];

    const map = new Map<number, { ldblock: number; chromosome: string; start: number; end: number }>();

    for (const { ldblock, chromosome, start, stop } of dataGWASSnps) {
      if (!map.has(ldblock)) {
        map.set(ldblock, { ldblock, chromosome, start, end: stop });
      } else {
        const entry = map.get(ldblock)!;
        entry.start = Math.min(entry.start, start);
        entry.end = Math.max(entry.end, stop);
      }
    }

    return Array.from(map.values());
  }, [dataGWASSnps]);

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
  }, [ldblockStats, selectedLdBlock]);

  const coordinates = selectedLdBlock
    ? { chromosome: selectedLdBlock.chromosome, start: selectedLdBlock.start, end: selectedLdBlock.end }
    : { chromosome: "chr1", start: 52000, end: 53000 };

  const addHighlight = browserStore((state) => state.addHighlight);
  const removeHighlight = browserStore((state) => state.removeHighlight);
  const setDomain = browserStore((state) => state.setDomain);

  const router = useRouter();

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

  const onCcreClick = useCallback(
    (item: Rect) => {
      const accession = item.name;
      router.push(`/GRCh38/ccre/${accession}`);
    },
    [router]
  );

  const onGeneClick = useCallback(
    (gene: Transcript) => {
      const name = gene.name;
      if (name.includes("ENSG")) {
        return;
      }
      router.push(`/GRCh38/gene/${name}`);
    },
    [router]
  );

  const initialTracks: Track[] = useMemo(() => {
    const defaultTracks: Track[] = [
      {
        id: "ld-track",
        title: "LD",
        trackType: TrackType.LDTrack,
        displayMode: DisplayMode.LDBlock,
        height: 50,
        titleSize: 12,
        color: "#ff0000",
      },
      {
        id: "ccre-track",
        title: "All cCREs colored by group",
        titleSize: 12,
        height: 20,
        color: "#D05F45",

        trackType: TrackType.BigBed,
        displayMode: DisplayMode.Dense,
        url: `https://downloads.wenglab.org/GRCh38-cCREs.DCC.bigBed`,
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
        tooltip: (rect: Rect) => <CCRETooltip assembly={"GRCh38"} name={rect.name || ""} {...rect} />,
      },
      {
        id: "gene-track",
        title: "GENCODE genes",
        titleSize: 12,
        height: 50,
        color: "#AAAAAA",
        trackType: TrackType.Transcript,
        assembly: "GRCh38",
        version: 40,
        displayMode: DisplayMode.Squish,
        //geneName:  "",
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
    ];

    return [...defaultTracks];
  }, [addHighlight, removeHighlight, onGeneClick, onCcreClick]);

  const setTracks = trackStore((state) => state.setTracks);

  // Initialize tracks once on mount
  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks, setTracks]);

  // Update domain when selectedLdBlock changes
  useEffect(() => {
    if (selectedLdBlock) {
      const newCoordinates = {
        chromosome: selectedLdBlock.chromosome,
        start: selectedLdBlock.start,
        end: selectedLdBlock.end,
      };
      setDomain(expandCoordinates(newCoordinates));
    }
  }, [selectedLdBlock, setDomain]);

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
            assembly={"GRCh38"}
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
          {
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                size="small"
                onClick={() => handleSelectLDblockClick()}
              >
                Select Ld Block
              </Button>
              <SelectLdBlock
                open={ldblockOpen}
                setOpen={handleSelectLDblockClick}
                onLdBlockSelect={handleLdBlockSelected}
                ldblockList={ldblockStats}
                ldblock={selectedLdBlock ?? null}
              />
            </Box>
          }
        </Box>
        <DomainDisplay browserStore={browserStore} assembly={"GRCh38"} />
        <ControlButtons browserStore={browserStore} />
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Browser
          key={selectedLdBlock?.ldblock ?? "default"}
          browserStore={browserStore}
          trackStore={trackStore}
          externalDataStore={dataStore}
        />
      </Grid>
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
    </Grid>
  );
}

export const GWAS_SNP_QUERY = gql`
  query getSNPsforgivengwasStudy($study: [String!]!) {
    getSNPsforGWASStudies(study: $study) {
      snpid
      ldblock
      rsquare
      chromosome
      stop
      start
      ldblocksnpid
      __typename
    }
  }
`;

function useLDData(study_name: string) {
  const { data, loading, error } = useQuery(GWAS_SNP_QUERY, {
    variables: {
      study: [study_name],
    },
  });

  return { data: data?.getSNPsforGWASStudies, loading, error };
}
