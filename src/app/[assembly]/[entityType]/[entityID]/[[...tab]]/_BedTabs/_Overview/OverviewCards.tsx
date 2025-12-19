"use client";
import { Stack } from "@mui/material";
import { InfoCard } from "common/components/InfoCard";
import { AnyOpenEntity } from "common/OpenEntitiesContext/types";
import { GenomicRange } from "common/types/globalTypes";
import React from "react";

export interface OverviewCardsProps {
  entity: AnyOpenEntity;
  ccres: GenomicRange[];
  loadingCcres: boolean;
  snps: GenomicRange[];
  loadingSnps: boolean;
  genes: GenomicRange[];
  loadingGenes: boolean;
}

const OverviewCards = ({ entity, ccres, loadingCcres, genes, loadingGenes, snps, loadingSnps }: OverviewCardsProps) => {
  const CcreIconPath = "/assets/CcreIcon.svg";
  const GeneIconPath = "/assets/GeneIcon.svg";
  const VariantIconPath = "/assets/VariantIcon.svg";

  return (
    <Stack
      display="flex"
      height="100%"
      justifyContent={entity.assembly === "GRCh38" ? "space-between" : "flex-start"}
      spacing={2}
    >
      <InfoCard icon={CcreIconPath} label="Overlapping cCREs" value={ccres?.length} loading={loadingCcres || !ccres} />
      <InfoCard icon={GeneIconPath} label="Overlapping Genes" value={genes?.length} loading={loadingGenes || !genes} />
      {entity.assembly === "GRCh38" && (
        <InfoCard
          icon={VariantIconPath}
          label="Overlapping Variants"
          value={snps?.length}
          loading={loadingSnps || !snps}
        />
      )}
    </Stack>
  );
};

export default OverviewCards;
