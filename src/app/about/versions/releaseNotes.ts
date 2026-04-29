export type ReleaseNoteChild = {
  title?: string;
  description: string;
  screenshot?: string;
  imgWidth?: number;
  link?: string;
};

export type ReleaseNoteSection = {
  title?: string;
  description?: string;
  screenshot?: string;
  imgWidth?: number;
  bulletedChildren?: boolean;
  children?: ReleaseNoteChild[];
};

export type ReleaseNote = {
  id: string;
  version: string;
  date: string;
  title: string;
  sections: ReleaseNoteSection[];
};

export const releaseNotes: ReleaseNote[] = [
  {
    id: "v2026.1",
    version: "v2026.1",
    date: "April 2026",
    title: "April Release",
    sections: [
      {
        title: "Features, Updates, Status",
        bulletedChildren: true,
        children: [
          {
            description:
              "The transcription factor (TF) motifs tab for cCREs, accessible via the More icon in the sidebar, now includes a table of representative TF ChIP-seq peaks overlapping each cCRE. This feature enables users to identify TFs binding at a given cCRE, examine individual ChIP-seq peak locations, and view corresponding TF motif logos and motif coordinates when motif sites are present. In addition, a new genome browser track, accessible via the Genome Browser icon, displays representative ChIP-seq peaks, with motif sites within peaks highlighted as green boxes.",
            link: "/GRCh38/gene/SOX4?open=BYegjCDKDyAaAsIAMQ",
            screenshot: "rpeakstable.png",
            imgWidth: 500,
          },
          {
            description:
              "cCREs now include PhastCons conservation scores across mammals (240 species), vertebrates (100 species), and primates (43 species), enabling improved assessment of evolutionary conservation.",
            link: "/GRCh38/ccre/EH38E3314260/conservation?open=BYegDCCiASDMAclawIwBYBMA2CB2IA",
          },
          {
            description:
              "Users can now select and view whole-genome bisulfite sequencing (WGBS) tracks for selected ENCODE human biosamples in the genome browser, with visualization limited to CpG methylation.",
            screenshot: "cpgCoverage.png",
            imgWidth: 800,
          },
          {
            description:
              "The gene page now includes a table of promoter cCREs, enabling users to explore associated promoter regulatory elements.",
            link: "/GRCh38/gene/SP1/ccres?open=BYegDCCiASDMAclawIwBYBMA2CB2ANKCiAMoAKxKQA",
          },
          {
            description:
              "Users can now search by gene ID (e.g., “ENSG…”). Searches using full cCRE accessions are now consistently faster, addressing prior latency issues.",
          },
        ],
      },
    ],
  },
  {
    id: "screen-2024",
    version: "SCREEN 2024",
    date: "2024",
    title: "Legacy release supporting cCRE Registry Version 4",
    sections: [
      {
        title: "Highlights",
        children: [
          {
            description:
              "The SCREEN 2024 release carried over the core features and data from the previous release, with updates to support cCRE Registry Version 4. The best feature of this release was the new and improved user interface which made navigation and data exploration more intuitive and efficient.",
            link: "https://screen-v4.wenglab.org/",
            screenshot: "SCREEN2024.png",
            imgWidth: 500,
          },
        ],
      },
    ],
  },
  {
    id: "screen-2020",
    version: "SCREEN 2020",
    date: "2020",
    title: "Legacy releases supporting cCRE Registry Versions 2 and 3",
    sections: [
      {
        screenshot: "SCREEN2020v2v3.png",
        imgWidth: 500,
        children: [
          {
            title: "Highlights",
            description:
              "The SCREEN 2020 release supported cCRE Registry Versions 2 and 3, providing users with access to new data types and enhanced visualization tools. The UI also allowed for users to search for elements in the form of a gene name or alias, a SNP rsID, a cCRE accession, or a genomic region",
          },
          {
            title: "Versions",
            description:
              "cCRE Registry Version 2",
            link: "https://screen-v2.wenglab.org/",
          },
          {
            description:
              "cCRE Registry Version 3",
            link: "https://screen-v3.wenglab.org/",
          },
        ],
      },
    ],
  },
  {
    id: "screen-2018",
    version: "SCREEN 2018",
    date: "2018",
    title: "hg19 SCREEN release supporting cCRE Registry Version 1",
    sections: [
      {
        children: [
          {
            description:
              "The initial release of SCREEN in 2018 supported cCRE Registry Version 1 and was based on the hg19 human genome assembly. This release provided users with download access to the V1 cCREs",
            link: "https://screen-v1.wenglab.org/",
            screenshot: "SCREEN2018.png",
            imgWidth: 500,
          },
        ],
      },
    ],
  },
];
