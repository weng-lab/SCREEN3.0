export declare const MOHD_BASE_URL = "https://downloads.mohdconsortium.org";
export declare const MOHD_OME_CONFIG: {
    readonly atac: {
        readonly label: "ATAC";
        readonly color: "#02c7b9";
        readonly downloadPath: "2_ATAC";
    };
    readonly rna: {
        readonly label: "RNA";
        readonly color: "#00aa00";
        readonly downloadPath: "3_RNA";
    };
    readonly wgbs: {
        readonly label: "WGBS";
        readonly color: "#648bd8";
        readonly downloadPath: "1_WGBS";
    };
};
export type MohdRawOme = keyof typeof MOHD_OME_CONFIG;
export type MohdOme = (typeof MOHD_OME_CONFIG)[MohdRawOme]["label"];
export declare function getMohdOmeConfig(rawOme: string): {
    readonly label: "ATAC";
    readonly color: "#02c7b9";
    readonly downloadPath: "2_ATAC";
} | {
    readonly label: "RNA";
    readonly color: "#00aa00";
    readonly downloadPath: "3_RNA";
} | {
    readonly label: "WGBS";
    readonly color: "#648bd8";
    readonly downloadPath: "1_WGBS";
};
export declare function createMohdFileUrl({ ome, sampleId, filename, }: {
    ome: string;
    sampleId: string;
    filename: string;
}): string;
export declare function isMohdOmeLabel(value: string): boolean;
export declare function MohdOmeIcon({ type }: {
    type: string;
}): import("react/jsx-runtime").JSX.Element;
