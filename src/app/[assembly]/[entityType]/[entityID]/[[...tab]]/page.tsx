"use client";
import { CircularProgress, Typography } from "@mui/material";
import GenomeBrowserView from "common/components/gbview/GenomeBrowserView";
import { useEntityMetadata, useEntityMetadataReturn } from "common/hooks/useEntityMetadata";
import { isValidAssembly } from "common/types/globalTypes";
import { getComponentForEntity, isValidEntityType, isValidRouteForEntity } from "common/entityTabsConfig";
import GeneExpression from "./_GeneTabs/_Gene/GeneExpression";
import CcreLinkedGenes from "./_CcreTabs/_Genes/CcreLinkedGenes";
import CcreVariantsTab from "./_CcreTabs/_Variants/CcreVariantsTab";
import GeneLinkedCcres from "./_GeneTabs/_cCREs/GeneLinkedCcres";
import VariantInfo from "./_SnpTabs/_Variant/Variant";
import IntersectingGenes from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_RegionTabs/_Genes/IntersectingGenes";
import IntersectingSNPs from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_RegionTabs/_Variants/IntersectingSNPs";
import { parseGenomicRangeString } from "common/utility";
import { use } from "react";
import IntersectingCcres from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_RegionTabs/_cCREs/IntersectingCcres";
import EQTLs from "common/components/EQTLTables";
import CcreGWASStudySNPs from "./_GwasTabs/_Ccre/GWASStudyCcres";
import { GWASStudyGenes } from "./_GwasTabs/_Gene/GWASStudyGenes";
import { GWASStudySNPs } from "./_GwasTabs/_Variant/GWASStudySNPs";
import BiosampleEnrichment from "./_GwasTabs/_BiosampleEnrichment/BiosampleEnrichment";
import {
  CandidateOpenEntity,
  isValidOpenEntity,
} from "common/components/EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";
import GWASGenomeBrowserView from "./_GwasTabs/_Browser/gwasgenomebrowserview";
import VariantLinkedCcres from "./_SnpTabs/_cCREs/VariantLinkedCcres";
import TranscriptExpression from "./_GeneTabs/_Transcript/TranscriptExpression";

export default function DetailsPage({
  params,
}: {
  params: Promise<{ assembly: string; entityType: string; entityID: string; tab: string }>;
}) {
  const { assembly, entityType, entityID, tab: tabString } = use(params);

  if (!isValidAssembly(assembly)) {
    throw new Error(`Unknown assembly: ${assembly}`);
  }

  if (!isValidEntityType(assembly, entityType)) {
    throw new Error(`Unknown entity for ${assembly}: ${entityType}`);
  }

  let tab = tabString;

  /**
   * Since [[...tab]] is an optional catch-all route, tabs is an array.
   * tab is undefined when hitting /entityType/entityID (default tab's route).
   * "" is defined as valid shared route in the type SharedRoute, so change undefined to ""
   */
  if (tab === undefined) {
    tab = "";
  } else {
    tab = tab[0];
  }

  if (!isValidRouteForEntity(assembly, entityType, tab)) {
    throw new Error(`Unknown tab ${tab} for entity type ${entityType}`);
  }

  const entity: CandidateOpenEntity = { assembly, entityID, entityType, tab };

  if (!isValidOpenEntity(entity)) {
    throw new Error(`Incorrect entity configuration: ` + JSON.stringify(entity));
  }

  const { data, loading, error } = useEntityMetadata({ assembly, entityType, entityID: decodeURIComponent(entityID) });

  if (loading) {
    return <CircularProgress />;
  }

  if (data && data.__typename !== "SCREENSearchResult" && data.__typename !== "GwasStudies" && !data?.coordinates) {
    return <Typography>Issue fetching data on {entityID}</Typography>;
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  // Find component we need to render for this route
  const ComponentToRender = getComponentForEntity(entity);
  // Once each component is refactored to independently fetch it's own data we can simply do the following:
  // return <ComponentToRender entity={entity} />

  if (tab === "browser" && data.__typename !== "GwasStudies") {
    return (
      <GenomeBrowserView
        coordinates={
          data.__typename === "SCREENSearchResult"
            ? { chromosome: data.chrom, start: data.start, end: data.start + data.len }
            : data.coordinates
        }
        name={
          data.__typename === "Gene"
            ? data.name
            : data.__typename === "SCREENSearchResult"
              ? data.info.accession
              : data.__typename === "SNP"
                ? data.id
                : null
        }
        type={entityType}
        assembly={assembly}
      />
    );
  }

  /**
   * For now we are keeping this big switch block to not have to restructure all of the files right now during this refactor.
   * Eventually we can vastly simplify this, and remove data fetching from this file and let the leaf components do their own fetching.
   */

  switch (entityType) {
    case "variant": {
      const variantData = { data, loading, error } as useEntityMetadataReturn<"variant">;

      switch (tab) {
        case "":
          return assembly === "GRCh38" ? <VariantInfo snpid={variantData.data.id} /> : <></>;
        case "ccres":
          return (
            <VariantLinkedCcres
              variantData={{
                ...variantData,
                data: [variantData.data],
              }}
            />
          );
        case "genes":
          return <EQTLs entity={entity} />;
      }
      break;
    }

    case "gene": {
      switch (tab) {
        case "conservation":
          return <ComponentToRender entity={entity} />;
        case "":
          //Gene data is used here to extract the gene ID (which is not kept as part of the entity...) can replace with useGeneData
          return <GeneExpression entity={entity} />;
        case "ccres":
          return <GeneLinkedCcres entity={entity} />;
        case "variants":
          return <EQTLs entity={entity} />;
        case "transcript-expression":
          return <TranscriptExpression entity={entity} />;
      }
      break;
    }

    case "ccre": {
      switch (tab) {
        case "":
        case "conservation":
        case "functional-characterization":
        case "additional-chromatin-signatures":
        case "genes":
        case "variants":
          return <ComponentToRender entity={entity} />;
      }
      break;
    }

    case "gwas": {
      const gwasData = { data, loading, error } as useEntityMetadataReturn<"gwas">;

      switch (tab) {
        case "ccres":
          return (
            <CcreGWASStudySNPs
              study_name={gwasData.data.study}
              totalldblocks={data.__typename !== "GwasStudies" ? 0 : data?.totalldblocks || 0}
            />
          );
        case "genes":
          return <GWASStudyGenes study_name={gwasData.data.study} />;
        case "variants":
          return <GWASStudySNPs study_name={gwasData.data.study} />;
        case "biosample_enrichment":
          return <BiosampleEnrichment study_name={gwasData.data.study} />;
        case "browser":
          return <GWASGenomeBrowserView study_name={gwasData.data.study} />;
      }
      break;
    }

    case "region": {
      const region = parseGenomicRangeString(entityID);

      switch (tab) {
        case "ccres":
          return <IntersectingCcres assembly={assembly} region={region} />;
        case "genes":
          return <IntersectingGenes assembly={assembly} region={region} />;
        case "variants":
          //TODO: Add Mouse SNPs
          return assembly === "mm10" ? (
            <p>This page should have intersecting mouse SNPs</p>
          ) : (
            <IntersectingSNPs region={region} />
          );
      }
    }
  }
}
