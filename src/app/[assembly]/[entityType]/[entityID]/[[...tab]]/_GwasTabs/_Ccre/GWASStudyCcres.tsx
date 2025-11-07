"use client";
import { useGWASSnpsIntersectingcCREsData } from "common/hooks/useGWASSnpsIntersectingcCREsData";
import { useMemo, useState } from "react";
import { Table, GridColDef } from "@weng-lab/ui-components";
import { CancelRounded } from "@mui/icons-material";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import { RegistryBiosamplePlusRNA } from "common/components/BiosampleTables/types";
import { Typography, Box, Button, Stack, IconButton, Tooltip } from "@mui/material";
import BiosampleSelectModal from "common/components/BiosampleSelectModal";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGWASStudyData } from "common/hooks/useGWASStudyData";

const GWASStudyCcres = ({ entity }: EntityViewComponentProps) => {
  const { data, loading, error } = useGWASStudyData({ studyid: [entity.entityID] });

  //Not really sure how this works, but only way to anchor the popper since the extra toolbarSlot either gets unrendered or unmouted after
  //setting the anchorEl to the button
  const [virtualAnchor, setVirtualAnchor] = useState<{
    getBoundingClientRect: () => DOMRect;
  } | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (virtualAnchor) {
      // If already open, close it
      setVirtualAnchor(null);
    } else {
      // Open it, store the current position
      const rect = event.currentTarget.getBoundingClientRect();
      setVirtualAnchor({
        getBoundingClientRect: () => rect,
      });
    }
  };

  const handleClickClose = () => {
    if (virtualAnchor) {
      setVirtualAnchor(null);
    }
  };
  const [selectedBiosample, setSelectedBiosample] = useState<RegistryBiosamplePlusRNA | null>(null);
  const {
    data: dataGWASSNPscCREs,
    loading: loadingGWASSNPscCREs,
    error: errorGWASSNPscCREs,
  } = useGWASSnpsIntersectingcCREsData({ studyid: [entity.entityID] });

  const {
    data: dataCcreDetails,
    loading: loadingCcreDetails,
    error: errorCcreDetails,
  } = useCcreData({
    accession: dataGWASSNPscCREs ? dataGWASSNPscCREs?.map((d) => d.ccre) : [],
    assembly: "GRCh38",
    nearbygeneslimit: 1,
    cellType: selectedBiosample ? selectedBiosample.name : undefined,
  });

  const handleBiosampleSelected = (biosample: RegistryBiosamplePlusRNA | null) => {
    setSelectedBiosample(biosample);
  };

  const mergedData = useMemo(() => {
    if (!dataGWASSNPscCREs || !dataCcreDetails) return [];

    // Build a lookup for details
    const detailMap = new Map(dataCcreDetails.map((d) => [d.info.accession, d]));

    return dataGWASSNPscCREs.map((gwas) => ({
      ...gwas,
      nearestgenes: detailMap.get(gwas.ccre).nearestgenes || null,
      ctspecific: detailMap.get(gwas.ccre).ctspecific,
      dnase_zscore: detailMap.get(gwas.ccre).dnase_zscore,
      ctcf_zscore: detailMap.get(gwas.ccre).ctcf_zscore,
      atac_zscore: detailMap.get(gwas.ccre).atac_zscore,
      enhancer_zscore: detailMap.get(gwas.ccre).enhancer_zscore,
      promoter_zscore: detailMap.get(gwas.ccre).promoter_zscore,
    }));
  }, [dataGWASSNPscCREs, dataCcreDetails]);
  const showAtac = selectedBiosample ? (selectedBiosample && selectedBiosample.atac ? true : false) : true;
  const showCTCF = selectedBiosample ? (selectedBiosample && selectedBiosample.ctcf ? true : false) : true;
  const showDNase = selectedBiosample ? (selectedBiosample && selectedBiosample.dnase ? true : false) : true;
  const showH3k27ac = selectedBiosample ? (selectedBiosample && selectedBiosample.h3k27ac ? true : false) : true;
  const showH3k4me3 = selectedBiosample ? (selectedBiosample && selectedBiosample.h3k4me3 ? true : false) : true;

  const ldblocks_columns: GridColDef<typeof data>[] = useMemo(
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

  const columns: GridColDef<(typeof mergedData)[number]>[] = useMemo(
    () => [
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
            <>
              <LinkComponent href={`/GRCh38/variant/${rsID}`} key={rsID}>
                {rsID}
              </LinkComponent>
              {index < rsIDs.length - 1 ? ", " : ""}
            </>
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
      {
        field: "nearestgenes",
        headerName: "Nearest Gene",
        valueGetter: (_, row) => `${row.nearestgenes[0].gene} - ${row.nearestgenes[0].distance.toLocaleString()} bp`,
        renderCell: (params) => (
          <span>
            <LinkComponent href={`/GRCh38/gene/${params.row.nearestgenes[0].gene}`}>
              <i>{params.row.nearestgenes[0].gene}</i>
            </LinkComponent>
            &nbsp;- {params.row.nearestgenes[0].distance.toLocaleString()} bp
          </span>
        ),
      },
      ...(showDNase
        ? [
            {
              field: "dnase",
              type: "number" as const,
              headerName: selectedBiosample ? "DNase" : "DNase Max Z",
              valueGetter: (_, row) =>
                selectedBiosample && selectedBiosample.dnase
                  ? row.ctspecific.dnase_zscore.toFixed(2)
                  : row.dnase_zscore.toFixed(2),
            },
          ]
        : []),
      ...(showAtac
        ? [
            {
              field: "atac",
              type: "number" as const,
              headerName: selectedBiosample ? "ATAC" : "ATAC Max Z",
              valueGetter: (_, row) =>
                selectedBiosample && selectedBiosample.atac
                  ? row.ctspecific.atac_zscore.toFixed(2)
                  : row.atac_zscore.toFixed(2),
            },
          ]
        : []),
      ...(showH3k4me3
        ? [
            {
              field: "h3k4me3",
              type: "number" as const,
              headerName: selectedBiosample ? "H3K4me3" : "H3K4me3 Max Z",
              valueGetter: (_, row) =>
                selectedBiosample && selectedBiosample.h3k4me3
                  ? row.ctspecific.h3k4me3_zscore.toFixed(2)
                  : row.promoter_zscore.toFixed(2),
            },
          ]
        : []),
      ...(showH3k27ac
        ? [
            {
              field: "h3k27ac",
              type: "number" as const,
              headerName: selectedBiosample ? "H3K27ac" : "H3K27ac Max Z",
              valueGetter: (_, row) =>
                selectedBiosample && selectedBiosample.h3k27ac
                  ? row.ctspecific.h3k27ac_zscore.toFixed(2)
                  : row.enhancer_zscore.toFixed(2),
            },
          ]
        : []),
      ...(showCTCF
        ? [
            {
              field: "ctcf",
              type: "number" as const,
              headerName: selectedBiosample ? "CTCF" : "CTCF Max Z",
              valueGetter: (_, row) =>
                selectedBiosample && selectedBiosample.ctcf
                  ? row.ctspecific.ctcf_zscore.toFixed(2)
                  : row.ctcf_zscore.toFixed(2),
            },
          ]
        : []),
    ],
    [selectedBiosample, showAtac, showCTCF, showDNase, showH3k27ac, showH3k4me3]
  );

  return errorGWASSNPscCREs || errorCcreDetails || error ? (
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
        labelTooltip={
          "LD Blocks are regions of the genome where genetic variants are inherited together due to high levels of linkage disequilibrium (LD)"
        }
      />
      {selectedBiosample && (
        <Stack
          borderRadius={1}
          direction={"row"}
          justifyContent={"space-between"}
          sx={{ backgroundColor: (theme) => theme.palette.secondary.light }}
          alignItems={"center"}
          width={"fit-content"}
        >
          <Typography sx={{ color: "#2C5BA0", pl: 1 }}>
            <b>Selected Biosample: </b>
            {" " +
              selectedBiosample.ontology.charAt(0).toUpperCase() +
              selectedBiosample.ontology.slice(1) +
              " - " +
              selectedBiosample.displayname}
          </Typography>
          <IconButton onClick={() => handleBiosampleSelected(null)}>
            <CancelRounded />
          </IconButton>
        </Stack>
      )}
      <Table
        showToolbar
        rows={mergedData}
        columns={columns}
        loading={loadingGWASSNPscCREs || loadingCcreDetails}
        label={`Intersecting cCREs`}
        emptyTableFallback={"No Intersecting cCREs found against SNPs identified by GWAS study"}
        initialState={{
          sorting: {
            sortModel: [{ field: "rsquare", sort: "desc" }],
          },
        }}
        divHeight={{ height: "600px" }}
        labelTooltip={"cCREs intersected against SNPs identified by selected GWAS study"}
        toolbarSlot={
          <Tooltip title="Advanced Filters">
            <Button variant="outlined" onClick={handleClick}>
              Select Biosample
            </Button>
          </Tooltip>
        }
      />
      <Box
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation();
        }}
      >
        <BiosampleSelectModal
          assembly={"GRCh38"}
          open={Boolean(virtualAnchor)}
          setOpen={handleClickClose}
          initialSelected={selectedBiosample ? [selectedBiosample] : []}
          onChange={(selected) => handleBiosampleSelected(selected[0])}
        />
      </Box>
    </>
  );
};
export default GWASStudyCcres;
