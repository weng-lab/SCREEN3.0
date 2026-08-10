type CAPRA_ExperimentInfo = {
  lab: string;
  cellType: string;
};

type CRISPR_ExperimentInfo = {
  lab: string;
  cellType: string;
  design: string;
};

// Define the map where experiment is the key
export const capra_experimentMap: Record<string, CAPRA_ExperimentInfo> = {
  ENCSR064KUD: { lab: "Kevin White, UChicago", cellType: "HCT116" },
  ENCSR135NXN: { lab: "Kevin White, UChicago", cellType: "HepG2" },
  ENCSR547SBZ: { lab: "Kevin White, UChicago", cellType: "MCF-7" },
  ENCSR661FOW: { lab: "Tim Reddy, Duke", cellType: "K562" },
  ENCSR858MPS: { lab: "Kevin White, UChicago", cellType: "K562" },
  ENCSR895FDL: { lab: "Kevin White, UChicago", cellType: "A549" },
  ENCSR983SZZ: { lab: "Kevin White, UChicago", cellType: "SH-SY5Y" },
};

export const crispr_experimentMap: Record<string, CRISPR_ExperimentInfo> = {
  ENCSR179FSH: { design: "proliferation CRISPRi screen (dCas9-KRAB)", lab: "Tim Reddy, Duke", cellType: "OCI-AML2" },
  ENCSR274OEB: { design: "proliferation CRISPRi screen (dCas9-KRAB)", lab: "Tim Reddy, Duke", cellType: "K562" },
  ENCSR295VER: {
    design: "proliferation CRISPRi screen (dCas9-KRAB-WSR7EEE)",
    lab: "Will Greenleaf, Stanford",
    cellType: "K562",
  },
  ENCSR369UFO: {
    design: "proliferation CRISPRi screen (dCas9-RYBP)",
    lab: "Will Greenleaf, Stanford",
    cellType: "K562",
  },
  ENCSR372CKT: {
    design: "proliferation CRISPRi screen (dCas9-ZNF705-KRAB)",
    lab: "Will Greenleaf, Stanford",
    cellType: "K562",
  },
  ENCSR381RDB: {
    design: "proliferation CRISPRi screen (dCas9-RYBP)",
    lab: "Will Greenleaf, Stanford",
    cellType: "K562",
  },
  ENCSR386FFV: {
    design: "proliferation CRISPRi screen (dCas9-KRAB-WSR7EEE)",
    lab: "Will Greenleaf, Stanford",
    cellType: "K562",
  },
  ENCSR427OCU: {
    design: "proliferation CRISPRi screen (dCas9-KRAB-MGA1-MGA2)",
    lab: "Will Greenleaf, Stanford",
    cellType: "K562",
  },
  ENCSR446RYW: {
    design: "proliferation CRISPRi screen (dCas9-KRAB)",
    lab: "Will Greenleaf, Stanford",
    cellType: "K562",
  },
  ENCSR690DTG: { design: "proliferation CRISPRi screen (dCas9-KRAB)", lab: "Tim Reddy, Duke", cellType: "K562" },
  ENCSR997ZOY: { design: "proliferation CRISPRi screen (dCas)", lab: "Will Greenleaf, Stanford", cellType: "K562" },
};
