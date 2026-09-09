import { defineTrackModule, fetchOnChange } from "@weng-lab/genomebrowser";
import { bed3Schema, createBigBedFile } from "@weng-lab/genomic-reader";
import { z } from "zod";
import TfSettings from "./TfSettings";
import TfTooltip from "./TfTooltip";
import TfRenderer from "./TfRenderer";

export const PEAKS_URL = "https://users.wenglab.org/gaomingshi/no_trim.TF_name.rPeaks.bb";
export const MOTIFS_URL = "https://users.wenglab.org/gaomingshi/no_trim.TF_name.decorator.bb";
const schema = z.object({
  primaryUrl: fetchOnChange(z.string().min(1)),
  overlayUrl: fetchOnChange(z.string().min(1)),
  filter: z.array(z.string()).default([]),
  overlayColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .default("#36dd81"),
  rowHeight: z.number().min(1).default(12),
});
export type Config = z.infer<typeof schema>;
type FileReader = ReturnType<typeof createBigBedFile<typeof bed3Schema>>;
export type BedRow = Awaited<ReturnType<FileReader["read"]>>[number];
export type Peak = BedRow & { name: string; score?: number; cCREId?: string; biosamples: string[]; pwm?: number[][] };
export type Data = { primary: Peak[]; overlay: BedRow[] };

export function parsePeak(row: BedRow): Peak {
  const f = row.fields;
  let biosamples: string[] = [];
  try {
    const support: unknown = JSON.parse(f[13] ?? "{}");
    if (support && typeof support === "object" && !Array.isArray(support)) biosamples = Object.keys(support).sort();
  } catch {
    /* Optional source annotation may be missing. */
  }
  const score = Number.parseFloat(f[1]);
  return { ...row, name: f[0] ?? "", score: Number.isFinite(score) ? score : undefined, cCREId: f[11], biosamples };
}
export const tfPeaksModule = defineTrackModule<Peak>()({
  type: "screen-tf-peaks",
  defaults: { height: 80, color: "#555555" },
  configSchema: schema,
  async fetch({ track: { config }, demand: { region }, resources }): Promise<Data> {
    const read = async (url: string) => {
      let file = resources.get<FileReader>(url);
      if (!file) {
        file = createBigBedFile({ url, schema: bed3Schema });
        resources.set(url, file);
      }
      return file.read(region);
    };
    const [primary, overlay] = await Promise.all([read(config.primaryUrl), read(config.overlayUrl)]);
    return { primary: primary.map(parsePeak), overlay };
  },
  render: { full: TfRenderer },
  settingsComponent: TfSettings,
  tooltipComponent: TfTooltip,
});
