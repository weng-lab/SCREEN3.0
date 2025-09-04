"use client";
import { CircularProgress, Typography } from "@mui/material";
import GenomeBrowserView from "common/gbview/genomebrowserview";
import { useEntityMetadata, useEntityMetadataReturn } from "common/hooks/useEntityMetadata";
import { isValidAssembly } from "types/globalTypes";
import { entityTabsConfig, isValidEntityType, isValidRouteForEntity } from "common/EntityDetails/entityTabsConfig";
import GeneExpression from "./_GeneTabs/_Gene/GeneExpression";
import CcreLinkedGenes from "./_CcreTabs/_Genes/CcreLinkedGenes";
import CcreVariantsTab from "./_CcreTabs/_Variants/CcreVariantsTab";
import GeneLinkedIcres from "./_GeneTabs/_cCREs/GeneLinkedIcres";
import VariantInfo from "./_SnpTabs/_Variant/Variant";
import IntersectingGenes from "common/components/IntersectingGenes";
import IntersectingSNPs from "common/components/IntersectingSNPs";
import { parseGenomicRangeString } from "common/utility";
import { use } from "react";
import IntersectingCcres from "common/components/IntersectingCcres";
import EQTLs from "common/components/EQTLTables";
import { AnyOpenEntity } from "common/EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";

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

  const { data, loading, error } = useEntityMetadata({ assembly, entityType, entityID });

  if (loading) {
    return <CircularProgress />;
  }

  if (data.__typename !== "SCREENSearchResult" && !data?.coordinates) {
    return <Typography>Issue fetching data on {entityID}</Typography>;
  }

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  const entity: AnyOpenEntity = {assembly, entityID, entityType, tab }

  // Find component we need to render for this route
  const ComponentToRender = entityTabsConfig[assembly][entityType].find(x => x.route === tab).component
  // Once each component is refactored to independently fetch it's own data we can simply do the following:
  // return <ComponentToRender entity={entity} />

  if (tab === "browser") {
    return (
      <GenomeBrowserView
        coordinates={ data.__typename === "SCREENSearchResult" ?  {chromosome: data.chrom, start: data.start, end: data.start + data.len} : data.coordinates}
        name={data.__typename === "Gene" ? data.name : data.__typename === "SCREENSearchResult" ? data.info.accession : data.__typename === "SNP" ? data.id : null}
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
          return  assembly==="GRCh38" ? <VariantInfo snpid={variantData.data.id} /> : <></>;
        case "ccres":
          return <p>cCREs intersecting this variant page</p>;
        case "genes":
          return <EQTLs data={variantData.data} entityType="variant" assembly={assembly} />;
      }
      break;
    }

    case "gene": {
      const geneData = { data, loading, error } as useEntityMetadataReturn<"gene">;

      switch (tab) {
        case "":
          return <GeneExpression geneData={geneData} assembly={assembly} />;
        case "ccres":
          return assembly==="GRCh38" ? <GeneLinkedIcres geneData={geneData} /> : <>Linked mouse ccREs </>;
        case "variants":
          return <EQTLs data={geneData.data} entityType="gene" assembly={assembly}/>;
      }
      break;
    }

    case "ccre": {
      const CcreData = { data, loading, error } as useEntityMetadataReturn<"ccre">;

      switch (tab) {
        case "":
          return <ComponentToRender entity={entity} />;
        case "genes":
          return assembly==="GRCh38" ? <CcreLinkedGenes accession={CcreData.data.info.accession} coordinates={{chromosome: CcreData.data.chrom, start: CcreData.data.start, end: CcreData.data.start + CcreData.data.len}} /> : <>Linked Genes for Mouse cCREs</>;
        case "variants":
          return assembly==="GRCh38" ? <CcreVariantsTab CcreData={CcreData} assembly={assembly}/>: <p> Variants for mouse cCREs </p>;
      }
      break;
    }


    case "region": {
      const region = parseGenomicRangeString(entityID)

      switch (tab) {
        case "ccres":
          return <IntersectingCcres assembly={assembly} region={region} />;          
        case "genes":
          return <IntersectingGenes assembly={assembly} region={region} />;
        case "variants":
          //TODO: Add Mouse SNPs
          return assembly === "mm10" ? <p>This page should have intersecting mouse SNPs</p> :  <IntersectingSNPs region={region} />;
      }
    }
  }
}