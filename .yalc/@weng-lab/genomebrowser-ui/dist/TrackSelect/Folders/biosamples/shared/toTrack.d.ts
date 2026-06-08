import { Rect, Track, ValuedPoint } from '@weng-lab/genomebrowser';
import { FC } from 'react';
import { CreateTrackOptions } from '../../types';
import { BiosampleRowInfo } from './types';
export type BiosampleTrackContext = {
    onBiosampleFeatureClick?: (args: {
        trackId: string;
        row: BiosampleRowInfo;
        rect: Rect;
    }) => void;
    onBiosampleFeatureHover?: (args: {
        trackId: string;
        row: BiosampleRowInfo;
        rect: Rect;
    }) => void;
    biosampleFeatureTooltip?: FC<Rect>;
    biosampleSignalTooltip?: FC<ValuedPoint[]>;
    biosampleMethylTooltip?: FC<ValuedPoint[]>;
};
export declare function createBiosampleTrack(row: BiosampleRowInfo, options: CreateTrackOptions): Track;
