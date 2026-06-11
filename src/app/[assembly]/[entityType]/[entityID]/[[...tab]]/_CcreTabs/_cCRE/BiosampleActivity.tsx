"use client";
import React, { useMemo, useState } from "react";
import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { GridRenderCellParams, GridComparatorFn, gridNumberComparator } from "@mui/x-data-grid-premium";
import type { CcreAssay } from "common/types/globalTypes";
import { CLASS_COLORS } from "common/colors";
import type { EntityViewComponentProps } from "common/entityTabsConfig";
import { capitalizeFirstLetter } from "common/utility";
import AssayView from "./AssayView";
import { AssayWheel } from "@weng-lab/ui-components";
import { ProportionsBar, getProportionsFromArray } from "@weng-lab/visualization";
import { CCRE_CLASSES, CLASS_DESCRIPTIONS } from "common/consts";
import { BiosampleRow } from "./types";
import { useSilencersData } from "common/hooks/useSilencersData";
import { useDynamicEnhancersData } from "common/hooks/useDynamicEnhacersData";
import { Silencer_Studies } from "./consts";
import { LinkComponent } from "common/components/LinkComponent";
import { ClassificationFormatting } from "common/components/ClassificationFormatting";
import { useBiosampleActivity } from "common/hooks/useBiosampleActivity";

/** Row shape returned by useBiosampleActivity (new field names / undefined-for-missing) */
type RawBiosampleRow = NonNullable<ReturnType<typeof useBiosampleActivity>["biosampleRows"]>[number];

const toBiosampleRow = (row: RawBiosampleRow): BiosampleRow => ({
  name: row.name,
  displayname: row.displayname,
  sampleType: row.sampleType,
  lifeStage: row.lifeStage,
  ontology: row.ontology,
  group: row.group,
  collection: row.collection,
  tf: row.tf,
  dnase: row.dnaseZ,
  dnaseExpAccession: row.dnaseExpAccession,
  atac: row.atacZ,
  atacExpAccession: row.atacExpAccession,
  h3k4me3: row.h3k4me3Z,
  h3k4me3ExpAccession: row.h3k4me3ExpAccession,
  h3k27ac: row.h3k27acZ,
  h3k27acExpAccession: row.h3k27acExpAccession,
  ctcf: row.ctcfZ,
  ctcfExpAccession: row.ctcfExpAccession,
});

const zScoreFormatting: Partial<TableColDef> = {
  type: "number",
  minWidth: 100,
  renderCell: (params: GridRenderCellParams) => (params.value == null ? "--" : params.value.toFixed(2)),
  valueFormatter: (value: number) => (value == null ? "NA" : value),
  getSortComparator: (direction) => {
    const sign = direction === "desc" ? -1 : 1;
    const comparator: GridComparatorFn = (v1, v2, p1, p2) => {
      if (v1 == null && v2 == null) return 0;
      if (v1 == null) return 1; // missing always sorts after a real score
      if (v2 == null) return -1;
      return sign * gridNumberComparator(v1, v2, p1, p2);
    };
    return comparator;
  },
};

const ctAgnosticCols: TableColDef[] = [
  {
    headerName: "DNase max-Z",
    field: "dnase",
    ...zScoreFormatting,
  },
  {
    headerName: "ATAC max-Z",
    field: "atac",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K4me3 max-Z",
    field: "h3k4me3",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K27ac max-Z",
    field: "h3k27ac",
    ...zScoreFormatting,
  },
  {
    headerName: "CTCF max-Z",
    field: "ctcf",
    ...zScoreFormatting,
  },
  {
    headerName: "Classification",
    field: "group",
    ...ClassificationFormatting,
  },
];

const silencersDataCols: TableColDef[] = [
  {
    headerName: "Study",
    field: "study",
    valueGetter: (value, row) => row.study,
  },
  {
    headerName: "PMID",
    field: "pmid",
    valueGetter: (value, row) => row.pmid,
    renderCell: (params) => (
      <LinkComponent href={params.row.pubmed_link} showExternalIcon openInNewTab>
        {params.row.pmid}
      </LinkComponent>
    ),
  },
  {
    headerName: "Method",
    field: "method",
    valueGetter: (value, row) => row.method,
  },
];

