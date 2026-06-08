import { InferBigBedRow } from '@weng-lab/genomebrowser';
import { mohdAtacFdrPeaksSchema, mohdAtacPseudorepPeaksSchema } from './bigBedSchemas';
type MohdBigBedRow = InferBigBedRow<typeof mohdAtacFdrPeaksSchema> | InferBigBedRow<typeof mohdAtacPseudorepPeaksSchema>;
export declare function MohdBigBedTooltip(rect: MohdBigBedRow): import("react/jsx-runtime").JSX.Element;
export {};
