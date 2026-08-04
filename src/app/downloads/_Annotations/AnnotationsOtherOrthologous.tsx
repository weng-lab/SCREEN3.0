import React from "react";
import { DownloadButton, DownloadButtonProps } from "./DownloadButton";
import Config from "common/config.json";
import DownloadContentLayout from "./DownloadContentLayout";

const orthologousDownloads: DownloadButtonProps[] = [
  {
    href: Config.Downloads.HumanMouseOrtholog,
    label: "Human/Mouse Orthologous cCREs (.tsv)",
    fileSize: "13.3 MB",
    bordercolor: "gray",
  },
];

const AnnotationsOtherOrthologous: React.FC = () => {
  return (
    <DownloadContentLayout
      title="Orthologous cCREs"
      description="Using UCSC's liftOver tool with a minimum match score of 0.5, we lifted GRCh38 cCREs to the mm10 genome (GRCh38-mm10 cCREs) and mm10 cCREs to the GRCh38 genome (mm10- GRCh38 cCREs) (Extended Data Fig. 2c). For the cCREs that mapped, we intersected them with cCREs in the other species (i.e., GRCh38-mm10 cCREs with mm10 cCREs and mm10-GRCh38 cCREs with GRCh38 cCREs) using bedtools intersect. Those cCRE pairs that mapped to the other genome and intersected reciprocally (in both from human to mouse and from mouse to human directions) are considered orthologous."
    >
      {orthologousDownloads.map((item) => (
        <DownloadButton key={item.label} {...item} assembly="GRCh38-mm10" />
      ))}
    </DownloadContentLayout>
  );
};

export default AnnotationsOtherOrthologous;
