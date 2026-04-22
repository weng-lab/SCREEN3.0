export type ReleaseNoteChild = {
  title: string;
  description: string;
  screenshot?: string;
  imgWidth?: number;
  link?: string;
};

export type ReleaseNote = {
  id: string;
  version: string;
  date: string;
  title: string;
  children: ReleaseNoteChild[];
};

export const releaseNotes: ReleaseNote[] = [
  {
    id: "v3.2026.1",
    version: "v3.2026.1",
    date: "April 2026",
    title: "April Release",
    children: [
      {
        title: "Overlapping Representative ChIP-seq Peaks",
        link: "/GRCh38/gene/SOX4?open=BYegjCDKDyAaAsIAMQ",
        description:
          "The TF motif tab for cCREs now includes a table of overlapping representative ChIP-seq peaks, allowing users to view transcription factors, peak locations, and corresponding motif logos and coordinates when motifs are present. Additionally, a new genome browser track displays representative ChIP-seq peaks, with green boxes highlighting regions containing motifs.",
        screenshot: "rpeakstable.png",
        imgWidth: 500,
      },
      {
        title: "PhastCons Conservation Scores",
        description:
          "cCREs now include PhastCons conservation scores across mammals (241 species), vertebrates (100 species), and primates (43 species), enabling better assessment of evolutionary conservation.",
      },
      {
        title: "CpG Coverage",
        description:
          "Users can now select and view WGBS (CpG coverage) tracks for some of ENCODE human biosamples directly in the genome browser.",
        screenshot: "cpgCoverage.png",
        imgWidth: 800,
      },
      {
        title: "Promoter cCREs",
        description:
          "Gene entity page now include a table of promoter cCREs, allowing users to explore associated promoter regulatory elements.",
      },
    ],
  },
  {
    id: "screen-2020",
    version: "SCREEN 2020",
    date: "2020",
    title: "Legacy releases supporting Registry Versions 2 and 3 during the earlier SCREEN platform cycle.",
    children: [
      {
        title: "Registry expansion era",
        description:
          "This period captures the transition through earlier Registry versions and preserves the interface used for a large portion of the prior SCREEN lifecycle.",
      },
      {
        title: "Reproducibility support",
        description:
          "Maintaining these releases helps users revisit analyses, screenshots, and workflows that were created against older platform states.",
      },
    ],
  },
  {
    id: "screen-2018",
    version: "SCREEN 2018",
    date: "2018",
    title: "Original hg19-era SCREEN release that introduced the earlier browser and data access experience.",
    children: [
      {
        title: "Initial launch",
        description:
          "The first SCREEN release established the original browsing and discovery workflow for regulatory annotations in the hg19-era experience.",
      },
      {
        title: "Historical reference",
        description:
          "This version serves as the earliest point in the release timeline and anchors the long-term history of the application.",
      },
    ],
  },
];
