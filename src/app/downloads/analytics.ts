import { track } from "@vercel/analytics";

export function trackDownload(url: string, name: string, source: string) {
  console.log("file-download", { url, name, source });
  track("file-download", { url, name, source });
}
