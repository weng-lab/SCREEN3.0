/**
 * These are where the universal shared types should be kept
 */

export interface GenomicRange {
  chromosome: string;
  start: number;
  end: number;
}

export type EntityType = "variant" | "gene" | "ccre" | "region"
export type Assembly = "GRCh38" | "mm10"

export function isValidGenomicEntity(value: string): value is EntityType {
  return value === "variant" || value === "gene" || value === "ccre" || value === "region";
}


/**
 * @note If we are now adding studies and biosamples as "Entities", this will need to be changed.
 */
export type SharedRoute = "browser" | "conservation" | "functional"

//empty route is for the elements default tab. For example /gene/SP1 will be the gene expression. Otherwise would need to assign /gene/SP1/gene
export type EntityDefaultTab = ""

export type VariantRoute = SharedRoute | EntityDefaultTab | "ccres" | "genes"

export type GeneRoute = SharedRoute | EntityDefaultTab | "ccres" | "variants"

export type CcreRoute = SharedRoute | EntityDefaultTab | "genes" | "variants"

//region search does not have "base" tab like gene/snp/ccre. Always region/[region]/[elementType]
export type RegionRoute = SharedRoute | "ccres" | "genes" | "variants"

export function isValidSharedTab(tab: string): tab is SharedRoute {
  return tab === "browser"
}

export function isValidEntityDefaultTab(tab: string): tab is EntityDefaultTab {
  return tab === ""
}

export function isValidVariantTab(tab: string): tab is VariantRoute {
  return isValidSharedTab(tab) || isValidEntityDefaultTab(tab) || tab === "ccres" || tab === "genes"
}

export function isValidGeneTab(tab: string): tab is GeneRoute {
  return isValidSharedTab(tab) || isValidEntityDefaultTab(tab) || tab === "ccres" || tab === "variants"
}

export function isValidCcreTab(tab: string): tab is CcreRoute {
  return isValidSharedTab(tab) || isValidEntityDefaultTab(tab) || tab === "genes" || tab === "variants"
}

export function isValidRegionTab(tab: string): tab is RegionRoute {
  return  isValidSharedTab(tab) || isValidEntityDefaultTab(tab) || tab === "ccres" || tab === "genes" || tab === "variants"
}

export function isValidTab(tab: string): tab is SharedRoute | VariantRoute | GeneRoute | CcreRoute {
  return isValidSharedTab(tab) || isValidEntityDefaultTab(tab) || isValidVariantTab(tab) || isValidGeneTab(tab) || isValidCcreTab(tab)
}

export type TabRoute = VariantRoute | GeneRoute | CcreRoute | RegionRoute

/**
 * label is for the display name of the tab.
 * href should match the final dynamic route for the tab.
 */
export type ElementDetailsTab = {
  label: string,
  href: TabRoute
  iconPath: string
}

export interface SharedTab extends ElementDetailsTab {
  href: SharedRoute
}

export interface VariantDetailsTab extends ElementDetailsTab {
  href: VariantRoute
}

export interface GeneDetailsTab extends ElementDetailsTab {
  href: GeneRoute
}

export interface CcreDetailsTab extends ElementDetailsTab {
  href: CcreRoute
}

export interface RegionDetailsTab extends ElementDetailsTab {
  href: RegionRoute
}