import { Stack } from "@mui/material";
import SnpImmuneGWASLdr from "./SnpImmuneGWASLdr";
import SnpFrequencies from "./SnpFrequencies";

const VariantInfo = ({ snpid }: { snpid: string }) => {
  return (
    <Stack spacing={2}>
      <SnpFrequencies snpid={snpid} />
      <SnpImmuneGWASLdr snpid={snpid} />
    </Stack>
  );
};

export default VariantInfo;
