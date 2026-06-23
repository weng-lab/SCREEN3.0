import { CcreClass } from "common/types/globalTypes";

/**
 * cCRE Groups
 */
export const PLS = "#FF0000";
export const pELS = "#FFA700";
export const dELS = "#FFCD00";
export const ELS = "#FF5400";
export const CA_H3K4me3 = "#ffaaaa";
export const CA_CTCF = "#00B0F0";
export const CA_only = "#06DA93";
export const CA_TF = "#be28e5";
export const TF_only = "#d876ec";
export const CTCF_Bound = "#6495ED";
export const LowDNase = "#e1e1e1";
export const Unclassified = "#8c8c8c";

export const CLASS_COLORS: Record<CcreClass, string> = {
  PLS: PLS,
  pELS: pELS,
  dELS: dELS,
  "CA-H3K4me3": CA_H3K4me3,
  "CA-CTCF": CA_CTCF,
  "CA-TF": CA_TF,
  CA: CA_only,
  TF: TF_only,
  noclass: Unclassified,
  InActive: LowDNase,
};
