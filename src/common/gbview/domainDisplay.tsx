import { Box } from "@mui/material";
import { BrowserStoreInstance, Cytobands } from "@weng-lab/genomebrowser";

export default function DomainDisplay({ browserStore, assembly }: { browserStore: BrowserStoreInstance, assembly: string }) {
    const currentDomain = browserStore((state) => state.domain);
    return (
        <Box
            width={"100%"}
            justifyContent={"space-between"}
            flexDirection={"row"}
            display={"flex"}
            alignItems={"center"}
        >
            <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>
                {currentDomain.chromosome}:{currentDomain.start.toLocaleString()}-{currentDomain.end.toLocaleString()}
            </h3>
            <svg width={700} height={20}>
                <Cytobands
                    assembly={assembly === "GRCh38" ? "hg38" : "mm10"}
                    currentDomain={currentDomain}
                />
            </svg>
            <h3 style={{ marginBottom: "0px", marginTop: "0px" }}>{assembly === "GRCh38" ? "hg38" : "mm10"}</h3>
        </Box>
    );
}