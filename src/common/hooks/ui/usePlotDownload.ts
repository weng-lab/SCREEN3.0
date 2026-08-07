import { DownloadPlotHandle } from "@weng-lab/visualization";
import { useRef } from "react";

export function usePlotDownload() {
  const ref = useRef<DownloadPlotHandle>(null);
  return {
    ref,
    onDownloadSVG: () => ref.current?.downloadSVG(),
    onDownloadPNG: () => ref.current?.downloadPNG(),
  };
}
