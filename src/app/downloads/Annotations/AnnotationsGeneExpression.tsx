import React from "react";
import Config from "common/config.json";
import { DownloadButton, DownloadButtonProps } from "./DownloadButton";
import DownloadContentLayout from "./DownloadContentLayout";
import { Assembly } from "./Annotations";

const classDownloads: {
  GRCh38: DownloadButtonProps[];
  mm10: DownloadButtonProps[];
} = {
  GRCh38: [
    {
      href: Config.Downloads.HumanGeneExpression,
      label: "Gene Expression TPM Matrix",
      fileSize: "21.8 MB",
      bordercolor: "gray",
    },
  ],
  mm10: [
    {
      href: Config.Downloads.MouseGeneExpression,
      label: "Gene Expression TPM Matrix",
      fileSize: "9 MB",
      bordercolor: "gray",
    },
  ],
};

interface AnnotationsGeneExpression {
  assembly: Assembly;
}

const AnnotationsGeneExpression: React.FC<AnnotationsGeneExpression> = ({ assembly }) => {
  return (
    <DownloadContentLayout title="Gene Expression">
      {classDownloads[assembly].map((item) => (
        <DownloadButton key={item.label} {...item} assembly={assembly} />
      ))}
    </DownloadContentLayout>
  );
};

export default AnnotationsGeneExpression;
