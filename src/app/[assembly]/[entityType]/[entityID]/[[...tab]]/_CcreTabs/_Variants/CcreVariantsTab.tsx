import { Stack } from "@mui/material";
import { useEntityMetadataReturn } from "common/hooks/useEntityMetadata";
import GWASLdr from "./GWASLdr";
import EQTLs from "common/components/EQTLTables";
import { Assembly } from "common/types/globalTypes";
import IntersectingSNPs from "../../_RegionTabs/_Variants/IntersectingSNPs";

const CcreVariantsTab = ({ CcreData, assembly }: { CcreData: useEntityMetadataReturn<"ccre">; assembly: Assembly }) => {
  return (
    <Stack spacing={2}>
      <IntersectingSNPs
        region={{
          chromosome: CcreData.data.chrom,
          start: CcreData.data.start,
          end: CcreData.data.start + CcreData.data.len,
        }}
      />
      <GWASLdr accession={CcreData.data.info.accession} />
      <EQTLs data={CcreData.data} entityType="ccre" assembly={assembly} />
    </Stack>
  );
};

export default CcreVariantsTab;
