import { Fragment } from "react";
import { Skeleton } from "@mui/material";
import { EncodeBiosample, TableColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";
import { GWASStudy } from "common/hooks/data/gwas";
import { UseGWASSnpsIntersectingcCREsReturn } from "common/hooks/data/gwas";
import { CcreAssay, CcreZScoresAndGroup } from "common/types/globalTypes";

export type CcreRow = UseGWASSnpsIntersectingcCREsReturn["data"][number];

//skip specifying type: "number" to avoid manual left align. Nobody is filtering this table so doesn't matter
export const ldBlocksColumns: TableColDef<GWASStudy>[] = [
  {
    field: "total_ld_blocks",
    headerName: "Total LD Blocks",
  },
  {
    field: "ld_blocks_overlapping_ccres",
    headerName: "# of LD blocks overlapping cCREs",
    valueGetter: (_, row) =>
      row.ld_blocks_overlapping_ccres +
      " (" +
      Math.ceil((row.ld_blocks_overlapping_ccres / +row.total_ld_blocks) * 100) +
      "%)",
  },
  {
    field: "overlapping_ccres",
    headerName: "# of overlapping cCREs",
  },
];

type IntersectingCcreColumnsParams = {
  selectedBiosample: EncodeBiosample;
  dataZScores: Record<string, CcreZScoresAndGroup> | undefined;
  zScoresLoading: boolean;
  nearestTSSColumn: TableColDef<CcreRow>;
};

export const intersectingCcreColumns = ({
  selectedBiosample,
  dataZScores,
  zScoresLoading,
  nearestTSSColumn,
}: IntersectingCcreColumnsParams): TableColDef<CcreRow>[] => {
  // z-score columns read from the side-loaded `dataZScores` map (keyed by accession). The
  // header swaps to "… Max Z" when no biosample is selected (global) vs the assay name when one
  // is. `display: "flex"` makes the number-column right-alignment apply to the loading skeleton.
  const zScoreCol = (field: CcreAssay, label: string): TableColDef<CcreRow> => ({
    field,
    headerName: selectedBiosample ? label : `${label} Max Z`,
    type: "number",
    display: "flex",
    valueGetter: (_, row) => dataZScores?.[row.ccre]?.[field] ?? null,
    renderCell: (params) =>
      zScoresLoading ? <Skeleton variant="text" width={30} /> : params.value != null ? params.value.toFixed(2) : "—",
  });

  // A biosample only carries the assays it was profiled with; with none selected all five apply.
  const hasAssay = (accession: keyof EncodeBiosample) => !selectedBiosample || !!selectedBiosample[accession];

  return [
    {
      field: "ccre",
      headerName: "Accession",
      renderCell: (params) => (
        <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "group",
      headerName: "Classification",
      ...ClassificationFormatting,
      // Global classification when no biosample is selected, celltype-specific when one is.
      // Both come from useCcreZScores (its max-Z branch returns the global group).
      valueGetter: (_, row) => dataZScores?.[row.ccre]?.group ?? null,
      renderCell: (params) =>
        zScoresLoading ? <Skeleton variant="text" width={80} /> : ClassificationFormatting.renderCell?.(params),
    },
    {
      field: "snpid",
      headerName: "SNP",
      renderCell: (params) => <LinkComponent href={`/GRCh38/variant/${params.value}`}>{params.value}</LinkComponent>,
    },
    {
      field: "ldblocksnpid",
      headerName: "LD Block Lead SNP ID(s)",
      renderCell: (params) => {
        if (params.value === "Lead") return "Lead";
        const rsIDs = (params.value as string)?.split(",");
        const links = rsIDs?.map((rsID: string, index: number) => (
          <Fragment key={rsID}>
            <LinkComponent href={`/GRCh38/variant/${rsID}`}>{rsID}</LinkComponent>
            {index < rsIDs.length - 1 ? ", " : ""}
          </Fragment>
        ));
        return <span>{links}</span>;
      },
    },
    // ideally this would be type: "number" to allow <,>,<= filtering but with * and comma separated values keeping default
    {
      field: "rsquare",
      renderHeader: () => (
        <p>
          <i>
            R<sup>2&nbsp;</sup>
          </i>
        </p>
      ),
    },
    nearestTSSColumn,
    ...(hasAssay("dnase_experiment_accession") ? [zScoreCol("dnase", "DNase")] : []),
    ...(hasAssay("atac_experiment_accession") ? [zScoreCol("atac", "ATAC")] : []),
    ...(hasAssay("h3k4me3_experiment_accession") ? [zScoreCol("h3k4me3", "H3K4me3")] : []),
    ...(hasAssay("h3k27ac_experiment_accession") ? [zScoreCol("h3k27ac", "H3K27ac")] : []),
    ...(hasAssay("ctcf_experiment_accession") ? [zScoreCol("ctcf", "CTCF")] : []),
  ];
};
