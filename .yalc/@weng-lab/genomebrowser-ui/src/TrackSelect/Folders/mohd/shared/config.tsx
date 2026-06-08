import { Box } from "@mui/material";

export const MOHD_BASE_URL = "https://downloads.mohdconsortium.org";

export const MOHD_OME_CONFIG = {
  atac: {
    label: "ATAC",
    color: "#02c7b9",
    downloadPath: "2_ATAC",
  },
  rna: {
    label: "RNA",
    color: "#00aa00",
    downloadPath: "3_RNA",
  },
  wgbs: {
    label: "WGBS",
    color: "#648bd8",
    downloadPath: "1_WGBS",
  },
} as const;

export type MohdRawOme = keyof typeof MOHD_OME_CONFIG;
export type MohdOme = (typeof MOHD_OME_CONFIG)[MohdRawOme]["label"];

const MOHD_OME_LABELS = Object.values(MOHD_OME_CONFIG).map(
  (config) => config.label,
);

export function getMohdOmeConfig(rawOme: string) {
  const config = MOHD_OME_CONFIG[rawOme.toLowerCase() as MohdRawOme];

  if (!config) {
    throw new Error(`Unknown MOHD ome: ${rawOme}`);
  }

  return config;
}

export function createMohdFileUrl({
  ome,
  sampleId,
  filename,
}: {
  ome: string;
  sampleId: string;
  filename: string;
}) {
  const { downloadPath } = getMohdOmeConfig(ome);
  return `${MOHD_BASE_URL}/${downloadPath}/${sampleId}/${filename}`;
}

export function isMohdOmeLabel(value: string) {
  return MOHD_OME_LABELS.includes(value as MohdOme);
}

export function MohdOmeIcon({ type }: { type: string }) {
  const { color } = getMohdOmeConfig(type);

  return (
    <Box
      data-testid={`mohd-ome-icon-${type.toLowerCase()}`}
      sx={{
        width: 12,
        height: 12,
        borderRadius: "20%",
        bgcolor: color,
      }}
    />
  );
}
