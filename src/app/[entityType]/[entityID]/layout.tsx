"use client";
import EntityDetailsLayout from "common/EntityDetails/EntityDetailsLayout";
import { isValidGenomicEntity } from "types/globalTypes";
import { use } from "react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ entityType: string; entityID: string }>;
}) {
  const { entityType, entityID } = use(params);
  if (!isValidGenomicEntity(entityType)) {
    throw new Error("Unknown genomic element type: " + entityType);
  }

  return (
    <EntityDetailsLayout entityID={entityID} entityType={entityType}>
      {children}
    </EntityDetailsLayout>
  );
}
