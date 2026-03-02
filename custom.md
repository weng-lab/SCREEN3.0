# Custom Track Notes

1. Import the custom track config and row type
   import type { OtherTrackInfo } from ".../other-tracks/shared/types";
   import { tfPeaksTrack } from ".../CustomTracks/TfPeaks";
2. Add OtherTrackInfo to generateTrack's row union type
   The function accepts rows from any folder, so the parameter type must include the new row shape:
   row: BiosampleRowInfo | GeneRowInfo | OtherTrackInfo
3. Add a handler branch in generateTrack for the other-tracks folder
   Before the biosample handler (which is the fallthrough/default), add a check for folderId.includes("other-tracks"). Inside, match on row.id to return the corresponding pre-defined track config:
   if (folderId.includes("other-tracks")) {
   if (row.id === "tf-peaks") {
   return { ...tfPeaksTrack };
   }
   return null;
   }

4. Add MethylCConfig to imports
   import {
   // ...existing imports...
   MethylCConfig,
   } from "@weng-lab/genomebrowser";
5. Add wgbs to your ASSAY_COLORS map
   wgbs: "#648bd8",
6. Add case "wgbs" to the generateTrack switch + a default template
   In the switch, before default::
   case "wgbs":
   track = {
   ...defaultMethylC,
   id: sel.id,
   title: sel.displayName,
   urls: {
   plusStrand: {
   cpg: { url: sel.cpgPlus ?? "" },
   chg: { url: "" },
   chh: { url: "" },
   depth: { url: sel.coverage ?? "" },
   },
   minusStrand: {
   cpg: { url: sel.cpgMinus ?? "" },
   chg: { url: "" },
   chh: { url: "" },
   depth: { url: sel.coverage ?? "" },
   },
   },
   };
   break;
   And also add ?? "" fallback to existing sel.url references (since url is now optional on BiosampleRowInfo):
   url: sel.url ?? "",
   And add the template constant:
   const defaultMethylC: Omit<MethylCConfig, "id" | "title" | "urls"> = {
   trackType: TrackType.MethylC,
   height: 100,
   displayMode: DisplayMode.Split,
   titleSize: 12,
   color: "#648bd8",
   colors: {
   cpg: "#648bd8",
   chg: "#ff944d",
   chh: "#ff00ff",
   depth: "#525252",
   },
   };
