import { Stack } from "@mui/material"
import IntersectingSNPs from "common/components/IntersectingSNPs"
import { useEntityMetadataReturn } from "common/hooks/useEntityMetadata"
import GWASLdr from "./GWASLdr"

const IcreVariantsTab = ({CcreData}: {CcreData: useEntityMetadataReturn<"ccre">}) => {
  return (
    <Stack spacing={2}>
      <IntersectingSNPs region={CcreData.data.coordinates} />
      <GWASLdr accession={CcreData.data.accession} />
    </Stack>
  );
}

export default IcreVariantsTab