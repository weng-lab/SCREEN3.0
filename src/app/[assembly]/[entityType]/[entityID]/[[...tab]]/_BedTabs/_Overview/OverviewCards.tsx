"use client";
import { Stack } from "@mui/material";
import { InfoCard } from "common/components/InfoCard";
import { useCcreData } from "common/hooks/useCcreData";
import { useSnpData } from "common/hooks/useSnpData";
import { AnyOpenEntity } from "common/OpenEntitiesContext/types";
import { GenomicRange } from "common/types/globalTypes";
import React from "react";

export interface OverviewCardsProps {
  entity: AnyOpenEntity;
  regions: GenomicRange[];
}

const OverviewCards = ({ entity, regions }: OverviewCardsProps) => {
  const CcreIconPath = "/assets/CcreIcon.svg";
  const GeneIconPath = "/assets/GeneIcon.svg";
  const VariantIconPath = "/assets/VariantIcon.svg";

  const { data: dataCcres, loading: loadingCcres } = useCcreData({
    coordinates: regions,
    assembly: entity.assembly,
    nearbygeneslimit: 1,
    skip: regions === null,
  });

  const { data: dataSnps, loading: loadingSnps } = useSnpData({
    coordinates: regions,
    assembly: "GRCh38",
    skip: regions === null || entity.assembly === "mm10",
  });

  return (
    <Stack
      display="flex"
      height="100%"
      justifyContent={entity.assembly === "GRCh38" ? "space-between" : "flex-start"}
      spacing={2}
    >
      <InfoCard
        icon={CcreIconPath}
        label="Overlapping cCREs"
        value={dataCcres?.length}
        path={`/${entity.assembly}/${entity.entityType}/${entity.entityID}/ccres`}
        loading={loadingCcres || !dataCcres}
      />
      <InfoCard
        icon={GeneIconPath}
        label="Overlapping Genes"
        value={7}
        path={`/${entity.assembly}/${entity.entityType}/${entity.entityID}/genes`}
        loading={false}
      />
      {entity.assembly === "GRCh38" && (
        <InfoCard
          icon={VariantIconPath}
          label="Overlapping Variants"
          value={dataSnps?.length}
          path={`/${entity.assembly}/${entity.entityType}/${entity.entityID}/variants`}
          loading={loadingSnps || !dataSnps}
        />
      )}
    </Stack>
  );
};

export default OverviewCards;
