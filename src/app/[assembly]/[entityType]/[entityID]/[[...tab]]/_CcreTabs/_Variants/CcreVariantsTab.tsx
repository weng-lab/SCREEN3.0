import { Stack } from "@mui/material"
import IntersectingSNPs from "common/components/IntersectingSNPs"
import { useEntityMetadataReturn } from "common/hooks/useEntityMetadata"
import GWASLdr from "./GWASLdr"
import EQTLs from "common/components/EQTLTables"
import { Assembly } from "types/globalTypes"

const CcreVariantsTab = <A extends Assembly>({CcreData, assembly}: {CcreData: useEntityMetadataReturn<A, "ccre">, assembly: A}) => {
  return (
    <Stack spacing={2}>
            <IntersectingSNPs region={{ chromosome:  CcreData.data.chrom, start:  CcreData.data.start, end:  CcreData.data.start +  CcreData.data.len }} />
            <GWASLdr accession={CcreData.data.info.accession} />
            <EQTLs data={CcreData.data} entityType="ccre" assembly={assembly}/>
    </Stack>
  );
}

export default CcreVariantsTab