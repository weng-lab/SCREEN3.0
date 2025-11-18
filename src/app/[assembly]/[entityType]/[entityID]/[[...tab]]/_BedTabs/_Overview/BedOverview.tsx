"use client";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { EntityViewComponentProps } from "common/entityTabsConfig/types";
import { decodeRegions } from "common/utility";
import { useMemo } from "react";
import { GenomicRange } from "common/types/generated/graphql";

const BedOverview = ({ entity }: EntityViewComponentProps) => {

  const regions: GenomicRange[] = useMemo(() => {
    if (typeof window === "undefined") return null;
    const encoded = sessionStorage.getItem(entity.entityID);
    return decodeRegions(encoded);
  }, [entity.entityID]);

  // const columns: GridColDef<(typeof dataCcres)[number]>[] = [];

  return (
    <Stack spacing={1}>
      <Typography>Overview of file upload</Typography>
    </Stack>
  );
};

export default BedOverview;
