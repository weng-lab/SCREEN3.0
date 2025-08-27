import { Assembly, EntityType } from "types/globalTypes";
import type { ReactElement } from "react";
import VariantInfo from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_SnpTabs/_Variant/Variant";
import EQTLs from "common/components/EQTLTables";
import GenomeBrowserView from "common/gbview/genomebrowserview";
import GeneExpression from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_Gene/GeneExpression";
import GeneLinkedIcres from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_cCREs/GeneLinkedIcres";
import CcreLinkedGenes from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_Genes/CcreLinkedGenes";
import CcreVariantsTab from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_Variants/CcreVariantsTab";
import IntersectingCcres from "common/components/IntersectingCcres";
import IntersectingGenes from "common/components/IntersectingGenes";
import IntersectingSNPs from "common/components/IntersectingSNPs";

const GbIconPath = "/assets/GbIcon.svg";
const CcreIconPath = "/assets/CcreIcon.svg";
const GeneIconPath = "/assets/GeneIcon.svg";
const VariantIconPath = "/assets/VariantIcon.svg";
const ConservationIconPath = "/assets/ConservationIcon.svg";
const FunctionalIconPath = "/assets/FunctionalCharacterizationIcon.svg";

/**
 * I feel like a route encoding is unnecessary, we just map in alphabetical order?
 */

type TabConfig<R extends string = string> = {
  route: R;
  label: string;
  /**
   * If no icon passed, will place tab in "more" section
   */
  iconPath?: string;
  /**
   * The component to render for that tab view
   */
  component: ({ args }: any) => ReactElement;
};

type EntityTabsConfig = {
  [A in Assembly]: {
    [E in EntityType<A>]: readonly (
      | TabConfig<HumanVariantRoutes>
      | TabConfig<HumanGeneRoutes>
      | TabConfig<HumanCcreRoutes>
      | TabConfig<HumanRegionRoutes>
      | TabConfig<MouseVariantRoutes>
      | TabConfig<MouseGeneRoutes>
      | TabConfig<MouseCcreRoutes>
      | TabConfig<MouseRegionRoutes>
    )[];
  };
};

/**
 * Type definitions for valid routes
 */
type ExtractRoutes<T extends readonly { route: string }[]> = T[number]['route'];

// Individual route types for each entity
type HumanVariantRoutes = ExtractRoutes<typeof humanVariantTabs>;
type HumanGeneRoutes = ExtractRoutes<typeof humanGeneTabs>;
type HumanCcreRoutes = ExtractRoutes<typeof humanCcreTabs>;
type HumanRegionRoutes = ExtractRoutes<typeof humanRegionTabs>;

type MouseVariantRoutes = ExtractRoutes<typeof mouseVariantTabs>;
type MouseGeneRoutes = ExtractRoutes<typeof mouseGeneTabs>;
type MouseCcreRoutes = ExtractRoutes<typeof mouseCcreTabs>;
type MouseRegionRoutes = ExtractRoutes<typeof mouseRegionTabs>; 

// Generic type to get routes for any assembly/entity combination
export type EntityRoute<A extends Assembly, E extends EntityType<A>> = ExtractRoutes<(typeof entityTabsConfig)[A][E]>;

const humanVariantTabs: readonly TabConfig<"" | "ccres" | "genes" | "browser">[] = [
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
    component: () => <p>cCREs intersecting this variant page</p>,
  },
  { route: "genes", label: "Genes", iconPath: GeneIconPath, component: EQTLs },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
] as const;

const humanGeneTabs = [
  { route: "", label: "Genes", iconPath: GeneIconPath, component: GeneExpression },
  { route: "ccres", label: "cCREs", iconPath: CcreIconPath, component: GeneLinkedIcres },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: EQTLs,
  },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
] as const;

const humanCcreTabs = [
  {
    route: "",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: () => <p>This should have biosample specific z-scores</p>,
  },
  { route: "genes", label: "Genes", iconPath: GeneIconPath, component: CcreLinkedGenes },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: CcreVariantsTab,
  },
  {
    route: "conservation",
    label: "Conservation",
    iconPath: ConservationIconPath,
    component: () => <p>This should have conservation data</p>,
  },
  {
    route: "functional-characterization",
    label: "functional-characterization",
    iconPath: FunctionalIconPath,
    component: () => <p>This should have functional characterization data</p>,
  },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
  {
    route: "transcript-expression",
    label: "transcript expression",
    component: () => <p>This should have transcipt expression data</p>,
  },
] as const;

const humanRegionTabs = [
  { route: "ccres", label: "cCREs", iconPath: CcreIconPath, component: IntersectingCcres },
  { route: "genes", label: "Genes", iconPath: GeneIconPath, component: IntersectingGenes },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: IntersectingSNPs,
  },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
] as const;

const mouseVariantTabs = [
  {
    route: "",
    label: "Variant",
    iconPath: VariantIconPath,
    component: () => <p>variant tab for mouse</p>,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: () => <p>cCREs intersecting this variant page</p>,
  },
  { route: "genes", label: "Genes", iconPath: GeneIconPath, component: EQTLs },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
] as const;

const mouseGeneTabs = [
  { route: "", label: "Genes", iconPath: GeneIconPath, component: GeneExpression },
  { route: "ccres", label: "cCREs", iconPath: CcreIconPath, component: () => <p>Linked mouse cCREs</p> },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: EQTLs,
  },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
] as const;

const mouseCcreTabs = [
  {
    route: "",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: () => <p>This should have biosample specific z-scores</p>,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    component: () => <p>This should have Linked Genes for Mouse cCREs</p>,
  },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: () => <p>Variants for mouse cCREs </p>,
  },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
] as const;

const mouseRegionTabs = [
  { route: "ccres", label: "cCREs", iconPath: CcreIconPath, component: IntersectingCcres },
  { route: "genes", label: "Genes", iconPath: GeneIconPath, component: IntersectingGenes },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: () => <p>This page should have intersecting mouse SNPs</p>,
  },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, component: GenomeBrowserView },
] as const;

/**
 * Todo put back in the type
 */
export const entityTabsConfig = {
  GRCh38: {
    variant: humanVariantTabs,
    gene: humanGeneTabs,
    ccre: humanCcreTabs,
    region: humanRegionTabs,
  } as const,
  mm10: {
    variant: mouseVariantTabs,
    gene: mouseGeneTabs,
    ccre: mouseCcreTabs,
    region: mouseRegionTabs,
  },
} as const;

type _EntityType<A extends Assembly> = keyof typeof entityTabsConfig[A]

const x: _EntityType<"GRCh38"> = "region"

export const isValidRouteForEntity = <A extends Assembly>(
  assembly: A,
  entityType: EntityType<A>,
  route: string
): route is EntityRoute<A, typeof entityType> => {
  return entityTabsConfig[assembly][entityType].some((x) => x.route === route);
};

// // Helper to get routes for an entity type
// export const getRoutesForEntity = <T extends EntityType>(entityType: T): RouteType<T>[] => {
//   const config = entityConfig[entityType];
//   return Object.keys(config.routes) as RouteType<T>[];
// };

// // Helper to get tab config for a route
// export const getTabConfig = <T extends EntityType>(entityType: T, route: RouteType<T>): TabConfig => {
//   return entityConfig[entityType].routes[route];
// };

// // Helper to generate tab array for EntityDetailsTabs
// export const generateTabsForEntity = <T extends EntityType>(entityType: T) => {
//   const config = entityConfig[entityType];
//   return Object.entries(config.routes).map(([route, tabConfig]) => ({
//     ...tabConfig,
//     href: route,
//   }));
// };
