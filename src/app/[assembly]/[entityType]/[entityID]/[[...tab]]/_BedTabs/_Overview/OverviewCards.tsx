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
  selectedTotals?: { ccres: number; genes: number; snps: number };
}

const OverviewCards = ({
  entity,
  ccres,
  loadingCcres,
  genes,
  loadingGenes,
  snps,
  loadingSnps,
  selectedTotals,
}: OverviewCardsProps) => {
  const CcreIconPath = "/assets/CcreIcon.svg";
  const GeneIconPath = "/assets/GeneIcon.svg";
  const VariantIconPath = "/assets/VariantIcon.svg";

  const ccresCount = selectedTotals?.ccres ?? ccres?.length ?? 0;
  const geneCount = selectedTotals?.genes ?? genes?.length ?? 0;
  const snpCount = selectedTotals?.snps ?? snps?.length ?? 0;

  return (
    <Stack
      display="flex"
      height="100%"
      justifyContent={entity.assembly === "GRCh38" ? "space-between" : "flex-start"}
      spacing={2}
    >
      <InfoCard icon={CcreIconPath} label="Overlapping cCREs" value={ccresCount} loading={loadingCcres || !ccres} />
      <InfoCard icon={GeneIconPath} label="Overlapping Genes" value={geneCount} loading={loadingGenes || !genes} />
      {entity.assembly === "GRCh38" && (
        <InfoCard icon={VariantIconPath} label="Overlapping Variants" value={snpCount} loading={loadingSnps || !snps} />
      )}
    </Stack>
  );
};

export default OverviewCards;
