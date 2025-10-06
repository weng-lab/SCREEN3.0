import { useGWASSnpsIntersectingcCREsData } from "common/hooks/useGWASSnpsIntersectingcCREsData";
import { useMemo, useState } from "react";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Table } from "@weng-lab/ui-components";
import { CancelRounded } from "@mui/icons-material";
import { LinkComponent } from "common/components/LinkComponent";
import InfoIcon from "@mui/icons-material/Info";
import { useCcreData } from "common/hooks/useCcreData";
import { RegistryBiosample } from "common/components/BiosampleTables/types";
import { Typography, Box, Button, Stack, IconButton, Tooltip } from "@mui/material";
import ConfigureGBModal from "common/components/ConfigureGBModal";
import { RegistryBiosamplePlusRNA } from "common/_utility/types";
export type CcreGWASStudySNPsProps = {
  study_name: string;
  totalldblocks: number;
};

const CcreGWASStudySNPs = ({ study_name, totalldblocks }: CcreGWASStudySNPsProps) => {
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
  const [selectedBiosample, setSelectedBiosample] = useState<RegistryBiosample | null>(null);
  const {
    data: dataGWASSNPscCREs,
    loading: loadingGWASSNPscCREs,
    error: errorGWASSNPscCREs,
  } = useGWASSnpsIntersectingcCREsData({ study: [study_name] });

  const {
    data: dataCcreDetails,
    loading: loadingCcreDetails,
    error: errorCcreDetails,
  } = useCcreData({
    accession: dataGWASSNPscCREs ? dataGWASSNPscCREs?.map((d) => d.accession) : [],
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
      nearestgenes: detailMap.get(gwas.accession).nearestgenes || null,
      ctspecific: detailMap.get(gwas.accession).ctspecific,
      dnase_zscore:  detailMap.get(gwas.accession).dnase_zscore,
      ctcf_zscore:  detailMap.get(gwas.accession).ctcf_zscore,
      atac_zscore:  detailMap.get(gwas.accession).atac_zscore,
      enhancer_zscore:  detailMap.get(gwas.accession).enhancer_zscore,
      promoter_zscore:  detailMap.get(gwas.accession).promoter_zscore,
      
    }));
  }, [dataGWASSNPscCREs, dataCcreDetails]);
  const showAtac = selectedBiosample ? (selectedBiosample && selectedBiosample.atac ? true : false) : true;
  const showCTCF = selectedBiosample ? (selectedBiosample && selectedBiosample.ctcf ? true : false) : true;
  const showDNase = selectedBiosample ? (selectedBiosample && selectedBiosample.dnase ? true : false) : true;
  const showH3k27ac = selectedBiosample ? (selectedBiosample && selectedBiosample.h3k27ac ? true : false) : true;
  const showH3k4me3 = selectedBiosample ? (selectedBiosample && selectedBiosample.h3k4me3 ? true : false) : true;

  const ldblocks_columns: GridColDef<
    { total_ldblocks: number; ldblocks_overlapping_ccres: number; overlapping_ccres: number }[][number]
  >[] = [
    {
      field: "total_ldblocks",
      renderHeader: () => (
        <strong>
          <p>Total LD blocks</p>
        </strong>
      ),
      valueGetter: (_, row) => {
        return row.total_ldblocks;
      },
    },
    {
      field: "ldblocks_overlapping_ccres",
      renderHeader: () => (
        <strong>
          <p># of LD blocks overlapping cCREs</p>
        </strong>
      ),
      valueGetter: (_, row) =>
        row.ldblocks_overlapping_ccres +
        " (" +
        Math.ceil((row.ldblocks_overlapping_ccres / +row.total_ldblocks) * 100) +
        "%)",
    },
    {
      field: "overlapping_ccres",
      renderHeader: () => (
        <strong>
          <p># of overlapping cCREs</p>
        </strong>
      ),
      valueGetter: (_, row) => row.overlapping_ccres,
    },
  ];
  const columns: GridColDef<(typeof mergedData)[number]>[] = [
    {
      field: "accession",
      renderHeader: () => (
        <strong>
          <p>Accession</p>
        </strong>
      ),
      valueGetter: (_, row) => {
        return row.accession;
      },
      renderCell: (params) => (
        <LinkComponent href={`/GRCh38/ccre/${params.value}`}>
          <i>{params.value}</i>
        </LinkComponent>
      ),
    },
    {
      field: "snpid",
      renderHeader: () => (
        <strong>
          <p>SNP</p>
        </strong>
      ),
      valueGetter: (_, row) => row.snpid,
    },

    {
      field: "ldblocksnpid",
      renderHeader: () => (
        <strong>
          <p>LD Block SNP ID</p>
        </strong>
      ),
      valueGetter: (_, row) => row.ldblocksnpid,
    },

    {
      field: "rsquare",
      renderHeader: () => (
        <strong>
          <p>
            <i>R</i>
            <sup>2</sup>
          </p>
        </strong>
      ),
      valueGetter: (_, row) => row.rsquare,
    },
    {
      field: "nearestgenes",
      renderHeader: () => (
        <strong>
          <p>Nearest&nbsp;Gene</p>
        </strong>
      ),
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
    ...(showAtac
      ? [
          {
            field:
              selectedBiosample && selectedBiosample.atac ? "ctspecific.atac_zscore" : "atac_zscore",
            renderHeader: () => {
            const headerVal = selectedBiosample && selectedBiosample.atac ? "ATAC" : "ATAC max Z"
              return(
              <strong>
                <p>{headerVal}</p>
              </strong>
            )},
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.atac
                ? row.ctspecific.atac_zscore.toFixed(2)
                : row.atac_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showH3k27ac
      ? [
          {
            field:
              selectedBiosample && selectedBiosample.h3k27ac
                ? "ctspecific.enhancer_zscore"
                : "enhancer_zscore",
            renderHeader: () => { 
              const headerVal = selectedBiosample && selectedBiosample.h3k27ac ? "H3k27ac" : "H3k27ac max Z"
              return (
              <strong>
                <p>{headerVal}</p>
              </strong>
            )},
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.h3k27ac
                ? row.ctspecific.enhancer_zscore.toFixed(2)
                : row.enhancer_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showH3k4me3
      ? [
          {
            field:
              selectedBiosample && selectedBiosample.h3k4me3
                ? "ctspecific.promoter_zscore"
                : "promoter_zscore",
            renderHeader: () => { 
              const headerVal = selectedBiosample && selectedBiosample.h3k4me3 ? "H3k4me3" : "H3k4me3 max Z"
              return (
              <strong>
                <p>{headerVal}</p>
              </strong>
            )},
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.h3k4me3
                ? row.ctspecific.promoter_zscore.toFixed(2)
                : row.promoter_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showCTCF
      ? [
          {
            field:
              selectedBiosample && selectedBiosample.ctcf ? "ctspecific.ctcf_zscore" : "ctcf_zscore",
            renderHeader: () => {
              const headerVal = selectedBiosample && selectedBiosample.ctcf ? "CTCF" : "CTCF max Z"
              return(
              <strong>
                <p>{headerVal}</p>
              </strong>
            )},
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.ctcf
                ? row.ctspecific.ctcf_zscore.toFixed(2)
                : row.ctcf_zscore.toFixed(2),
          },
        ]
      : []),
    ...(showDNase
      ? [
          {
            field:
              selectedBiosample && selectedBiosample.dnase ? "ctspecific.dnase_zscore" : "dnase_zscore",
            renderHeader: () => {
              const headerVal = selectedBiosample && selectedBiosample.dnase ? "DNase" : "DNase max Z"
              return(
              <strong>
                <p>{headerVal}</p>
              </strong>
            )},
            valueGetter: (_, row) =>
              selectedBiosample && selectedBiosample.dnase
                ? row.ctspecific.dnase_zscore.toFixed(2)
                : row.dnase_zscore.toFixed(2),
          },
        ]
      : []),
  ];
  const ldblocks_data = [
    {
      total_ldblocks: totalldblocks,
      ldblocks_overlapping_ccres: dataGWASSNPscCREs
        ? [
            ...new Set([
              ...dataGWASSNPscCREs.map((c) => {
                return +c.ldblock;
              }),
            ]),
          ].length
        : 0,
      overlapping_ccres: dataGWASSNPscCREs ? [...new Set(dataGWASSNPscCREs.map((item) => item.accession))].length : 0,
    },
  ];
  return errorGWASSNPscCREs || errorCcreDetails ? (
    <Typography>Error Fetching Intersecting cCREs against SNPs identified by a GWAS study</Typography>
  ) : (
    <>
      <Table
        rows={ldblocks_data || []}
        columns={ldblocks_columns}
        loading={loadingGWASSNPscCREs}
        label={`LD Blocks`}
        emptyTableFallback={"No Intersecting cCREs found against SNPs identified by GWAS study"}
        divHeight={{ height: "100%", minHeight: "50px", maxHeight: "600px" }}
        labelTooltip={
          <Tooltip
            title={
              "LD Blocks are regions of the genome where genetic variants are inherited together due to high levels of linkage disequilibrium (LD)"
            }
          >
            <InfoIcon fontSize="inherit" />
          </Tooltip>
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
        rows={mergedData || []}
        columns={columns}
        loading={loadingGWASSNPscCREs || loadingCcreDetails}
        label={`Intersecting cCREs`}
        emptyTableFallback={"No Intersecting cCREs found against SNPs identified by GWAS study"}
        initialState={{
          sorting: {
            sortModel: [{ field: "rsquare", sort: "desc" }],
          },
        }}
        divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
        labelTooltip={
          <Tooltip title={"cCREs intersected against SNPs identified by selected GWAS study"}>
            <InfoIcon fontSize="inherit" />
          </Tooltip>
        }
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
        <ConfigureGBModal
          assembly={"GRCh38"}
          open={Boolean(virtualAnchor)}
          setOpen={handleClickClose}
          onBiosampleSelect={handleBiosampleSelected}
        />
      </Box>
    </>
  );
};
export default CcreGWASStudySNPs;
