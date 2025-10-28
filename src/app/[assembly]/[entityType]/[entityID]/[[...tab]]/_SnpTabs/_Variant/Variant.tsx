import { Stack } from "@mui/material";
import SnpImmuneGWASLdr from "./SnpImmuneGWASLdr";
import SnpFrequencies from "./SnpFrequencies";
import { EntityViewComponentProps } from "common/entityTabsConfig";

const VariantInfo = ({ entity }: EntityViewComponentProps) => {
  return (
    <Stack spacing={2}>
      <SnpFrequencies snpid={entity.entityID} />
      <SnpImmuneGWASLdr snpid={entity.entityID} />
    </Stack>
  );
};

export default VariantInfo;
