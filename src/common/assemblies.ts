import { hg38, mm10, type AssemblyDefinition } from "@weng-lab/genomebrowser";
import type { Assembly } from "common/types/globalTypes";

type AssemblyConfig = {
  browserAssembly: AssemblyDefinition;
  ucscDb: string;
  ucscCcreTrack: string;
  files: {
    cytobands: string;
    cytobandsSource: string;
    /** UCSC chromosome names, lengths, and sequence file paths (not a two-column chrom.sizes file). */
    chromInfo: string;
  };
};

// SCREEN calls the human assembly GRCh38 in routes and API requests; UCSC calls it hg38.
export const assemblies = {
  GRCh38: {
    browserAssembly: hg38,
    ucscDb: "hg38",
    ucscCcreTrack: "cCREs",
    files: {
      cytobands: "/genome-browser/hg38.cytoBand.txt",
      cytobandsSource: "https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/cytoBand.txt.gz",
      chromInfo: "https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/chromInfo.txt.gz",
    },
  },
  mm10: {
    browserAssembly: mm10,
    ucscDb: "mm10",
    ucscCcreTrack: "encodeCcreCombined",
    files: {
      cytobands: "/genome-browser/mm10.cytoBand.txt",
      cytobandsSource: "https://hgdownload.soe.ucsc.edu/goldenPath/mm10/database/cytoBand.txt.gz",
      chromInfo: "https://hgdownload.soe.ucsc.edu/goldenPath/mm10/database/chromInfo.txt.gz",
    },
  },
} satisfies Record<Assembly, AssemblyConfig>;
