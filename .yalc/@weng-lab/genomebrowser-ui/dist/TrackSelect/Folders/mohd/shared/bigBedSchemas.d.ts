import { MohdFileRowInfo } from './types';
export declare const mohdAtacFdrPeaksSchema: {
    readonly name: "string";
    readonly score: "number";
    readonly strand: "string";
    readonly signalValue: "number";
    readonly pValue: "number";
    readonly qValue: "number";
    readonly peak: "number";
};
export declare const mohdAtacPseudorepPeaksSchema: {
    readonly name: "string";
    readonly score: "number";
    readonly strand: "string";
    readonly signalValue: "number";
    readonly pValue: "number";
    readonly qValue: "number";
    readonly peak: "number";
};
export declare function getMohdBigBedSchema(row: MohdFileRowInfo): {
    readonly name: "string";
    readonly score: "number";
    readonly strand: "string";
    readonly signalValue: "number";
    readonly pValue: "number";
    readonly qValue: "number";
    readonly peak: "number";
} | undefined;
