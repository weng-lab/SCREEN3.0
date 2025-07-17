import { Stack } from "@mui/material";
import SnpGWASLdr from "./SnpGWASLdr";
import SnpFrequencies from "./SnpFrequencies";

const VariantInfo = ({ snpid }: { snpid: string }) => {
  return (
    <Stack spacing={2}>
      <SnpFrequencies snpid={snpid} />
      <SnpGWASLdr snpid={snpid} />{" "}
    </Stack>
  );
};

export default VariantInfo;
