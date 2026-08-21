import { EntityHeaderLayout } from "./EntityHeaderLayout";

export type BedUploadHeaderProps = {
  fileName: string;
};

const BedUploadHeader = ({ fileName }: BedUploadHeaderProps) => {
  return <EntityHeaderLayout label="Bed Upload" title={fileName} />;
};

export default BedUploadHeader;
