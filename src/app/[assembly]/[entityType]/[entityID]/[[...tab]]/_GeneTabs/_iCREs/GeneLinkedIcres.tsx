import { Stack } from "@mui/material";
import ComputationalLinkedCcres from "./ComputationalLinkedCcres";
import DistanceLinkedCcres from "./DistanceLinkedCcres";
import IcreCcreSwitch from "./IcreCcreSwitch";
import { useState } from "react";
import { UseGeneDataReturn } from "common/hooks/useGeneData";

const GeneLinkedIcres = ({geneData}: {geneData: UseGeneDataReturn<{ name: string }>}) => {
 
  return (
    <Stack spacing={2} alignItems={"center"}>
      <DistanceLinkedCcres geneData={geneData} />
      <ComputationalLinkedCcres geneData={geneData}/>
    </Stack>
  );
};

export default GeneLinkedIcres;
