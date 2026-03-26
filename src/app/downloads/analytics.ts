import { track } from "@vercel/analytics";

export function trackDownload(url: string, name: string, source: string, assembly: string) {
  if (assembly.toLowerCase() === "human") {
    assembly = "GRCh38";
  } else if (assembly.toLowerCase() === "mouse") {
    assembly = "mm10";
  }
  console.log("file-download", { url, name, source, assembly });
  track("file-download", { url, name, source, assembly });
}
