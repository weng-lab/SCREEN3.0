import { GeneDetailsTab, IcreDetailsTab, VariantDetailsTab, RegionDetailsTab, SharedTab } from "types/globalTypes";

const GbIconPath = '/assets/GbIcon.svg'
const IcreIconPath = '/assets/IcreIcon.svg'
const GeneIconPath = '/assets/GeneIcon.svg'
const VariantIconPath = '/assets/VariantIcon.svg'

export const sharedTabs: SharedTab[] = [
  {
    label: "Genome Browser",
    href: "browser",
    iconPath: GbIconPath
  },
];

export const variantDetailsTabs: VariantDetailsTab[] = [
  {
    label: "Variant",
    href: "",
    iconPath: VariantIconPath
  },
  {
    label: "iCREs",
    href: "icres",
    iconPath: IcreIconPath
  },
  {
    label: "Genes",
    href: "genes",
    iconPath: GeneIconPath
  },
];

export const geneDetailsTabs: GeneDetailsTab[] = [
  {
    label: "Gene",
    href: "",
    iconPath: GeneIconPath
  },
  {
    label: "iCREs",
    href: "icres",
    iconPath: IcreIconPath
  },
  {
    label: "Variants",
    href: "variants",
    iconPath: VariantIconPath
  },
];

export const icreDetailsTabs: IcreDetailsTab[] = [
  {
    label: "iCRE",
    href: "",
    iconPath: IcreIconPath
  },
  {
    label: "Genes",
    href: "genes",
    iconPath: GeneIconPath
  },
  {
    label: "Variants",
    href: "variants",
    iconPath: VariantIconPath
  },
];

export const regionDetailsTabs: RegionDetailsTab[] = [
  {
    label: "iCREs",
    href: "icres",
    iconPath: IcreIconPath
  },
  {
    label: "Genes",
    href: "genes",
    iconPath: GeneIconPath
  },
  {
    label: "Variants",
    href: "variants",
    iconPath: VariantIconPath
  },
]