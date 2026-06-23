import { LinkComponent } from "common/components/LinkComponent";
import { ReactNode } from "react";

export type ReleaseNoteChild = {
  title?: string;
  /** Plain text or inline JSX (e.g. text containing links). Rendered inside a `<Typography>` paragraph, so keep content inline-level. */
  description: ReactNode;
  screenshot?: string;
  imgWidth?: number;
  /** Skip the default frame (border, rounded corners, grey background) on the screenshot. Use for images that already have their own styling, e.g. a window with a drop shadow. */
  disableScreenshotStyling?: boolean;
  /** Disable click-to-enlarge (lightbox) for this screenshot. The lightbox is enabled by default. */
  disableLightbox?: boolean;
  link?: string;
};

export type ReleaseNoteSection = {
  title?: string;
  /** Plain text or inline JSX (e.g. text containing links). Rendered inside a `<Typography>` paragraph, so keep content inline-level. */
  description?: ReactNode;
  screenshot?: string;
  imgWidth?: number;
  /** Skip the default frame (border, rounded corners, grey background) on the screenshot. Use for images that already have their own styling, e.g. a window with a drop shadow. */
  disableScreenshotStyling?: boolean;
  /** Disable click-to-enlarge (lightbox) for this screenshot. The lightbox is enabled by default. */
  disableLightbox?: boolean;
  bulletedChildren?: boolean;
  children?: ReleaseNoteChild[];
};

export type ReleaseNote = {
  id: string;
  version: string;
  date: string;
  title: string;
  /** One-line summary of the release. Shown as a subheader below the title, and used by the homepage banner for the most recent release. */
  summary?: string;
  sections: ReleaseNoteSection[];
};


export const RELEASE_NOTES: ReleaseNote[] = [
  {
    id: "r3.2026.2",
    version: "r3.2026.2",
    date: "25 June 2026",
    title: "June 2026 Release",
    summary: "Public API Access, 240 Mammal Conservation Simplex + Alignment, and sitewide improvements",
    sections: [
      {
        title: "API access",
        description: (
          <>
            All SCREEN data is publicly available for download at{" "}
            <LinkComponent href={"https://screen.wenglab.org/downloads"}>
              https://screen.wenglab.org/downloads
            </LinkComponent>{" "}
            and can also be accessed through our API. We are providing authorized access to the API, which requires an
            API key for programmatic use. Please sign in to the API Console{" "}
            <LinkComponent href={"https://console.wenglab.org/"} openInNewTab showExternalIcon>
              https://console.wenglab.org/
            </LinkComponent>{" "}
            to generate your API key. API key generation and usage instructions are available in the documentation{" "}
            <LinkComponent href="https://console.wenglab.org/docs/getting-started/auth" openInNewTab showExternalIcon>
              https://console.wenglab.org/docs/getting-started/auth
            </LinkComponent>
          </>
        ),
      },
      {
        title: "240 Mammal Conservation Simplex and Sequence Alignment",
        children: [
          {
            title: "Conservation Simplex",
            description:
              "The Conservation Simplex summarizes the evolutionary conservation profile of the selected human cCRE using a multiple genome alignment of human and 240 other placental mammals. Heatmaps show the distribution of cCREs according to two alignment-coverage metrics: N₁, the number of mammalian genomes with high alignment coverage, and N₂, the number with low alignment coverage. Background heatmaps are shown for all cCREs and for cCREs in the same class as the selected element, allowing users to compare the selected cCRE with genome-wide and class-specific conservation patterns.",
            link: "/GRCh38/ccre/EH38E3314260/conservation?open=BYegDCCiASDMAclawIwBYBMA2CB2IA",
            screenshot: "ConservationSimplex.png",
            disableScreenshotStyling: true,
            imgWidth: 350
          },
          {
            title: "240 Mammal Sequence Alignment",
            description:
              "In the 240 mammals alignment view, the right panel displays the aligned sequences of 240 placental mammalian genomes relative to the human reference sequence for the selected cCRE. The alignment is shown in an interactive, user-filterable plot. An accompanying interactive phylogenetic tree (left panel) shows the evolutionary relationships among the species, with controls to highlight species by their percentage of aligned positions within the human cCRE.",
            link: "/GRCh38/ccre/EH38E3314260/conservation?open=BYegDCCiASDMAclawIwBYBMA2CB2IA",
            screenshot: "240MammalAlignment.png",
            disableScreenshotStyling: true,
            imgWidth: 350
          },
        ],
      },
      {
        title: "Other Improvements",
        bulletedChildren: true,
        children: [
          {
            description: "Users can now search by gene alias in addition to gene name.",
          },
          {
            description: "Individual cCRE-Gene link files available rather than grouped together in .zip files.",
          },
          {
            description:
              "When biosample-specific z-scores are shown, a biosample-specific classification for the cCRE is now provided.",
          },
          {
            description:
              "Distance used for cCRE to TSS has been standardized across the site to use the middle of the cCRE as the anchor, with an optional override to use closest point instead. This was done to match the distance used for cCRE classification.",
          },
          {
            description:
              "Gene Entity's “Nearby cCREs” table now allows filtering by an arbitrary window around each TSS (+/- 100kb) instead of only by distance magnitude.",
          },
          {
            description: "Gene Entity's “Nearby cCREs” table now supports the “Gene is 1 of 3 closest” option in mm10.",
          },
          {
            description: "Download cCREs in Genomic Region now provides a cCRE class filter.",
          },
        ],
      },
    ],
  },
  {
    id: "r3.2026.1",
    version: "r3.2026.1",
    date: "30 April 2026",
    title: "April 2026 Release",
    summary: "ChIP-seq peaks, PhastCons scores, CpG coverage, and promoter cCREs",
    sections: [
      {
        title: "Features, Updates, Status",
        bulletedChildren: true,
        children: [
          {
            description:
              "The transcription factor (TF) motifs tab for cCREs, accessible via the More icon in the sidebar, now includes a table of representative TF ChIP-seq peaks overlapping each cCRE. This feature enables users to identify TFs binding at a given cCRE, examine individual ChIP-seq peak locations, and view corresponding TF motif logos and motif coordinates when motif sites are present. In addition, a new genome browser track, accessible via the Genome Browser icon, displays representative ChIP-seq peaks, with motif sites within peaks highlighted as green boxes.",
            link: "/GRCh38/ccre/EH38E3314260/tf?open=BYegDCCiASDMAclawIwBYBMA2CKCsQA",
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
    id: "screen-2025",
    version: "SCREEN 2025",
    date: "2025",
    title: "Visualization-focused release with entity dedicated pages",
    sections: [
      {
        bulletedChildren: true,
        children: [
          {
            description:
              "The SCREEN 2025 release offered more dedicated entity pages, as well as new entity type Genome Wide Associated Study (GWAS). This release also incuded brand new visualization tools such as gene expression plots for genes and z-score plots for ccres. Genome broswser updated to be entity focused ",
          },
          {
            description:
              "Brand new visualization tools such as gene expression plots for genes and z-score plots for ccres ",
            screenshot: "SCREEN2025.png",
            imgWidth: 500,
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
            description: "cCRE Registry Version 2",
            link: "https://screen-v2.wenglab.org/",
          },
          {
            description: "cCRE Registry Version 3",
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
