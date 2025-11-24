"use client";
import { Search } from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Browser, Chromosome, Rect } from "@weng-lab/genomebrowser";
import { GenomeSearch, Result } from "@weng-lab/ui-components";
import { AnyEntityType, EntityViewComponentProps } from "common/entityTabsConfig";
import { GenomicRange } from "common/types/globalTypes";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import HighlightDialog from "./Highlights/HighlightDialog";
import { randomColor } from "./utils";
// icons
import PageviewIcon from "@mui/icons-material/Pageview";
import DomainDisplay from "./Controls/DomainDisplay";
import ControlButtons from "./Controls/ControlButtons";

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
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);

  const browserStore = useLocalBrowser();
  const trackStore = useLocalTracks();

  /**
   * @todo when refactoring this to include GWAS need to change this logic
   */
  const name = entity.entityType === "region" ? entity.entityID.replace("%3A", ":") : entity.entityID;

  const router = useRouter();

  /**
   * Store function
   */
  const addHighlight = browserStore((state) => state.addHighlight);
  const removeHighlight = browserStore((state) => state.removeHighlight);
  const setDomain = browserStore((state) => state.setDomain);
  const editTrack = trackStore((state) => state.editTrack);

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

  const onHover = useCallback(
    (item: Rect) => {
      addHighlight({
        color: item.color || "blue",
        domain: { start: item.start, end: item.end },
        id: "tmp-highlight",
      });
    },
    [addHighlight]
  );

  const onLeave = useCallback(() => {
    removeHighlight("tmp-highlight");
  }, [removeHighlight]);

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
            onClick={() => setDomain(expandCoordinates(coordinates, entity.entityType))}
          >
            Recenter on {name || "Selected Region"}
          </Button>
        </Box>
        {/* Add new track select button and modal here */}
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
