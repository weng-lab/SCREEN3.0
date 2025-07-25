import { Stack } from "@mui/material";
import ComputationalLinkedCcres from "./ComputationalLinkedCcres";
import DistanceLinkedCcres from "./DistanceLinkedCcres";
import IcreCcreSwitch from "./IcreCcreSwitch";
import { useState } from "react";
import { UseGeneDataReturn } from "common/hooks/useGeneData";

const GeneLinkedIcres = ({geneData}: {geneData: UseGeneDataReturn<{ name: string }>}) => {
  const [allcCREs, setAllcCREs] = useState<boolean>(false)

  const toggleOnlyICREs = () => {
    setAllcCREs(!allcCREs)
  }

  return (
    <Stack spacing={2} alignItems={"center"}>
      <IcreCcreSwitch checked={allcCREs} onChange={toggleOnlyICREs} />
      <DistanceLinkedCcres geneData={geneData} allcCREs={allcCREs} />
      <ComputationalLinkedCcres geneData={geneData} allcCREs={allcCREs} />
    </Stack>
  );
};

export default GeneLinkedIcres;
