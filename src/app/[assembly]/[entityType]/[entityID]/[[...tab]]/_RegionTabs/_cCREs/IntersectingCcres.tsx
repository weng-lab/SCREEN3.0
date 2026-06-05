"use client";
import Image from "next/image";
import { Button, Stack, Tooltip, Skeleton } from "@mui/material";
import { useCcreData } from "common/hooks/useCcreData";
import { Table, TableColDef, EncodeBiosample } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { useMemo, useState } from "react";
import { SelectedBiosampleCard } from "common/components/SelectedBiosampleCard";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { decodeRegions, parseGenomicRangeString } from "common/utility";
import { BiosampleSelectDialog } from "common/components/BiosampleSelectDialog";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";
import { getProportionsFromArray, ProportionsBar } from "@weng-lab/visualization";
import { CCRE_CLASSES, CLASS_DESCRIPTIONS } from "common/consts";
import { CLASS_COLORS } from "common/colors";
import { useCcreZScores } from "common/hooks/useCcreZScores";
import { useCcreIsIcre } from "common/hooks/useCcreIsIcre";
import { CcreAssay } from "common/types/globalTypes";

const IntersectingCcres = ({ entity }: EntityViewComponentProps) => {
  const [selectedBiosample, setSelectedBiosample] = useState<EncodeBiosample>(null);
  const [biosampleSelectOpen, setBiosampleSelectOpen] = useState(false);

  const handleClickClose = () => {
    setBiosampleSelectOpen(false);
  };

  const handleBiosampleSelected = (biosample: EncodeBiosample) => {
    setSelectedBiosample(biosample);
  };

  // if bed upload extract from sessionStorage else it's a region so parse from entityID
  const coordinates = useMemo(() => {
    if (entity.entityType === "bed") {
      if (typeof window === "undefined") return null;
      const encoded = sessionStorage.getItem(entity.entityID);
      return decodeRegions(encoded);
    } else if (entity.entityType === "region") return [parseGenomicRangeString(entity.entityID)];
  }, [entity.entityID, entity.entityType]);

  const { data: dataIntersectingCcres, loading: loadingIntersectingCcres, error: errorIntersectingCcres } = useCcreData({
    coordinates,
    assembly: entity.assembly,
  });

  const accessions = useMemo(() => dataIntersectingCcres?.map((x) => x.accession) ?? [], [dataIntersectingCcres]);

  const { data: dataZScores, loading: loadingZScores, error: errorZScores } = useCcreZScores({
    accessions,
    assembly: entity.assembly,
    biosample: selectedBiosample ? selectedBiosample.name : undefined,
    skip: accessions.length === 0,
  });

  const { data: dataIsIcre, loading: loadingIsIcre } = useCcreIsIcre({
    accessions,
    assembly: entity.assembly,
  });

  const zScoresLoading = loadingZScores || (!dataZScores && !errorZScores);

  type CcreRow = NonNullable<typeof dataIntersectingCcres>[number];

  const showAtac = !selectedBiosample || !!selectedBiosample.atac_experiment_accession;
  const showCTCF = !selectedBiosample || !!selectedBiosample.ctcf_experiment_accession;
  const showDNase = !selectedBiosample || !!selectedBiosample.dnase_experiment_accession;
  const showH3k27ac = !selectedBiosample || !!selectedBiosample.h3k27ac_experiment_accession;
  const showH3k4me3 = !selectedBiosample || !!selectedBiosample.h3k4me3_experiment_accession;

  const zScoreCol = (field: CcreAssay, headerName: string): TableColDef<CcreRow> => ({
    field,
    headerName,
    type: "number",
    display: "flex", //allows text-align: right from type: number to apply to block Skeleton
    valueGetter: (_, row) => dataZScores?.[row.accession]?.[field] ?? null,
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
      field: "accession",
      headerName: "Accession",
      valueGetter: (_, row) => row.accession,
      renderCell: (params) => (
        <LinkComponent href={`/${entity.assembly}/ccre/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "group",
      headerName: "Classification",
      ...ClassificationFormatting,
      valueGetter: (_, row) => (selectedBiosample ? dataZScores?.[row.accession]?.group ?? null : row.group),
      renderCell: (params) =>
        selectedBiosample && zScoresLoading ? (
          <Skeleton variant="text" width={80} />
        ) : (
          ClassificationFormatting.renderCell?.(params)
        ),
    },
    {
      field: "chromosome",
      headerName: "Chromosome",
      valueGetter: (_, row) => row.coordinates.chromosome,
    },
    {
      field: "start",
      headerName: "Start",
      type: "number",
      valueGetter: (_, row) => row.coordinates.start,
    },
    {
      field: "end",
      headerName: "End",
      type: "number",
      valueGetter: (_, row) => row.coordinates.end,
    },
    ...(showDNase ? [zScoreCol("dnase", "DNase")] : []),
    ...(showAtac ? [zScoreCol("atac", "ATAC")] : []),
    ...(showH3k4me3 ? [zScoreCol("h3k4me3", "H3K4me3")] : []),
    ...(showH3k27ac ? [zScoreCol("h3k27ac", "H3K27ac")] : []),
    ...(showCTCF ? [zScoreCol("ctcf", "CTCF")] : []),
    // TODO: Nearest Gene column is commented out pending a tightly-scoped closest-gene query
    // from the backend (the old `nearestgenes` field is not part of useCcreDataNew).
    // {
    //   field: "nearestgene",
    //   headerName: "Nearest Gene",
    //   valueGetter: (_, row) => `${row.nearestgenes[0].gene} - ${row.nearestgenes[0].distance.toLocaleString()} bp`,
    //   renderCell: (params) => (
    //     <span>
    //       <LinkComponent href={`/${entity.assembly}/gene/${params.row.nearestgenes[0].gene}`}>
    //         <i>{params.row.nearestgenes[0].gene}</i>
    //       </LinkComponent>
    //       &nbsp;- {params.row.nearestgenes[0].distance.toLocaleString()} bp
    //     </span>
    //   ),
    // },
    {
      field: "isicre",
      headerName: "iCRE",
      valueGetter: (_, row) => dataIsIcre?.[row.accession] ?? false,
      renderCell: (params) => {
        if (loadingIsIcre) return <Skeleton variant="text" width={20} />;
        return params.value ? (
          <LinkComponent href={`https://igscreen.vercel.app/icre/${params.row.accession}`} openInNewTab>
            <Image
              src="/igSCREEN_icon.png"
              alt="igSCREEN Helix"
              height={14}
              width={14}
              style={{ verticalAlign: "text-bottom" }} // try "sub" if you want it lower
            />
          </LinkComponent>
        ) : (
          <></>
        );
      },
    },
  ];

  const proportionsBarData = useMemo(() => {
    if (selectedBiosample){
      if (!dataZScores) return {}
      return getProportionsFromArray(Object.values(dataZScores), "group", CCRE_CLASSES)
    } else {
      if (!dataIntersectingCcres) return {}
      return getProportionsFromArray(dataIntersectingCcres, "group", CCRE_CLASSES)
    }
  }, [selectedBiosample, dataZScores, dataIntersectingCcres])

  return (
    <Stack spacing={1}>
      {selectedBiosample && (
        <SelectedBiosampleCard biosample={selectedBiosample} onClear={() => handleBiosampleSelected(null)} />
      )}
      <ProportionsBar
        data={proportionsBarData}
        label="Classification Proportions"
        loading={selectedBiosample ? zScoresLoading : loadingIntersectingCcres}
        getColor={(key) => CLASS_COLORS[key]}
        formatLabel={(key) => CLASS_DESCRIPTIONS[key]}
        tooltipTitle="Classification Proportions, Core Collection"
        sortDescending
      />
      <Table
        showToolbar
        rows={dataIntersectingCcres}
        columns={columns}
        loading={loadingIntersectingCcres}
        error={!!errorIntersectingCcres}
        label={`Intersecting cCREs`}
        emptyTableFallback={"No intersecting cCREs found in this region"}
        slotProps={{
          toolbar: {
            extra: (
              <Tooltip title="Advanced Filters">
                <Button variant="outlined" onClick={() => setBiosampleSelectOpen(true)}>
                  Select Biosample
                </Button>
              </Tooltip>
            ),
          },
        }}
        initialState={{ sorting: { sortModel: [{ field: "start", sort: "asc" }] } }}
        divHeight={{ height: "600px" }}
      />
      <BiosampleSelectDialog
        assembly={entity.assembly}
        open={biosampleSelectOpen}
        onClose={handleClickClose}
        onSelectionChange={handleBiosampleSelected}
        selected={selectedBiosample}
      />
    </Stack>
  );
};

export default IntersectingCcres;
