import { track } from "@vercel/analytics";

export function trackDownload(url: string, name: string, source: string, assembly: string) {
  console.log("file-download", { url, name, source, assembly });
  track("file-download", { url, name, source, assembly });
}
