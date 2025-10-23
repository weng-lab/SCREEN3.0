import { Stack } from "@mui/material";
import ComputationalLinkedCcres from "./ComputationalLinkedCcres";
import DistanceLinkedCcres from "./DistanceLinkedCcres";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { Assembly } from "common/types/globalTypes";

const GeneLinkedIcres = ({
  geneData,
  assembly,
}: {
  geneData: UseGeneDataReturn<{ name: string; assembly: Assembly }>;
  assembly: Assembly;
}) => {
  return (
    <Stack spacing={2}>
      <DistanceLinkedCcres geneData={geneData} assembly={assembly} />
      {assembly === "GRCh38" && <ComputationalLinkedCcres geneData={geneData} />}
    </Stack>
  );
};

export default GeneLinkedIcres;
