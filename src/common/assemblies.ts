import { hg38, mm10, type AssemblyDefinition } from "@weng-lab/genomebrowser";
import type { Assembly } from "common/types/globalTypes";

type AssemblyConfig = {
  browserAssembly: AssemblyDefinition;
  ucscDb: string;
  ucscCcreTrack: string;
  files: {
    sequence: string;
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
      sequence: "https://hgdownload.soe.ucsc.edu/goldenpath/hg38/bigZips/hg38.2bit",
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
      sequence: "https://hgdownload.soe.ucsc.edu/goldenpath/mm10/bigZips/mm10.2bit",
      cytobands: "/genome-browser/mm10.cytoBand.txt",
      cytobandsSource: "https://hgdownload.soe.ucsc.edu/goldenPath/mm10/database/cytoBand.txt.gz",
      chromInfo: "https://hgdownload.soe.ucsc.edu/goldenPath/mm10/database/chromInfo.txt.gz",
    },
  },
} satisfies Record<Assembly, AssemblyConfig>;