const coreAndPartialCols: TableColDef[] = [
  {
    headerName: "Cell Type",
    field: "displayname",
    maxWidth: 400,
    valueFormatter: capitalizeFirstLetter,
  },
  {
    headerName: "Organ/Tissue",
    field: "ontology",
    valueFormatter: capitalizeFirstLetter,
  },
  {
    headerName: "Sample Type",
    field: "sampleType",
    valueFormatter: capitalizeFirstLetter,
  },
  {
    headerName: "Life Stage",
    field: "lifeStage",
  },
  {
    headerName: "DNase",
    field: "dnase",
    ...zScoreFormatting,
  },
  {
    headerName: "ATAC",
    field: "atac",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K4me3",
    field: "h3k4me3",
    ...zScoreFormatting,
  },
  {
    headerName: "H3K27ac",
    field: "h3k27ac",
    ...zScoreFormatting,
  },
  {
    headerName: "CTCF",
    field: "ctcf",
    ...zScoreFormatting,
  },
  {
    headerName: "TF",
    field: "tf",
    //Need to transform the internal value
    valueGetter: (value) => (value === "yes" ? "Yes" : value === "no" ? "No" : "--"),
  },
  {
    headerName: "Classification",
    field: "group",
    ...ClassificationFormatting,
  },
  {
    headerName: "Assays",
    field: " ",
    type: "number",
    valueGetter: (_, row) => Object.values(assayInfo(row)).filter((x) => x).length,
    renderCell: (params) => <AssayWheel row={assayInfo(params.row as BiosampleRow)} />,
  },
];

const assayInfo = (row: BiosampleRow) => {
  return {
    dnase: row.dnaseExpAccession,
    atac: row.atacExpAccession,
    h3k4me3: row.h3k4me3ExpAccession,
    h3k27ac: row.h3k27acExpAccession,
    ctcf: row.ctcfExpAccession,
  };
};

const ancillaryCols = coreAndPartialCols.filter((col) => col.field !== "dnase" && col.field !== "group");

const CORE_COLLECTION_TOOLTIP =
  "Thanks to the extensive coordination efforts by the ENCODE4 Biosample Working Group, 170 biosamples have DNase, H3K4me3, H3K27ac, and CTCF data. We refer to these samples as the biosample-specific Core Collection of cCREs. These samples cover a variety of tissues and organs and primarily comprise primary tissues and cells. We suggest that users prioritize these samples for their analysis as they contain all the relevant marks for the most complete annotation of cCREs.";

const PARTIAL_COLLECTION_TOOLTIP =
  "To supplement the Core Collection, 1,155 biosamples have DNase in addition to various combinations of the other marks (but not all three). Though we are unable to annotate the full spectrum of cCRE classes in these biosamples, having DNase enables us to annotate element boundaries with high resolution. Therefore, we refer to this group as the Partial Data Collection. In these biosamples, we classify elements using the available marks. For example, if a sample lacks H3K27ac and CTCF, its cCREs can only be assigned to the promoter, CA-H3K4me3, and CA groups, not the enhancer or CA-CTCF groups. The Partial Data Collection contains some unique tissues and cell states that are not represented in the Core Collection, such as fetal brain tissue and stimulated immune cells that may be of high interest to some researchers. Therefore, if users are interested in cCRE annotations in such biosamples, we suggest leveraging the cell type-agnostic annotations or annotations from similar biosamples in the Core Collection, to supplement their analyses.";

const ANCILLARY_COLLECTION_TOOLTIP =
  "For the 562 biosamples lacking DNase data, we do not have the resolution to identify specific elements and we refer to these annotations as the Ancillary Collection. In these biosamples, we simply label cCREs as having a high or low signal for every available assay. We highly suggest that users do not use annotations from the Ancillary Collection unless they are anchoring their analysis on cCREs from the Core Collection or Partial Data Collection.";

