import { Stack } from "@mui/material"
import IntersectingSNPs from "common/components/IntersectingSNPs"
import { useElementMetadataReturn } from "common/hooks/useElementMetadata"
import GWASLdr from "./GWASLdr"
import EQTLs from "common/components/EQTLTables"

const IcreVariantsTab = ({icreData}: {icreData: useElementMetadataReturn<"icre">["data"]}) => {
  return (
    <Stack spacing={2}>
      <IntersectingSNPs region={icreData.coordinates} />
      <GWASLdr accession={icreData.accession} />
      <EQTLs data={icreData} elementType="icre"/>
    </Stack>
  );
}

export default IcreVariantsTab