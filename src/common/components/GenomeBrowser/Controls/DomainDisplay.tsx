import { Box, Stack, Typography } from "@mui/material";
import { BrowserStoreInstance, Cytobands } from "@weng-lab/genomebrowser";

export default function DomainDisplay({
  browserStore,
  assembly,
}: {
  browserStore: BrowserStoreInstance;
  assembly: string;
}) {
  const currentDomain = browserStore((state) => state.domain);
  return (
    <Stack alignItems={"center"}>
      <Typography>
        {currentDomain.chromosome}:{currentDomain.start.toLocaleString()}-{currentDomain.end.toLocaleString()}
      </Typography>
      <Box minHeight={20} flexGrow={1} display={"flex"}>
        <svg
          width="100%"
          height={20}
          preserveAspectRatio="xMidYMid meet"
          viewBox={`0 0 700 20`}
          style={{ alignSelf: "flex-end" }}
        >
          <Cytobands assembly={assembly === "GRCh38" ? "hg38" : "mm10"} currentDomain={currentDomain} />
        </svg>
      </Box>
    </Stack>
  );
}