export const BiosampleActivity = ({ entity }: EntityViewComponentProps) => {
  // Assay values are used to index into row object, so need to modify assaySpecificRows if changing assays here
  const [tab, setTab] = useState<"tables" | "add_classification" | CcreAssay>("tables");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as "tables" | "add_classification" | "dnase" | "atac" | "h3k4me3" | "h3k27ac" | "ctcf");
  };

  const {
    biosampleRows: rawBiosampleRows,
    celltypeAgnosticRow,
    loading,
    error,
  } = useBiosampleActivity({ accession: entity.entityID, assembly: entity.assembly });

  const {
    data: silencersData,
    loading: loadingSilencersData,
    error: errorSilencersData,
  } = useSilencersData({ accession: [entity.entityID], assembly: entity.assembly });

  const {
    data: dynamicEnhancersData,
    loading: loadingDynamicEnhancersData,
    error: errorDynamicEnhancersData,
  } = useDynamicEnhancersData({ accession: [entity.entityID], assembly: entity.assembly });

  // Adapt the hook's rows (new field names, undefined-for-missing) to the BiosampleRow shape the
  // columns + Assay plot subsystem expect (bare assay-score field names, undefined for missing).
  const biosampleRows: BiosampleRow[] = useMemo(() => rawBiosampleRows?.map(toBiosampleRow), [rawBiosampleRows]);

  const coreCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "core");
  }, [biosampleRows]);

  const partialDataCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "partial");
  }, [biosampleRows]);

  const ancillaryCollection: BiosampleRow[] = useMemo(() => {
    return biosampleRows?.filter((row) => row.collection === "ancillary");
  }, [biosampleRows]);

  const assaySpecificRows: BiosampleRow[] = useMemo(() => {
    if (tab === "tables") return undefined;
    return biosampleRows?.filter((row) => row[tab] != null);
  }, [biosampleRows, tab]);

  const loadingCorePartialAncillary =
    loading || !coreCollection || !partialDataCollection || !ancillaryCollection;
  const errorCorePartialAncillary = !!error;

  const ctAgnosticRow = celltypeAgnosticRow
    ? [{ ...celltypeAgnosticRow, displayname: "Cell Type Agnostic" }]
    : undefined;

  const disableCsvEscapeChar = {
    toolbar: { csvOptions: { escapeFormulas: false }, excelOptions: { escapeFormulas: false } },
  };

  const partialCollectionChromAccess = useMemo(() => {
    if (!partialDataCollection) return;
    let highDNase = 0;
    let lowDNase = 0;
    partialDataCollection.forEach((row) => {
      if (row.dnase >= 1.64) {
        highDNase++;
      } else lowDNase++;
    });
    return { highDNase, lowDNase };
  }, [partialDataCollection]);

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        value={tab}
        onChange={handleChange}
        sx={{
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            opacity: 0.3,
          },
        }}
      >
        <Tab value="tables" label="Primary Classification" />
        <Tab value="add_classification" label="Additional Classification" />
        <Tab value="dnase" label="DNase" />
        <Tab value="atac" label="ATAC" />
        <Tab value="h3k4me3" label="H3K4me3" />
        <Tab value="h3k27ac" label="H3K27ac" />
        <Tab value="ctcf" label="CTCF" />
      </Tabs>
      {tab === "tables" ? (
        <Stack spacing={3} sx={{ mt: "0rem", mb: "0rem" }}>
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 400,
              color: "text.primary",
              pl: 1,
              ml: 0, // match table start
            }}
          >
            Cell Type Agnostic Classification
          </Typography>
          <Table
            rows={ctAgnosticRow}
            columns={ctAgnosticCols}
            loading={loading}
            error={!!error}
            autoHeight
            hideFooter
            showToolbar={false}
            slotProps={disableCsvEscapeChar}
          />
          <div>
            <ProportionsBar
              data={getProportionsFromArray(coreCollection, "group", CCRE_CLASSES)}
              label="Classification Proportions, Core Collection:"
              loading={loadingCorePartialAncillary || errorCorePartialAncillary}
              getColor={(key) => CLASS_COLORS[key]}
              formatLabel={(key) => CLASS_DESCRIPTIONS[key]}
              tooltipTitle="Classification Proportions, Core Collection"
              style={{ marginBottom: "8px" }}
            />
            <Table
              label="Core Collection"
              rows={coreCollection}
              columns={coreAndPartialCols}
              loading={loadingCorePartialAncillary}
              error={errorCorePartialAncillary}
              divHeight={{ height: "400px" }}
              initialState={{ sorting: { sortModel: [{ field: "dnase", sort: "desc" }] } }}
              slotProps={{
                toolbar: {
                  labelTooltip: CORE_COLLECTION_TOOLTIP,
                  ...disableCsvEscapeChar.toolbar,
                },
              }}
            />
          </div>
          <div>
            <ProportionsBar
              data={partialCollectionChromAccess}
              label="Chromatin Accessibility, Partial Data Collection:"
              loading={loadingCorePartialAncillary || errorCorePartialAncillary}
              getColor={(key) => (key === "highDNase" ? "#06DA93" : "#e1e1e1")}
              formatLabel={(key) =>
                key === "highDNase"
                  ? "High Chromatin Accessibility (DNase ≥ 1.64)"
                  : "Low Chromatin Accessibility (DNase < 1.64)"
              }
              tooltipTitle="Chromatin Accessibility, Partial Data Collection"
              style={{ marginBottom: "12px" }}
            />
            <Table
              label="Partial Data Collection"
              rows={partialDataCollection}
              columns={coreAndPartialCols}
              loading={loadingCorePartialAncillary}
              error={errorCorePartialAncillary}
              divHeight={{ height: "400px" }}
              initialState={{ sorting: { sortModel: [{ field: "dnase", sort: "desc" }] } }}
              slotProps={{
                toolbar: {
                  labelTooltip: PARTIAL_COLLECTION_TOOLTIP,
                  ...disableCsvEscapeChar.toolbar,
                },
              }}
            />
          </div>
          <Table
            label="Ancillary Collection"
            rows={ancillaryCollection}
            columns={ancillaryCols}
            loading={loadingCorePartialAncillary}
            error={errorCorePartialAncillary}
            divHeight={{ height: "400px" }}
            initialState={{ sorting: { sortModel: [{ field: "atac", sort: "desc" }] } }}
            slotProps={{
              toolbar: {
                labelTooltip: ANCILLARY_COLLECTION_TOOLTIP,
                ...disableCsvEscapeChar.toolbar,
              },
            }}
          />
        </Stack>
      ) : tab === "add_classification" ? (
        <Stack spacing={3} sx={{ mt: "0rem", mb: "0rem" }}>
          {dynamicEnhancersData && dynamicEnhancersData.length > 0 ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 400,
                  color: "text.primary",
                  pl: 1,
                  ml: 0,
                }}
              >
                {entity.entityID} is classified as MAFF/MAFK+ cCRE in{" "}
                {dynamicEnhancersData.length === 2
                  ? `${dynamicEnhancersData[0].celltype} and ${dynamicEnhancersData[1].celltype}`
                  : dynamicEnhancersData[0]?.celltype}{" "}
                cells
              </Typography>
              <br />
            </>
          ) : silencersData && silencersData.length > 0 ? (
            <Table
              label="Silencers"
              rows={
                silencersData?.flatMap((item) =>
                  item.silencer_studies.map((study) => ({
                    study: Silencer_Studies.find((s) => s.value == study).study,
                    pmid: Silencer_Studies.find((s) => s.value == study).pubmed_id,
                    method: Silencer_Studies.find((s) => s.value == study).method,
                    pubmed_link: Silencer_Studies.find((s) => s.value == study).pubmed_link,
                  }))
                ) || []
              }
              columns={silencersDataCols}
              loading={loadingSilencersData}
              error={!!errorSilencersData}
              {...disableCsvEscapeChar}
              hideFooter
            />
          ) : (
            <Typography
              variant="body1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 400,
                color: "text.primary",
                pl: 1,
                ml: 0, // match table start
              }}
            >
              No further classification details are available for {entity.entityID}.
            </Typography>
          )}
        </Stack>
      ) : (
        <AssayView rows={assaySpecificRows} columns={coreAndPartialCols} assay={tab} entity={entity} />
      )}
    </>
  );
};
