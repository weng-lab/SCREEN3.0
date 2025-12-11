import { BiosampleActivity } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_cCRE/BiosampleActivity";
import { Conservation } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_Conservation/Conservation";
import { FunctionalCharacterization } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_FunctionalCharacterization/FunctionalCharacterization";
import { AdditionalChromatinSignatures } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_AdditionalChromatinSignatures/AdditionalChromatinSignatures";
import GeneConservation from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_Convservation/GeneConservation";
import CcreLinkedGenes from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_Genes/CcreLinkedGenes";
import CcreVariantsTab from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_Variants/CcreVariantsTab";
import GeneExpression from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_Gene/GeneExpression";
import GeneLinkedCcres from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_cCREs/GeneLinkedCcres";
import EQTLs from "common/components/EQTLTables";
import TranscriptExpression from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_Transcript/TranscriptExpression";
import VariantInfo from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_SnpTabs/_Variant/Variant";
import VariantLinkedCcres from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_SnpTabs/_cCREs/VariantLinkedCcres";
import BiosampleEnrichment from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GwasTabs/_BiosampleEnrichment/BiosampleEnrichment";
import { GWASStudySNPs } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GwasTabs/_Variant/GWASStudySNPs";
import GWASStudyCcres from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GwasTabs/_Ccre/GWASStudyCcres";
import { GWASStudyGenes } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GwasTabs/_Gene/GWASStudyGenes";
import GWASGenomeBrowserView from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GwasTabs/_Browser/gwasgenomebrowserview";
import IntersectingCcres from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_RegionTabs/_cCREs/IntersectingCcres";
import IntersectingGenes from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_RegionTabs/_Genes/IntersectingGenes";
import IntersectingSNPs from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_RegionTabs/_Variants/IntersectingSNPs";
import BedIntersectingCcres from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_BedTabs/_cCREs/BedIntersectingCcres";
import BedIntersectingGenes from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_BedTabs/_Genes/BedIntersectingGenes";
import BedIntersectingSNPs from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_BedTabs/_Variants/BedIntersectingSnps";
import BedOverview from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_BedTabs/_Overview/BedOverview";
import GenomeBrowser from "common/components/GenomeBrowser/GenomeBrowser";
import type { EntityTabsConfig, TabConfig } from "./types";
import { hasNoEnrichmentData } from "common/entityTabsConfig/hasNoEnrichmentData";

const GbIconPath = "/assets/GbIcon.svg";
const CcreIconPath = "/assets/CcreIcon.svg";
const GeneIconPath = "/assets/GeneIcon.svg";
const VariantIconPath = "/assets/VariantIcon.svg";
const BiosampleEnrichmentIconPath = "/assets/BiosampleEnrichmentIcon.svg";
const ConservationIconPath = "/assets/ConservationIcon.svg";
const FunctionalIconPath = "/assets/FunctionalCharacterizationIcon.svg";

/**
 * @todo rewrite these instructions now that types are separated in own file
 */

/**
 * To add a new tab to an existing entity:
 * 1) Add a new object with route, label, icon, and component to render to correct tab list
 *
 * To add a new entity and with new tabs:
 * 1) Add entity to validEntityTypes
 * 2) Create list of tabs for the entity
 * 3) Create type for the routes of that entity, type NewRoutes = ExtractRoutes<typeof NewTabs>
 * 4) Add type to definition of AnyTabRoute
 * 4) Add an entry to the TabList type that adds a new TabConfig<NewEntityRoutes>[]
 * 5) Add the entity and corresponding tabs to the entityTabsConfig object
 * 6) Add the entityType to the "sort" action in OpenEntitiesContext
 * 7) Add a new case in useEntityDisplayname to handle the new entity
 *
 */

export const validEntityTypes = {
  GRCh38: ["ccre", "gene", "variant", "region", "gwas", "bed"],
  mm10: ["ccre", "gene", "region", "bed"],
} as const;

