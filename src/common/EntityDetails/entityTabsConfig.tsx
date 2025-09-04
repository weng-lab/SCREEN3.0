import { Assembly } from "types/globalTypes";
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
import { AnyOpenEntity } from "./OpenEntitiesTabs/OpenEntitiesContext";
import { BiosampleActivity } from "app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_cCRE/BiosampleActivity";

const GbIconPath = "/assets/GbIcon.svg";
const CcreIconPath = "/assets/CcreIcon.svg";
const GeneIconPath = "/assets/GeneIcon.svg";
const VariantIconPath = "/assets/VariantIcon.svg";
const ConservationIconPath = "/assets/ConservationIcon.svg";
const FunctionalIconPath = "/assets/FunctionalCharacterizationIcon.svg";

/**
 * To add a new tab to an existing entity:
 * 1) Add a new object with route, label, icon, and component to render to correct tab list
 * 
 * To add a new entity and with new tabs:
 * 1) Add entity to validEntityTypes
 * 2) Create list of tabs for the entity
 * 3) Create type for the routes of that entity
 * 4) Add an entry to the TabList type that adds a new TabConfig<NewEntityRoutes>[]
 * 5) Add the entity and corresponding tabs to the entityTabsConfig object
 * 
 */

export const validEntityTypes = {
  GRCh38: ["ccre", "gene", "variant", "region"],
  mm10: ["ccre", "gene", "variant", "region"]
} as const;

export type EntityType<A extends Assembly> = typeof validEntityTypes[A][number]
export type AnyEntityType = EntityType<"GRCh38"> | EntityType<"mm10">

export const isValidEntityType = <A extends Assembly>(assembly: A, entityType: string): entityType is EntityType<A> => {
  return (validEntityTypes[assembly] as readonly string[]).includes(entityType)
}

export type entityViewComponentProps = {
  entity: AnyOpenEntity
}

type TabConfig<R extends string = string> = {
  route: R;
  label: string;
  /**
   * If no icon passed, will place tab in "more" section
   */
  iconPath?: string;
  /**
   * The component to render for that tab view
   * @note NOT USED CURRENTLY
   */
  component: (props: entityViewComponentProps) => ReactElement;
};

/**
 * TabList type takes in assembly and EntityType and returns corresponding string literal union
 * The prettier auto-formatting on this is pretty horrendous, appologies
 */
type TabList<A extends Assembly, E extends EntityType<A>> = A extends "GRCh38"
  ? E extends "ccre"
    ? readonly TabConfig<HumanCcreRoutes>[]
    : E extends "gene"
    ? readonly TabConfig<HumanGeneRoutes>[]
    : E extends "variant"
    ? readonly TabConfig<HumanVariantRoutes>[]
    : readonly TabConfig<HumanRegionRoutes>[]
  : E extends "ccre"
  ? readonly TabConfig<MouseCcreRoutes>[]
  : E extends "gene"
  ? readonly TabConfig<MouseGeneRoutes>[]
  : E extends "variant"
  ? readonly TabConfig<MouseVariantRoutes>[]
  : readonly TabConfig<MouseRegionRoutes>[];

type EntityTabsConfig = {
  readonly [A in Assembly]: {
    readonly [E in EntityType<A>]: TabList<A, E>;
  };
};

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

export type AnyTabRoute = HumanVariantRoutes | HumanGeneRoutes | HumanCcreRoutes | HumanRegionRoutes | MouseVariantRoutes | MouseGeneRoutes | MouseCcreRoutes | MouseRegionRoutes

// Generic type to get routes for any assembly/entity combination
export type EntityRoute<A extends Assembly, E extends EntityType<A>> = 
  E extends keyof (typeof entityTabsConfig)[A] 
    ? ExtractRoutes<(typeof entityTabsConfig)[A][E]>
    : never;

const humanVariantTabs: readonly TabConfig<"" | "ccres" | "genes" | "browser">[] = [
  {
    route: "",
    label: "Variant",
    iconPath: VariantIconPath,
    // component: VariantInfo,
    component: null,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    component: () => <p>cCREs intersecting this variant page</p>,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    // component: EQTLs,
    component: null,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    // component: GenomeBrowserView,
    component: null,
  },
] as const;


