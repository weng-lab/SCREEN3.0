"use client";
import { CircularProgress, Typography } from "@mui/material";
import GenomeBrowserView from "common/gbview/genomebrowserview";
import { useEntityMetadata, useEntityMetadataReturn } from "common/hooks/useEntityMetadata";
import {
  EntityType,
  isValidGeneTab,
  isValidCcreTab,
  isValidVariantTab,
  isValidTab,
  isValidRegionTab,
  Assembly,
} from "types/globalTypes";
import GeneExpression from "./_GeneTabs/_Gene/GeneExpression";
import CcreLinkedGenes from "./_CcreTabs/_Genes/CcreLinkedGenes";
import IcreVariantsTab from "./_CcreTabs/_Variants/IcreVariantsTab";
import GeneLinkedIcres from "./_GeneTabs/_iCREs/GeneLinkedIcres";
import VariantInfo from "./_SnpTabs/_Variant/Variant";
import IntersectingGenes from "common/components/IntersectingGenes";
import IntersectingSNPs from "common/components/IntersectingSNPs";
import { parseGenomicRangeString } from "common/utility";
import { use } from "react";

export default function DetailsPage({
  params,
}: {
  /**
   * Should be able to safely type this as GenomicElementType instead of string
   * since the layout wrapping this ensures the type is fulfilled
   */
  params: Promise<{ assembly: Assembly; entityType: EntityType; entityID: string; tab: string }>;
}) {
  const { assembly, entityType, entityID, tab: tabString } = use(params);
  let tab = tabString;
  /**
   * Since [[...tab]] is an optional catch-all route, tabs is an array.
   * tab is undefined when hitting /elementType/elementID (default tab's route).
   * "" is defined as valid shared route in the type SharedRoute, so change undefined to ""
   */
  if (tab === undefined) {
    tab = "";
  } else {
    tab = tab[0];
  }
  /**
   * Configure valid tabs in globalTypes.ts
   */
  if (!isValidTab(tab)) {
    throw new Error("Unknown tab: " + tab);
  }

  const { data, loading, error } = useEntityMetadata({ assembly, entityType, entityID });

  if (loading) {
    return <CircularProgress />;
  }

  if (!data?.coordinates) {
    return <Typography>Issue fetching data on {entityID}</Typography>;
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  //Handle shared tabs
  if (tab === "browser") {
    return (
      <GenomeBrowserView
        coordinates={data.coordinates}
        name={
          data.__typename === "Gene"
            ? data.name
            : data.__typename === "CCRE"
            ? data.accession
            : data.__typename === "SNP"
            ? data.id
            : null
        }
        type={entityType}
      />
    );
  }

  switch (entityType) {
    case "variant": {
      if (!isValidVariantTab(tab)) {
        throw new Error("Unknown variant details tab: " + tab);
      }

      const variantData = { data, loading, error } as useEntityMetadataReturn<"variant">;

      switch (tab) {
        case "":
          return <VariantInfo snpid={variantData.data.id} />;
        case "ccres":
          return <p>cCREs intersecting this variant page</p>;
        case "genes":
          return <p>This page should probably have eQTL data</p>;
      }
    }

    case "gene": {
      if (!isValidGeneTab(tab)) {
        throw new Error("Unknown gene details tab: " + tab);
      }

      const geneData = { data, loading, error } as useEntityMetadataReturn<"gene">;

      switch (tab) {
        case "":
          return <GeneExpression geneData={geneData} />;
        case "ccres":
          return <GeneLinkedIcres geneData={geneData} />;
        case "variants":
          return <p>This page should probably have eQTL data</p>;
      }
    }

    case "ccre": {
      if (!isValidCcreTab(tab)) {
        throw new Error("Unknown iCRE details tab: " + tab);
      }

      const CcreData = { data, loading, error } as useEntityMetadataReturn<"ccre">;

      switch (tab) {
        case "":
          return <p>This should have biosample specific z-scores</p>;
        case "genes":
          return <CcreLinkedGenes accession={CcreData.data.accession} coordinates={CcreData.data.coordinates} />;
        case "variants":
          return <IcreVariantsTab CcreData={CcreData} />;
      }
    }

    case "region": {
      if (!isValidRegionTab(tab)) {
        throw new Error("Unknown region details tab: " + tab);
      }

      const region = parseGenomicRangeString(entityID);

      switch (tab) {
        case "ccres":
          return <p>This should have the intersecting cCREs table</p>;
        case "genes":
          return <IntersectingGenes region={region} />;
        case "variants":
          return <IntersectingSNPs region={region} />;
      }
    }
  }
}
