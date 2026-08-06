import { useState } from "react";
import { EncodeBiosample } from "@weng-lab/ui-components";
import { CCRE_CLASSES, reachableCcreClasses } from "common/ccre";
import { Assembly, CcreClass } from "common/types/globalTypes";
import { Assays, Conservation } from "app/downloads/_DownloadRange/downloadRangeHelpers";
import { ALL_ASSAYS, ALL_CONSERVATION, DEFAULT_REGION, NO_CONSERVATION } from "app/downloads/_DownloadRange/consts";

/**
 * Selection state for the cCRE range download form. Assembly, biosample, assays and cCRE classes
 * are interlocked: switching assembly clears the selected biosample, and the selected biosample
 * determines which assays were performed and thus which classes a cCRE can be assigned.
 */
export const useDownloadRangeSelection = () => {
  const [assembly, setAssembly] = useState<Assembly>("GRCh38");
  const [region, setRegion] = useState<string>(DEFAULT_REGION);
  const [selectedBiosample, setSelectedBiosample] = useState<EncodeBiosample>(null);
  //Assays the selected biosample has experiments for. Used to disable assay checkboxes
  const [availableAssays, setAvailableAssays] = useState<Assays>(ALL_ASSAYS);
  const [selectedAssays, setSelectedAssays] = useState<Assays>(ALL_ASSAYS);
  const [selectedConservation, setSelectedConservation] = useState<Conservation>(ALL_CONSERVATION);
  const [selectedClasses, setSelectedClasses] = useState<CcreClass[]>([...CCRE_CLASSES]);

  //Classes a cCRE can be assigned given the selected biosample's available assays (all classes when none selected)
  const reachableClasses: CcreClass[] = selectedBiosample ? reachableCcreClasses(availableAssays) : [...CCRE_CLASSES];

  const selectBiosample = (biosample: EncodeBiosample) => {
    const assays: Assays = biosample
      ? {
          atac: !!biosample.atac_experiment_accession,
          ctcf: !!biosample.ctcf_experiment_accession,
          dnase: !!biosample.dnase_experiment_accession,
          h3k27ac: !!biosample.h3k27ac_experiment_accession,
          h3k4me3: !!biosample.h3k4me3_experiment_accession,
        }
      : ALL_ASSAYS;

    setSelectedBiosample(biosample);
    setSelectedAssays(assays);
    setAvailableAssays(assays);
    setSelectedClasses(biosample ? reachableCcreClasses(assays) : [...CCRE_CLASSES]);
  };

  const selectAssembly = (assembly: Assembly) => {
    //Conservation scores are only available for GRCh38
    setSelectedConservation(assembly === "mm10" ? NO_CONSERVATION : ALL_CONSERVATION);
    selectBiosample(null);
    setAssembly(assembly);
  };

  return {
    assembly,
    selectAssembly,
    region,
    setRegion,
    selectedBiosample,
    selectBiosample,
    availableAssays,
    selectedAssays,
    setSelectedAssays,
    selectedConservation,
    setSelectedConservation,
    selectedClasses,
    setSelectedClasses,
    reachableClasses,
  };
};