const humanGeneTabs: readonly TabConfig<"" | "ccres" | "variants" | "transcript-expression" | "browser">[] = [
  {
    route: "",
    label: "Gene",
    iconPath: GeneIconPath,
    // component: GeneExpression,
    component: null,
  },
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    // component: GeneLinkedIcres,
    component: null,
  },
  {
    route: "variants",
    label: "Variants",
    iconPath: VariantIconPath,
    // component: EQTLs,
    component: null,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    // component: GenomeBrowserView,
    component: null,
  },
  {
    route: "transcript-expression",
    label: "Transcript Expression",
    component: () => <p>This should have transcript expression data</p>,
  },
] as const;

const humanCcreTabs: readonly TabConfig<
  "" | "genes" | "variants" | "conservation" | "functional-characterization" | "browser"
>[] = [
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
    //  component: CcreLinkedGenes ,
    component: null,
  },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    // component: CcreVariantsTab,
    component: null,
  },
  {
    route: "conservation",
    label: "Conservation",
    iconPath: ConservationIconPath,
    // component: () => <p>This should have conservation data</p>,
    component: null,
  },
  {
    route: "functional-characterization",
    label: "Functional Characterization",
    iconPath: FunctionalIconPath,
    component: () => <p>This should have functional characterization data</p>,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    // component: GenomeBrowserView,
    component: null,
  },
] as const;

const humanRegionTabs: readonly TabConfig<"ccres" | "genes" | "variants" | "browser">[] = [
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    // component: IntersectingCcres
    component: null,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    //  component: IntersectingGenes
    component: null,
  },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    // component: IntersectingSNPs,
    component: null,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    //  component: GenomeBrowserView
    component: null,
  },
] as const;

const mouseVariantTabs: readonly TabConfig<"" | "ccres" | "genes" | "browser">[] = [
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
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    //  component: EQTLs
    component: null,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    // component: GenomeBrowserView
    component: null
  },
] as const;

const mouseGeneTabs: readonly TabConfig<"" | "ccres" | "variants" | "browser">[] = [
  { route: "", label: "Gene", iconPath: GeneIconPath,
    //  component: GeneExpression 
    component: null
    },
  { route: "ccres", label: "cCREs", iconPath: CcreIconPath, component: () => <p>Linked mouse cCREs</p> },
  {
    route: "variants",
    label: "Variants",
    iconPath: VariantIconPath,
    // component: EQTLs,
    component: null
  },
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, 
    // component: GenomeBrowserView
    component: null
   },
] as const;

const mouseCcreTabs: readonly TabConfig<"" | "genes" | "variants" | "browser">[] = [
  {
    route: "",
    label: "cCRE",
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
  { route: "browser", label: "Genome Browser", iconPath: GbIconPath, 
    // component: GenomeBrowserView
    component: null
   },
] as const;

const mouseRegionTabs: readonly TabConfig<"variants" | "ccres" | "genes" | "browser">[] = [
  {
    route: "ccres",
    label: "cCREs",
    iconPath: CcreIconPath,
    //  component: IntersectingCcres
    component: null,
  },
  {
    route: "genes",
    label: "Genes",
    iconPath: GeneIconPath,
    //  component: IntersectingGenes
    component: null,
  },
  {
    route: "variants",
    label: "Variant",
    iconPath: VariantIconPath,
    component: () => <p>This page should have intersecting mouse SNPs</p>,
  },
  {
    route: "browser",
    label: "Genome Browser",
    iconPath: GbIconPath,
    // component: GenomeBrowserView
    component: null,
  },
] as const;

export const entityTabsConfig: EntityTabsConfig = {
  GRCh38: {
    variant: humanVariantTabs,
    gene: humanGeneTabs,
    ccre: humanCcreTabs,
    region: humanRegionTabs,
  },
  mm10: {
    variant: mouseVariantTabs,
    gene: mouseGeneTabs,
    ccre: mouseCcreTabs,
    region: mouseRegionTabs,
  },
} as const;

export const isValidRouteForEntity = <A extends Assembly, B>(
  assembly: A,
  entityType: EntityType<A>,
  route: string
): route is EntityRoute<A, typeof entityType> => {
  return entityTabsConfig[assembly][entityType].some((x) => x.route === route);
};

// Helper to generate tab array for EntityDetailsTabs
export const getTabsForEntity = <A extends Assembly, E extends EntityType<A>>(assembly: A, entityType: E) => {
  return entityTabsConfig[assembly][entityType]
};
