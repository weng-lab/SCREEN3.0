/// <reference types="vite/client" />

// react
import { useState } from "react";
import { createRoot } from "react-dom/client";

import "../src/muiLicense";

// mui
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";

// weng lab
import {
  Browser,
  createBrowserStoreMemo,
  createTrackStoreMemo,
  GQLWrapper,
} from "@weng-lab/genomebrowser";

// local
import {
  foldersByAssembly,
  type InitialSelectedIdsByAssembly,
  TrackSelect,
  type TrackSelectTrackContext,
} from "../src/lib";

type Assembly = "GRCh38" | "mm10";

function Main() {
  const [open, setOpen] = useState(false);
  const currentAssembly: Assembly = "GRCh38";

  const browserStore = createBrowserStoreMemo({
    domain: { chromosome: "chr12", start: 53380108, end: 53416378 },
    marginWidth: 100,
    trackWidth: 1400,
    multiplier: 3,
  });

  const domain = browserStore((s) => s.domain);

  const folders = foldersByAssembly[currentAssembly];

  const trackStore = createTrackStoreMemo([], [currentAssembly]);
  const trackContext: TrackSelectTrackContext = {
    onGeneClick: ({ trackId, transcript }) => {
      console.log("Gene clicked", trackId, transcript.name);
    },
    onBiosampleFeatureHover: ({ trackId, rect }) => {
      console.log("Biosample feature hovered", trackId, rect.name ?? "unknown");
    },
  };

  return (
    <>
      <div>
        {domain.chromosome}:{domain.start}-{domain.end}
      </div>
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        size="small"
        onClick={() => setOpen(true)}
      >
        Select Tracks
      </Button>
      <TrackSelect
        assembly={currentAssembly}
        folders={folders}
        initialSelectedIds={defaultSelections}
        sessionStorageKey={`track-select:${currentAssembly}`}
        trackContext={trackContext}
        trackStore={trackStore}
        maxTracks={30}
        open={open}
        onClose={() => setOpen(false)}
        title="Select Tracks"
      />
      <GQLWrapper>
        <Browser browserStore={browserStore} trackStore={trackStore} />
      </GQLWrapper>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Main />);

// Default selections for TrackSelect UI (uses folder row IDs)
const defaultSelections: InitialSelectedIdsByAssembly = {
  GRCh38: {
    "human-genes": ["human-genes/gencode-basic"],
    "human-biosamples": [
      "human-biosamples/ccre-aggregate",
      "human-biosamples/dnase-aggregate",
    ],
  },
  mm10: {
    "mouse-genes": ["mouse-genes/gencode-basic"],
    "mouse-biosamples": [
      "mouse-biosamples/ccre-aggregate",
      "mouse-biosamples/dnase-aggregate",
    ],
  },
};
