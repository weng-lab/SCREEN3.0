"use client";

// @mui
import { Search } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// @weng-lab
import { Browser, createBrowserStoreMemo, createTrackStoreMemo } from "@weng-lab/genomebrowser";
import { GenomeSearch, Result } from "@weng-lab/ui-components";

// internal
import { GenomicRange } from "common/types/globalTypes";
import HighlightDialog from "./Dialogs/HighlightDialog";
import { expandCoordinates, randomColor, SearchToScreenTypes } from "./utils";

// icons
import PageviewIcon from "@mui/icons-material/Pageview";
import DomainDisplay from "./Controls/DomainDisplay";
import ControlButtons from "./Controls/ControlButtons";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import TrackSelect from "./TrackSelect/TrackSelect";

type GenomeBrowserViewProps = EntityViewComponentProps & { entityCoordinates: GenomicRange };

export default function GenomeBrowserView({ entity, entityCoordinates }: GenomeBrowserViewProps) {
  /**
   * @todo when refactoring this to include GWAS need to change this logic
   */
  const name = entity.entityType === "region" ? entity.entityID.replace("%3A", ":") : entity.entityID;

  const browserStore = createBrowserStoreMemo({
    domain: expandCoordinates(entityCoordinates, entity.entityType),
    marginWidth: 100,
    multiplier: 3,
    trackWidth: 1400,
  });
  const trackStore = createTrackStoreMemo([]);

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
        <HighlightDialog browserStore={browserStore} />
        <TrackSelect trackStore={trackStore} />
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
