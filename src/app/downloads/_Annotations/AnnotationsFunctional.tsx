import Config from "common/config.json";
import { DownloadButton, DownloadButtonProps } from "./DownloadButton";
import DownloadContentLayout from "./DownloadContentLayout";
import { Assembly } from "common/types/globalTypes";

const classDownloads: Record<Assembly, DownloadButtonProps[]> = {
  GRCh38: [
    {
      href: Config.Downloads.HumanCAPRA,
      label: "STARR seq Scores via CAPRA (whole genome)",
      fileSize: "1.79 GB (unzipped)",
      bordercolor: "gray",
    },
    {
      href: Config.Downloads.HumanMPRA,
      label: "MPRA",
      fileSize: "360.3 MB (unzipped)",
      bordercolor: "gray",
    },
    {
      href: Config.Downloads.HumanCRISPR,
      label: "CRISPR Perturbation Data",
      fileSize: "35.7 MB (unzipped)",
      bordercolor: "gray",
    },
    {
      href: Config.Downloads.HumanVISTA,
      label: "VISTA Enhancers",
      fileSize: "123 KB",
      bordercolor: "gray",
    },
  ],
  mm10: [
    {
      href: Config.Downloads.MouseVISTA,
      label: "VISTA Enhancers",
      fileSize: "90 KB",
      bordercolor: "gray",
    },
  ],
};

function AnnotationsFunctional({ assembly }: { assembly: Assembly }) {
  return (
    <DownloadContentLayout title="Functional Characterization">
      {classDownloads[assembly].map((item) => (
        <DownloadButton key={item.label} {...item} assembly={assembly} />
      ))}
    </DownloadContentLayout>
  );
}

export default AnnotationsFunctional;
