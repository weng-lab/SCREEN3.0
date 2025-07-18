'use client'
import EntityDetailsLayout from "common/EntityDetails/EntityDetailsLayout"
import { isValidGenomicEntity } from "types/globalTypes"

export default function Layout({
  children,
  params: { entityType, entityID },
}: {
  children: React.ReactNode,
  params: { entityType: string, entityID: string } 
}) {

  if (!isValidGenomicEntity(entityType)) {
    throw new Error("Unknown genomic element type: " + entityType)
  }

  return (
    <EntityDetailsLayout
      entityID={entityID}
      entityType={entityType}
    >
      {children}
    </EntityDetailsLayout>
  )
}