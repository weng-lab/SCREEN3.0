"use client";
import EntityDetailsLayout from "common/EntityDetails/EntityDetailsLayout";
import { isValidAssembly, isValidEntityType } from "types/globalTypes";
import { use } from "react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ assembly: string; entityType: string; entityID: string }>;
}) {
  
  const { assembly, entityType, entityID } = use(params);

  // Want to ensure that the assembly and entity are valid before passing so that the config object can be safely accessed
  
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