export const humanVariantTabs = [
  {
    route: "",
    label: "Variant",
    iconPath: VariantIconPath,
    component: VariantInfo,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: VariantLinkedCcres,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: EQTLs,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
] as const satisfies TabConfig[];

export const humanGeneTabs = [
  {
    route: "",
    label: "Gene",
    iconPath: GeneIconPath,
    component: GeneExpression,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: GeneLinkedCcres,
  },
  {
    route: "variants",
    label: "Variants",
    iconPath: VariantIconPath,
    component: EQTLs,
  },
  {
    route: "conservation",
    label: "Conservation",
    iconPath: ConservationIconPath,
    component: GeneConservation,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
  {
    route: "transcript-expression",
    label: "Transcript Expression",
    component: TranscriptExpression,
  },
] as const satisfies TabConfig[];

export const humanGwasTabs = [
  {
    route: "biosample_enrichment",
    label: "Biosample Enrichment",
    iconPath: BiosampleEnrichmentIconPath,
    component: BiosampleEnrichment,
   // getIsDisabled: hasNoEnrichmentData,
  },
  {
    route: "variants",
    label: "Variants",
    iconPath: VariantIconPath,
    component: GWASStudySNPs,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: GWASStudyCcres,
  },
  { route: "genes", label: "Genes", iconPath: GeneIconPath, component: GWASStudyGenes },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GWASGenomeBrowserView },
] as const satisfies TabConfig[];

export const humanCcreTabs = [
  {
    route: "",
    label: "cCRE",
    iconPath: CcreIconPath,
    component: BiosampleActivity,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: CcreLinkedGenes,
  },
  {
    route: "variants",
    label: "Variants",
    iconPath: VariantIconPath,
    component: CcreVariantsTab,
  },
  {
    route: "conservation",
    label: "Conservation",
    iconPath: ConservationIconPath,
    component: Conservation,
  },
  {
    route: "functional-characterization",
    label: "Functional Characterization",
    iconPath: FunctionalIconPath,
    component: FunctionalCharacterization,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
  {
    route: "additional-chromatin-signatures",
    label: "Additional Chromatin Signatures",
    component: AdditionalChromatinSignatures,
  },
] as const satisfies TabConfig[];

export const humanRegionTabs = [
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: IntersectingCcres,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: IntersectingGenes,
  },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: IntersectingSNPs,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
] as const satisfies TabConfig[];

export const humanBedTabs = [
  {
    route: "overview",
    label: "Overview",
    iconPath: CcreIconPath,
    component: BedOverview,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: BedIntersectingCcres,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: BedIntersectingGenes,
  },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: BedIntersectingSNPs,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
] as const satisfies TabConfig[];

export const mouseGeneTabs = [
  {
    route: "",
    label: "Gene",
    iconPath: GeneIconPath,
    component: GeneExpression,
  },
  { route: "ccres", label: "cCREs", iconPath: CcreIconPath, component: GeneLinkedCcres },
  {
    route: "conservation",
    label: "Conservation",
    iconPath: ConservationIconPath,
    component: GeneConservation,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
] as const satisfies TabConfig[];

export const mouseCcreTabs = [
  {
    route: "",
    label: "cCRE",
    iconPath: CcreIconPath,
    component: BiosampleActivity,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: CcreLinkedGenes,
  },
  {
    route: "conservation",
    label: "Conservation",
    iconPath: ConservationIconPath,
    component: Conservation,
  },
  {
    route: "functional-characterization",
    label: "Functional Characterization",
    iconPath: FunctionalIconPath,
    component: FunctionalCharacterization,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
] as const satisfies TabConfig[];

export const mouseRegionTabs = [
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: IntersectingCcres,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: IntersectingGenes,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
] as const satisfies TabConfig[];

export const mouseBedTabs = [
  {
    route: "overview",
    label: "Overview",
    iconPath: CcreIconPath,
    component: BedOverview,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: BedIntersectingCcres,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: BedIntersectingGenes,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    component: GenomeBrowser,
  },
] as const satisfies TabConfig[];

export const entityTabsConfig: EntityTabsConfig = {
  GRCh38: {
    variant: humanVariantTabs,
    gene: humanGeneTabs,
    ccre: humanCcreTabs,
    region: humanRegionTabs,
    gwas: humanGwasTabs,
    bed: humanBedTabs,
  },
  mm10: {
    gene: mouseGeneTabs,
    ccre: mouseCcreTabs,
    region: mouseRegionTabs,
    bed: mouseBedTabs,
  },
} as const;
