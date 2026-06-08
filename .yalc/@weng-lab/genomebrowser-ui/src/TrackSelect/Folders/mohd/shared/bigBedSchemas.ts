import { defineBigBedSchema } from "@weng-lab/genomebrowser";
import type { MohdFileRowInfo } from "./types";

export const mohdAtacFdrPeaksSchema = defineBigBedSchema({
  name: "string",
  score: "number",
  strand: "string",
  signalValue: "number",
  pValue: "number",
  qValue: "number",
  peak: "number",
});

export const mohdAtacPseudorepPeaksSchema = defineBigBedSchema({
  name: "string",
  score: "number",
  strand: "string",
  signalValue: "number",
  pValue: "number",
  qValue: "number",
  peak: "number",
});

export function getMohdBigBedSchema(row: MohdFileRowInfo) {
  if (row.description === "FDR 0.05 peaks") {
    return mohdAtacFdrPeaksSchema;
  }

  if (row.description === "Pseudorep peaks") {
    return mohdAtacPseudorepPeaksSchema;
  }

  return undefined;
}
