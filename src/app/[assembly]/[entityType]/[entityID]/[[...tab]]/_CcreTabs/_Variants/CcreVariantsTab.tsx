import { Stack } from "@mui/material"
import IntersectingSNPs from "common/components/IntersectingSNPs"
import { useEntityMetadataReturn } from "common/hooks/useEntityMetadata"
import GWASLdr from "./GWASLdr"

const CcreVariantsTab = ({CcreData}: {CcreData: useEntityMetadataReturn<"ccre">}) => {
  return (
    <Stack spacing={2}>
            <IntersectingSNPs region={{ chromosome:  CcreData.data.chrom, start:  CcreData.data.start, end:  CcreData.data.start +  CcreData.data.len }} />
            <GWASLdr accession={CcreData.data.info.accession} />
    </Stack>
  );
}

export default CcreVariantsTab