"use client";
import { useGWASSnpsIntersectingcCREsData } from "common/hooks/data/gwas";
import { useMemo, useState } from "react";
import { Table, EncodeBiosample } from "@weng-lab/ui-components";
import { SelectedBiosampleCard } from "common/components/SelectedBiosampleCard";
import { useCcreZScores } from "common/hooks/data/ccre";
import { useNearestTSSColumn } from "common/components/columns";
import { Typography, Button, Tooltip } from "@mui/material";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASStudy } from "common/hooks/data/gwas";
import { BiosampleSelectDialog } from "common/components/BiosampleSelectDialog";
import { CcreRow, intersectingCcreColumns, ldBlocksColumns } from "./columns";

const GWASStudyCcres = ({ entity }: EntityViewComponentProps) => {
  const { data, loading, error } = useGWASStudy({ studyid: entity.entityID });

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

  const {
    data: dataZScores,
    loading: loadingZScores,
    error: errorZScores,
  } = useCcreZScores({
    accessions,
    assembly: "GRCh38",
    biosample: selectedBiosample ? selectedBiosample.name : undefined,
    skip: accessions.length === 0,
  });
  const zScoresLoading = loadingZScores || (!dataZScores && !errorZScores);

  const nearestTSSColumn = useNearestTSSColumn<CcreRow>({
    accessions,
    assembly: "GRCh38",
    getAccession: (row) => row.ccre,
  });

  const columns = intersectingCcreColumns({ selectedBiosample, dataZScores, zScoresLoading, nearestTSSColumn });

  return errorGWASSNPscCREs || error ? (
    <Typography>Error Fetching Intersecting cCREs against SNPs identified by a GWAS study</Typography>
  ) : (
    <>
      <Table
        rows={data ? [data] : []}
        columns={ldBlocksColumns}
        loading={loading}
        error={!!error}
        label={"LD Blocks"}
        emptyTableFallback={"Error fetching information about this study"}
        //temp fix to get visual loading state without specifying height once loaded. See https://github.com/weng-lab/web-components/issues/22
        divHeight={!data ? { height: "182px" } : undefined}
        slotProps={{
          toolbar: {
            labelTooltip:
              "LD Blocks are regions of the genome where genetic variants are inherited together due to high levels of linkage disequilibrium (LD)",
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
