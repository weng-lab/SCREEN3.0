/**
 * These are where the universal shared types should be kept
 */

export interface GenomicRange {
  chromosome: string;
  start: number;
  end: number;
}

export type GenomicElementType = "variant" | "gene" | "icre" | "region"

export function isValidGenomicElement(value: string): value is GenomicElementType {
  return value === "variant" || value === "gene" || value === "icre" || value === "region";
}

export type SharedRoute = "browser"

//empty route is for the elements default tab. For example /gene/SP1 will be the gene expression. Otherwise would need to assign /gene/SP1/gene
export type ElementDefaultTab = ""

export type VariantRoute = SharedRoute | ElementDefaultTab | "icres" | "genes"

export type GeneRoute = SharedRoute | ElementDefaultTab | "icres" | "variants"

export type IcreRoute = SharedRoute | ElementDefaultTab | "genes" | "variants"

//region search does not have "base" tab like gene/snp/icre. Always region/[region]/[elementType]
export type RegionRoute = SharedRoute | "icres" | "genes" | "variants"

export function isValidSharedTab(tab: string): tab is SharedRoute {
  return tab === "browser"
}

export function isValidElementDefaultTab(tab: string): tab is ElementDefaultTab {
  return tab === ""
}

export function isValidVariantTab(tab: string): tab is VariantRoute {
  return isValidSharedTab(tab) || isValidElementDefaultTab(tab) || tab === "icres" || tab === "genes"
}

export function isValidGeneTab(tab: string): tab is GeneRoute {
  return isValidSharedTab(tab) || isValidElementDefaultTab(tab) || tab === "icres" || tab === "variants"
}

export function isValidIcreTab(tab: string): tab is IcreRoute {
  return isValidSharedTab(tab) || isValidElementDefaultTab(tab) || tab === "genes" || tab === "variants"
}

export function isValidRegionTab(tab: string): tab is RegionRoute {
  return  isValidSharedTab(tab) || tab === "icres" || tab === "genes" || tab === "variants"
}

export function isValidTab(tab: string): tab is SharedRoute | VariantRoute | GeneRoute | IcreRoute {
  return isValidSharedTab(tab) || isValidElementDefaultTab(tab) || isValidVariantTab(tab) || isValidGeneTab(tab) || isValidIcreTab(tab)
}

export type TabRoute = VariantRoute | GeneRoute | IcreRoute | RegionRoute

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

export interface IcreDetailsTab extends ElementDetailsTab {
  href: IcreRoute
}

export interface RegionDetailsTab extends ElementDetailsTab {
  href: RegionRoute
}