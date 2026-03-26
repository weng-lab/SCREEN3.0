import { trackDownload } from "./analytics";

//Imported from old SCREEN
function downloadBlob(blob, filename, assembly = "unknown") {
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);

  // Track the download
  trackDownload(url, filename, "tsv-export", assembly);

  downloadLink.click();
  document.body.removeChild(downloadLink);
}

//Imported from old SCREEN
//Move to utils
export function downloadTSV(text, filename, assembly = "unknown") {
  downloadBlob(new Blob([text], { type: "text/plain" }), filename, assembly);
}
