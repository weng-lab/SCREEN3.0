"use client";
import { Stack } from "@mui/material";
import ImmuneGWASLdr from "./ImmuneGWASLdr";
import EQTLs from "common/components/EQTLTables";
import IntersectingSNPs from "../../_RegionTabs/_Variants/IntersectingSNPs";
import { EntityViewComponentProps } from "common/entityTabsConfig";

const CcreVariantsTab = ({ entity }: EntityViewComponentProps) => {
  return (
    <Stack spacing={2}>
      <IntersectingSNPs entity={entity} />
      {entity.assembly === "GRCh38" && <ImmuneGWASLdr accession={entity.entityID} />}
      {entity.assembly === "GRCh38" && <EQTLs entity={entity} />}
    </Stack>
  );
};

export default CcreVariantsTab;
