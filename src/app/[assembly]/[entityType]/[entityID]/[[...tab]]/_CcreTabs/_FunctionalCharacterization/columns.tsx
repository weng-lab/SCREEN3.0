import { TableColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import {
  CapraFccDoubleQueryQuery,
  CapraFccSoloQueryQuery,
  CrisprFccQueryQuery,
  FunctionalCharacterizationQueryQuery,
  Mpra_FccQuery,
} from "common/types/generated/graphql";
import { capra_experimentMap, crispr_experimentMap } from "./consts";

/** Unwraps the nullable array of nullable rows that each FCC query returns */
type QueryRow<T extends readonly unknown[] | null | undefined> = NonNullable<NonNullable<T>[number]>;

export type MouseTransgenicRow = QueryRow<FunctionalCharacterizationQueryQuery["functionalCharacterizationQuery"]>;
export type MpraRow = QueryRow<Mpra_FccQuery["mpraFccQuery"]>;
export type CapraSoloRow = QueryRow<CapraFccSoloQueryQuery["capraFccSoloQuery"]>;
export type CrisprRow = QueryRow<CrisprFccQueryQuery["crisprFccQuery"]>;

/** CAPRA double rows are joined with the cCRE accessions of their two rDHS fragments */
export type CapraDoubleRow = QueryRow<CapraFccDoubleQueryQuery["capraFccDoubleQuery"]> & {
  ccrep1: string | undefined;
  ccrep2: string | undefined;
};

/** CAPRA and CRISPR tables display "n/a" for missing (and zero) p-values and FDRs */
const twoDecimalsOrNA = (value: number | null | undefined) => (!value ? "n/a" : value.toFixed(2));

/** Stands in for an rDHS with no matching cCRE, keeping both halves of a pair positionally clear */
const MISSING_ACCESSION = "—";

/** An rDHS with no matching cCRE renders as plain text rather than a link to nowhere */
const renderCcreLink = (accession: string | undefined) =>
  accession ? <LinkComponent href={`/GRCh38/ccre/${accession}`}>{accession}</LinkComponent> : MISSING_ACCESSION;

const chromosomeCol: TableColDef = {
  headerName: "Chromosome",
  field: "chromosome",
};

const startCol: TableColDef = {
  headerName: "Start",
  field: "start",
  type: "number",
};

const stopCol: TableColDef = {
  headerName: "Stop",
  field: "stop",
  type: "number",
};

const log2fcCol: TableColDef = {
  headerName: "Log₂(Fold Change)",
  field: "log2fc",
  type: "number",
  renderCell: (params) => params.value?.toFixed(2),
};

const pValueCol: TableColDef = {
  headerName: "P-value",
  field: "pvalue",
  type: "number",
  renderCell: (params) => twoDecimalsOrNA(params.value),
};

const fdrCol: TableColDef = {
  headerName: "FDR",
  field: "fdr",
  type: "number",
  renderCell: (params) => twoDecimalsOrNA(params.value),
};

/** Experiment accession linked to ENCODE */
const encodeExperimentCol: TableColDef = {
  headerName: "Experiment",
  field: "experiment",
  renderCell: (params) => (
    <LinkComponent href={`https://www.encodeproject.org/experiments/${params.value}`} showExternalIcon openInNewTab>
      {params.value}
    </LinkComponent>
  ),
};

const replicateCols: TableColDef[] = [
  {
    headerName: "DNA Rep1",
    field: "dna_rep1",
    type: "number",
  },
  {
    headerName: "RNA Rep1",
    field: "rna_rep1",
    type: "number",
  },
  {
    headerName: "RNA Rep2",
    field: "rna_rep2",
    type: "number",
  },
  {
    headerName: "RNA Rep3",
    field: "rna_rep3",
    type: "number",
  },
];

/**
 * Shared by both CAPRA tables, which differ only in their leading identifier columns.
 * Celltype and Lab aren't on the row — they're derived from the experiment accession via
 * `valueGetter` so that sorting, filtering and export see them.
 */
const capraCols: TableColDef[] = [
  encodeExperimentCol,
  {
    headerName: "Celltype",
    field: "celltype",
    valueGetter: (_, row) => capra_experimentMap[row.experiment]?.cellType,
  },
  {
    headerName: "Lab",
    field: "lab",
    valueGetter: (_, row) => capra_experimentMap[row.experiment]?.lab,
  },
  ...replicateCols,
  log2fcCol,
  pValueCol,
  fdrCol,
];

export const MouseTransgenicCols: TableColDef<MouseTransgenicRow>[] = [
  chromosomeCol,
  startCol,
  stopCol,
  {
    headerName: "Element Id",
    field: "element_id",
    renderCell: (params) => {
      return (
        <LinkComponent
          href={`https://enhancer.lbl.gov/vista/element?vistaId=${params.value}`}
          showExternalIcon
          openInNewTab
        >
          {params.value}
        </LinkComponent>
      );
    },
  },
  {
    headerName: "Assay Result",
    field: "assay_result",
  },
  {
    headerName: "Tissues [number of embryos positive/number of embryos negative]",
    field: "tissues",
  },
];

export const MpraCols: TableColDef<MpraRow>[] = [
  chromosomeCol,
  startCol,
  stopCol,
  {
    headerName: "Strand",
    field: "strand",
  },
  log2fcCol,
  encodeExperimentCol,
  {
    headerName: "Cell Type",
    field: "celltype",
  },
  {
    headerName: "Assay Type",
    field: "assay_type",
  },
  {
    headerName: "Series",
    field: "series",
  },
  {
    headerName: "Location of element",
    field: "element_location",
  },
  {
    headerName: "Location of barcode",
    field: "barcode_location",
  },
];

export const CapraSoloCols: TableColDef<CapraSoloRow>[] = capraCols;

export const CapraDoubleCols: TableColDef<CapraDoubleRow>[] = [
  {
    headerName: "cCRE Pair",
    field: "ccrePair",
    // The pair is assembled from two row fields, so export/sort need it spelled out as a value
    valueGetter: (_, row) => `${row.ccrep1 ?? MISSING_ACCESSION}-${row.ccrep2 ?? MISSING_ACCESSION}`,
    renderCell: (params) => (
      <>
        {renderCcreLink(params.row.ccrep1)}-{renderCcreLink(params.row.ccrep2)}
      </>
    ),
  },
  ...capraCols,
];

export const CrisprCols: TableColDef<CrisprRow>[] = [
  encodeExperimentCol,
  {
    headerName: "Design",
    field: "design",
    valueGetter: (_, row) => crispr_experimentMap[row.experiment]?.design,
  },
  {
    headerName: "Celltype",
    field: "celltype",
    valueGetter: (_, row) => crispr_experimentMap[row.experiment]?.cellType,
  },
  {
    headerName: "Lab",
    field: "lab",
    valueGetter: (_, row) => crispr_experimentMap[row.experiment]?.lab,
  },
  log2fcCol,
  pValueCol,
  fdrCol,
];
