"use client";
import { Stack } from "@mui/material";
import ComputationalLinkedCcres from "./ComputationalLinkedCcres";
import DistanceLinkedCcres from "./DistanceLinkedCcres";
import PromoterCcres from "./PromoterCcres";
import { useGeneData } from "common/hooks/data/gene";
import { EntityViewComponentProps } from "common/entityTabsConfig";

const GeneLinkedIcres = ({ entity }: EntityViewComponentProps) => {
  const geneData = useGeneData({ name: entity.entityID, assembly: entity.assembly });

  return (
    <Stack spacing={2}>
      {entity.assembly === "GRCh38" && <PromoterCcres geneData={geneData} />}      
      <DistanceLinkedCcres geneData={geneData} assembly={entity.assembly} />
      {entity.assembly === "GRCh38" && <ComputationalLinkedCcres geneData={geneData} />}
    </Stack>
  );
};

export default GeneLinkedIcres;
