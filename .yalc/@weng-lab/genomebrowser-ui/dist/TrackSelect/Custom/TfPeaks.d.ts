import { CustomTrackConfig, Rect } from '@weng-lab/genomebrowser';
type OverlayInteractionRect = Rect & {
    chr?: string;
    pwm?: number[][];
    tfName?: string;
    expRatio?: string;
    cCREId?: string;
    experimentId?: string;
    expSupport?: Record<string, Record<string, string>>;
};
type OverlayBigBedConfig = CustomTrackConfig<OverlayInteractionRect> & {
    primaryUrl: string;
    overlayUrl: string;
    baseColor?: string;
    overlayColor?: string;
    filter?: string[];
};
export declare const PEAKS_BIGBED_URL = "https://users.wenglab.org/gaomingshi/no_trim.TF_name.rPeaks.bb";
export declare const DECORATOR_BIGBED_URL = "https://users.wenglab.org/gaomingshi/no_trim.TF_name.decorator.bb";
export declare const tfPeaksTrack: OverlayBigBedConfig;
export {};
