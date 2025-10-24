import { Stack } from "@mui/material";
import ImmuneGWASLdr from "./ImmuneGWASLdr";
import EQTLs from "common/components/EQTLTables";
import { GenomicRange } from "common/types/globalTypes";
import IntersectingSNPs from "../../_RegionTabs/_Variants/IntersectingSNPs";
import { useCcreData } from "common/hooks/useCcreData";
import { EntityViewComponentProps } from "common/entityTabsConfig";

const CcreVariantsTab = ({ entity }: EntityViewComponentProps) => {
  const {assembly, entityID: accession} = entity
  const { data, loading, error } = useCcreData({ assembly, accession });

  const coordinates: GenomicRange = {
    chromosome: data?.chrom,
    start: data?.start,
    end: data?.start + data?.len
  }

  return (
    <Stack spacing={2}>
      <IntersectingSNPs
        region={coordinates}
      />
      {entity.assembly === "GRCh38" && <ImmuneGWASLdr accession={accession} />}
      {entity.assembly === "GRCh38" && <EQTLs entity={entity} />}
    </Stack>
  );
};

export default CcreVariantsTab;
