import { track } from "@vercel/analytics";

export function trackDownload(url: string, name: string, source: string) {
  track("file-download", { url, name, source });
}
