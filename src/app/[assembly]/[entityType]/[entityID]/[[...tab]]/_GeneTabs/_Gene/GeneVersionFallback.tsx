import { WarningAmberRounded } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

export type TableFallbackProps = {
  gene: string;
};

const VersionFallback = ({ gene }: TableFallbackProps) => {
    return (
        <Stack direction={"row"} border={"1px solid #e0e0e0"} borderRadius={1} p={2} spacing={1}>
            <WarningAmberRounded />
            <Typography><i>{gene}</i> is annotated in GENCODE Version 40, but gene expression data is currently only available for GENCODE Version 29</Typography>
        </Stack>
    );
};

export default VersionFallback;
