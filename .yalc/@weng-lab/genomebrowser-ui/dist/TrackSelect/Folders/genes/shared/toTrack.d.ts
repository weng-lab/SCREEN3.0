import { Track, Transcript } from '@weng-lab/genomebrowser';
import { FC } from 'react';
import { CreateTrackOptions } from '../../types';
import { GeneRowInfo } from './types';
export type GeneTrackContext = {
    onGeneClick?: (args: {
        trackId: string;
        row: GeneRowInfo;
        transcript: Transcript;
    }) => void;
    onGeneHover?: (args: {
        trackId: string;
        row: GeneRowInfo;
        transcript: Transcript;
    }) => void;
    geneTooltip?: FC<Transcript>;
};
export declare function createGeneTrack(row: GeneRowInfo, options: CreateTrackOptions): Track;
