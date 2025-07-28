"use client";
import EntityDetailsLayout from "common/EntityDetails/EntityDetailsLayout";
import { Assembly, isValidGenomicEntity } from "types/globalTypes";
import { use } from "react";
import { PartyMode } from "@mui/icons-material";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ assembly: Assembly; entityType: string; entityID: string }>;
}) {
  
  const { assembly, entityType, entityID } = use(params);
  
  if (!isValidGenomicEntity(entityType)) {
    throw new Error("Unknown genomic element type: " + entityType);
  }

  return (
    <EntityDetailsLayout assembly={assembly} entityID={entityID} entityType={entityType}>
      {children}
    </EntityDetailsLayout>
  );
}
