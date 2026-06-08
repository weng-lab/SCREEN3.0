export type PsychscreenTrackType = "bigwig" | "bigbed";

export type PsychscreenTrackInfo = {
  id: string;
  sourceId?: string;
  category: string;
  subcategory: string;
  title: string;
  url: string;
  trackType: PsychscreenTrackType;
  color?: string;
};

export type PsychscreenDataFile = PsychscreenTrackInfo[];
