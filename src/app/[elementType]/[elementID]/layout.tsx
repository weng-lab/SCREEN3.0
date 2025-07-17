'use client'
import ElementDetailsLayout from "common/ElementDetails/ElementDetailsLayout"
import { isValidGenomicElement } from "types/globalTypes"
import { useContext, useEffect } from "react";
import { OpenElementsContext } from "common/OpenElementsContext";

export default function IcreDetailsLayout({
  children,
  params: { elementType, elementID },
}: {
  children: React.ReactNode,
  params: { elementType: string, elementID: string } 
}) {

  if (!isValidGenomicElement(elementType)) {
    throw new Error("Unknown genomic element type: " + elementType)
  }

  return (
    <ElementDetailsLayout
      elementID={elementID}
      elementType={elementType}
    >
      {children}
    </ElementDetailsLayout>
  )
}