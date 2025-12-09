"use client";

// @mui
import { Search } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// @weng-lab
import { BigWigConfig, Browser, createTrackStoreMemo, DisplayMode, TrackType } from "@weng-lab/genomebrowser";
import { GenomeSearch, Result } from "@weng-lab/ui-components";

// internal
import { ASSAY_COLORS } from "common/colors";
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { GenomicRange } from "common/types/globalTypes";
import useLocalBrowser from "./Context/useBrowserStore";
import HighlightDialog from "./Dialogs/HighlightDialog";
import { expandCoordinates, randomColor, SearchToScreenTypes } from "./utils";

// icons
import PageviewIcon from "@mui/icons-material/Pageview";
import ControlButtons from "./Controls/ControlButtons";
import DomainDisplay from "./Controls/DomainDisplay";
import TrackSelect from "./TrackSelect/TrackSelect";

type GenomeBrowserViewProps = EntityViewComponentProps & {
  entityCoordinates: GenomicRange;
};

export default function GenomeBrowserView({ entity, entityCoordinates }: GenomeBrowserViewProps) {
  /**
   * @todo when refactoring this to include GWAS need to change this logic
   */
  const name = entity.entityType === "region" ? entity.entityID.replace("%3A", ":") : entity.entityID;

  const browserStore = useLocalBrowser(entity.entityID, entityCoordinates, entity.entityType);

  // Initialize track store with interaction functions (on click, on hover, etc)
  const trackStore = createTrackStoreMemo(
    [
      {
        id: "gene-track",
        title: "GENCODE Genes",
        trackType: TrackType.Transcript,
        displayMode: DisplayMode.Squish,
        color: "#2E8B57",
        titleSize: 12,
        height: 100,
        assembly: "GRCh38",
        version: 40,
      },
      {
        id: "default-dnase",
        title: "Agregated DNase-seq signal, all Registry biosamples",
        shortLabel: "DNase",
        titleSize: 12,
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        color: ASSAY_COLORS.dnase,
        height: 50,
        url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
      } as BigWigConfig,
    ],
    []
  );

  const addHighlight = browserStore((state) => state.addHighlight);
  const setDomain = browserStore((state) => state.setDomain);
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

    setDomain(expandCoordinates(r.domain, SearchToScreenTypes[r.type]));
  };

  const theme = useTheme();

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
            onClick={() => setDomain(expandCoordinates(entityCoordinates, entity.entityType))}
          >
            Recenter on {name || "Selected Region"}
          </Button>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <HighlightDialog browserStore={browserStore} />
          <TrackSelect trackStore={trackStore} />
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
      <Browser browserStore={browserStore} trackStore={trackStore} />
    </Stack>
  );
}
