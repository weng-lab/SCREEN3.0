"use client";
import { useGWASSnpsIntersectingcCREsData } from "common/hooks/data/gwas";
import { Fragment, useMemo, useState } from "react";
import { Table, TableColDef, EncodeBiosample } from "@weng-lab/ui-components";
import { SelectedBiosampleCard } from "common/components/SelectedBiosampleCard";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreZScores } from "common/hooks/data/ccre";
import { useNearestTSSColumn } from "common/hooks/data/ccre";
import { Typography, Button, Tooltip, Skeleton } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASStudyData } from "common/hooks/data/gwas";
import { BiosampleSelectDialog } from "common/components/BiosampleSelectDialog";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";
import { CcreAssay } from "common/types/globalTypes";

const GWASStudyCcres = ({ entity }: EntityViewComponentProps) => {
  const { data, loading, error } = useGWASStudyData({ studyid: [entity.entityID] });

  const [open, setOpen] = useState(false);

  const handleClickClose = () => {
    setOpen(false);
  };
  const [selectedBiosample, setSelectedBiosample] = useState<EncodeBiosample>(null);

  const {
    data: dataGWASSNPscCREs,
    loading: loadingGWASSNPscCREs,
    error: errorGWASSNPscCREs,
  } = useGWASSnpsIntersectingcCREsData({ studyid: [entity.entityID] });

  const handleBiosampleSelected = (biosample: EncodeBiosample) => {
    setSelectedBiosample(biosample);
  };
  
  const accessions = useMemo(() => [...new Set(dataGWASSNPscCREs?.map((d) => d.ccre) ?? [])], [dataGWASSNPscCREs]);

  const { data: dataZScores, loading: loadingZScores, error: errorZScores } = useCcreZScores({
    accessions,
    assembly: "GRCh38",
    biosample: selectedBiosample ? selectedBiosample.name : undefined,
    skip: accessions.length === 0,
  });
  const zScoresLoading = loadingZScores || (!dataZScores && !errorZScores);

  type CcreRow = NonNullable<typeof dataGWASSNPscCREs>[number];

  const nearestTSSColumn = useNearestTSSColumn<CcreRow>({
    accessions,
    assembly: "GRCh38",
    getAccession: (row) => row.ccre,
  });

  const showAtac = !selectedBiosample || !!selectedBiosample.atac_experiment_accession;
  const showCTCF = !selectedBiosample || !!selectedBiosample.ctcf_experiment_accession;
  const showDNase = !selectedBiosample || !!selectedBiosample.dnase_experiment_accession;
  const showH3k27ac = !selectedBiosample || !!selectedBiosample.h3k27ac_experiment_accession;
  const showH3k4me3 = !selectedBiosample || !!selectedBiosample.h3k4me3_experiment_accession;

  const ldblocks_columns: TableColDef<typeof data>[] = useMemo(
    () => [
      //skip specifying type: "number" to avoid manual left align. Nobody is filtering this table so doesn't matter
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
    ],
    []
  );

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
      zScoresLoading ? (
        <Skeleton variant="text" width={30} />
      ) : params.value != null ? (
        params.value.toFixed(2)
      ) : (
        "—"
      ),
  });

  const columns: TableColDef<CcreRow>[] = [
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
        zScoresLoading ? (
          <Skeleton variant="text" width={80} />
        ) : (
          ClassificationFormatting.renderCell?.(params)
        ),
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
    ...(showDNase ? [zScoreCol("dnase", "DNase")] : []),
    ...(showAtac ? [zScoreCol("atac", "ATAC")] : []),
    ...(showH3k4me3 ? [zScoreCol("h3k4me3", "H3K4me3")] : []),
    ...(showH3k27ac ? [zScoreCol("h3k27ac", "H3K27ac")] : []),
    ...(showCTCF ? [zScoreCol("ctcf", "CTCF")] : []),
  ];

  return errorGWASSNPscCREs || error ? (
    <Typography>Error Fetching Intersecting cCREs against SNPs identified by a GWAS study</Typography>
  ) : (
    <>
      <Table
        rows={data ? [data] : []}
        columns={ldblocks_columns}
        loading={loading}
        error={!!error}
        label={"LD Blocks"}
        emptyTableFallback={"Error fetching information about this study"}
        //temp fix to get visual loading state without specifying height once loaded. See https://github.com/weng-lab/web-components/issues/22
        divHeight={!data ? { height: "182px" } : undefined}
        slotProps={{
          toolbar: {
            labelTooltip: "LD Blocks are regions of the genome where genetic variants are inherited together due to high levels of linkage disequilibrium (LD)",
          },
        }}
        autoHeight
        hideFooter
      />
      {selectedBiosample && (
        <SelectedBiosampleCard biosample={selectedBiosample} onClear={() => handleBiosampleSelected(null)} />
      )}
      <Table
        rows={dataGWASSNPscCREs}
        columns={columns}
        loading={loadingGWASSNPscCREs}
        label={`Intersecting cCREs`}
        emptyTableFallback={"No Intersecting cCREs found against SNPs identified by GWAS study"}
        initialState={{
          sorting: {
            sortModel: [{ field: "rsquare", sort: "desc" }],
          },
        }}
        divHeight={{ height: "600px" }}
        slotProps={{
          toolbar: {
            labelTooltip: "cCREs intersected against SNPs identified by selected GWAS study",
            extra: (
              <Tooltip title="Advanced Filters">
                <Button variant="outlined" onClick={() => setOpen(true)}>
                  Select Biosample
                </Button>
              </Tooltip>
            ),
          },
        }}
      />
      <BiosampleSelectDialog
        assembly={entity.assembly}
        open={open}
        onClose={handleClickClose}
        onSelectionChange={handleBiosampleSelected}
        selected={selectedBiosample}
      />
    </>
  );
};
export default GWASStudyCcres;
