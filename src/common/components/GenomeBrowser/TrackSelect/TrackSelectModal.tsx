import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import type { Track, TrackStoreInstance } from "@weng-lab/genomebrowser";
import { foldersByAssembly, TrackSelect } from "@weng-lab/genomebrowser-ui";
import type {
  BiosampleRowInfo,
  GeneRowInfo,
  InitialSelectedIdsByAssembly,
  OtherTrackInfo,
  TrackSelectProps,
} from "@weng-lab/genomebrowser-ui";
import { useMemo, useState } from "react";
import { injectCallbacks, TrackCallbacks } from "./defaultTracks";

type Assembly = "GRCh38" | "mm10";

type TrackSelectFolder = TrackSelectProps["folders"][number];
type TrackSelectRow = BiosampleRowInfo | GeneRowInfo | OtherTrackInfo;

const defaultSelectedTrackIds: InitialSelectedIdsByAssembly = {
  GRCh38: {
    "human-genes": ["human-genes/gencode-basic"],
    "human-biosamples": [
      "human-biosamples/ccre-aggregate",
      "human-biosamples/dnase-aggregate",
      "human-biosamples/h3k4me3-aggregate",
      "human-biosamples/h3k27ac-aggregate",
      "human-biosamples/ctcf-aggregate",
      "human-biosamples/atac-aggregate",
    ],
  },
  mm10: {
    "mouse-genes": ["mouse-genes/gencode-basic"],
    "mouse-biosamples": [
      "mouse-biosamples/ccre-aggregate",
      "mouse-biosamples/dnase-aggregate",
      "mouse-biosamples/h3k4me3-aggregate",
      "mouse-biosamples/h3k27ac-aggregate",
      "mouse-biosamples/ctcf-aggregate",
      "mouse-biosamples/atac-aggregate",
    ],
  },
};

export default function TrackSelectModal({
  trackStore,
  assembly,
  callbacks,
}: {
  trackStore: TrackStoreInstance;
  assembly: string;
  callbacks: TrackCallbacks;
}) {
  const [open, setOpen] = useState(false);

  const folders = useMemo(() => foldersByAssembly[assembly as Assembly], [assembly]);

  const screenFolders = useMemo(
    () => folders.map((folder) => withScreenCallbacks(folder, callbacks)),
    [folders, callbacks]
  );

  const sessionStorageKey = `${assembly}-screen-track-select-v2`;

  return (
    <>
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        size="small"
        onClick={() => setOpen(true)}
        sx={{ minHeight: 44 }}
      >
        Select Tracks
      </Button>
      <TrackSelect
        assembly={assembly as Assembly}
        folders={screenFolders}
        initialSelectedIds={defaultSelectedTrackIds}
        sessionStorageKey={sessionStorageKey}
        trackStore={trackStore}
        maxTracks={30}
        open={open}
        onClose={() => setOpen(false)}
        title="Track Selection"
      />
    </>
  );
}

function withScreenCallbacks(folder: TrackSelectFolder, callbacks: TrackCallbacks): TrackSelectFolder {
  return {
    ...folder,
    createTrack: (row, options): Track | null => {
      const track = folder.createTrack(row, options);
      return track ? injectCallbacks(track, callbacks, row as TrackSelectRow) : track;
    },
  };
}
