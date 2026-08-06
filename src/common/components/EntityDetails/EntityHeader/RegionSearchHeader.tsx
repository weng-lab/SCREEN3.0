import { formatGenomicRange } from "common/utils";
import { Assembly, GenomicRange } from "common/types/globalTypes";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { UcscBrowserButton } from "./UcscBrowserButton";

export type RegionSearchHeaderProps = {
  region: GenomicRange;
  assembly: Assembly;
};

const RegionSearchHeader = ({ assembly, region }: RegionSearchHeaderProps) => {
  return (
    <EntityHeaderLayout
      label="Region Search"
      title={formatGenomicRange(region)}
      actions={<UcscBrowserButton assembly={assembly} coordinates={region} entityType={"region"} />}
    />
  );
};

export default RegionSearchHeader;
