import {
  geneNameCol,
  geneTypeCol,
  experimentCol,
  displayNameCol,
  scoreCol,
  pValCol,
  gRNACol,
  effectSizeCol,
  tissueCol,
  sourceCol,
  variantIDCol,
  slopeCol,
  assayCol,
} from "common/components/linkedElements/columns";
import { colDef } from "common/components/linkedElements/linkedElements";

/**
 * Table definitions for the linked genes tab.
 */
export const IntactHiCLoopsCols: colDef[] = [
  geneNameCol,
  {...geneTypeCol, minWidth: 65},
  experimentCol,
  {...displayNameCol, minWidth: 85},
  scoreCol,
  {...pValCol, minWidth: 85},
];

export const ChIAPETCols: colDef[] = [
  geneNameCol,
  {...geneTypeCol, minWidth: 65},
  {...assayCol, minWidth: 85},
  experimentCol,
  {...displayNameCol, minWidth: 85},
  scoreCol,
];

export const CrisprFlowFISHCols: colDef[] = [
  geneNameCol,
  {...geneTypeCol, minWidth: 65},
  gRNACol,
  { ...experimentCol, flex: 1.25 },
  {...displayNameCol, minWidth: 85},
  effectSizeCol,
  pValCol,
];

export const eQTLCols: colDef[] = [
  geneNameCol,
  {...geneTypeCol, minWidth: 100},
  {...variantIDCol, minWidth: 140},
  {...sourceCol, minWidth: 75},
  {...tissueCol, minWidth: 85},
  slopeCol,
  {...pValCol, minWidth: 85},
];
