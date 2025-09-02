"use client";
import EntityDetailsLayout from "common/EntityDetails/EntityDetailsLayout";
import { isValidAssembly } from "types/globalTypes";
import { use } from "react";
import { isValidEntityType } from "common/EntityDetails/entityTabsConfig";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ assembly: string; entityType: string; entityID: string }>;
}) {
  
  const { assembly, entityType, entityID } = use(params);

  if (!isValidAssembly(assembly)) {
    throw new Error(`Unknown assembly: ${assembly}`);
  }

  if (!isValidEntityType(assembly, entityType)) {
    throw new Error(`Unknown entity for ${assembly}: ${entityType}`);
  }

  return (
    <EntityDetailsLayout assembly={assembly} entityType={entityType} entityID={entityID}>
      {children}
    </EntityDetailsLayout>
  );
}
