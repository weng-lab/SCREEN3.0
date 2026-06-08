import { Track, ValuedPoint } from '@weng-lab/genomebrowser';
import { FC } from 'react';
import { CreateTrackOptions } from '../../types';
import { MohdRowInfo } from './types';
export type MohdTrackContext = {
    mohdSignalTooltip?: FC<ValuedPoint[]>;
    mohdMethylTooltip?: FC<ValuedPoint[]>;
};
export declare function createMohdTrack(row: MohdRowInfo, options: CreateTrackOptions): Track | null;
