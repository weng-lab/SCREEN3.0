"use client";
import EntityDetailsLayout from "common/components/EntityDetails/EntityDetailsLayout";
import { isValidAssembly } from "common/types/globalTypes";
import { use } from "react";
import { isValidEntityType } from "common/entityTabsConfig";
import { notFound } from "next/navigation";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ assembly: string; entityType: string; entityID: string }>;
}) {
  const { assembly, entityType, entityID } = use(params);

  if (!isValidAssembly(assembly)) {
    notFound();
  }

  if (!isValidEntityType(assembly, entityType)) {
    notFound();
  }

  return (
    <EntityDetailsLayout assembly={assembly} entityType={entityType} entityID={entityID}>
      {children}
    </EntityDetailsLayout>
  );
}
