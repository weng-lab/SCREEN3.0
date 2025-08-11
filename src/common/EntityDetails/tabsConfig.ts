import { GeneDetailsTab, CcreDetailsTab, VariantDetailsTab, RegionDetailsTab, SharedTab } from "types/globalTypes";

const GbIconPath = '/assets/GbIcon.svg'
const CcreIconPath = '/assets/CcreIcon.svg'
const GeneIconPath = '/assets/GeneIcon.svg'
const VariantIconPath = '/assets/VariantIcon.svg'
const ConservationIconPath = '/assets/ConservationIcon.svg'
const FunctionalIconPath = '/assets/FunctionalCharacterizationIcon.svg'

export const sharedTabs: SharedTab[] = [
  {
    label: "Genome Browser",
    href: "browser",
    iconPath: GbIconPath
  },
  {
    label: "Conservation",
    href: "conservation",
    iconPath: ConservationIconPath
  },
  {
    label: "Functional Characterization",
    href: "functional",
    iconPath: FunctionalIconPath
  },
];

export const moreTabs: SharedTab[] = [
  {
    label: "Genome Browser",
    href: "browser",
    iconPath: GbIconPath
  },
  {
    label: "Conservation",
    href: "conservation",
    iconPath: ConservationIconPath
  },
  {
    label: "Functional Characterization",
    href: "functional",
    iconPath: FunctionalIconPath
  },
]

export const variantDetailsTabs: VariantDetailsTab[] = [
  {
    label: "Variant",
    href: "",
    iconPath: VariantIconPath
  },
  {
    label: "iCREs",
    href: "ccres",
    iconPath: CcreIconPath
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
    label: "cCREs",
    href: "ccres",
    iconPath: CcreIconPath
  },
  {
    label: "Variants",
    href: "variants",
    iconPath: VariantIconPath
  },
];

export const icreDetailsTabs: CcreDetailsTab[] = [
  {
    label: "cCRE",
    href: "",
    iconPath: CcreIconPath
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
    label: "cCREs",
    href: "ccres",
    iconPath: CcreIconPath
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