import type { MohdOme } from "./config";

export type MohdMethylStrandUrls = {
  cpg: string;
  chg: string;
  chh: string;
  depth: string;
};

export type MohdDataRow = {
  ome: string;
  site: string;
  sample_id: string;
  kit_id?: string;
  file_type: string;
  filename: string;
  sex: string;
  status: string;
};

type MohdBaseRowInfo = {
  id: string;
  ome: MohdOme;
  site: string;
  sampleId: string;
  kitId?: string;
  sex: string;
  status: string;
  description: string;
  trackCategory: "Signal" | "Annotation" | "Methylation";
};

export type MohdFileRowInfo = MohdBaseRowInfo & {
  kind: "file";
  filename: string;
};

export type MohdWgbsMethylRowInfo = MohdBaseRowInfo & {
  kind: "wgbs-methyl";
  filenames: {
    plusStrand: MohdMethylStrandUrls;
    minusStrand: MohdMethylStrandUrls;
  };
};

export type MohdRowInfo = MohdFileRowInfo | MohdWgbsMethylRowInfo;

export type MohdDataFile = MohdDataRow[];
