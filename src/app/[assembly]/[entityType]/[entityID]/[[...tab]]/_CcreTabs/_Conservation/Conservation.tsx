"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GridColDef, GridRenderCellParams, Table} from "@weng-lab/ui-components";
import { Box } from "@mui/material";
import { ScatterChart } from "@mui/x-charts";
import Image from "next/image";
import AllcCREs from "../../../../../../../../public/AllcCREs.png";
import PromoterImg from "../../../../../../../../public/Promoter.png";
import ProximalEnhancerImg from "../../../../../../../../public/ProximalEnhancer.png";
import CACTCFImg from "../../../../../../../../public/CA-CTCF.png";
import CAH3K4me3Img from "../../../../../../../../public/CA-H3K4me3.png";
import CATFImg from "../../../../../../../../public/CA-TF.png";
import CAImg from "../../../../../../../../public/CA.png";
import DistalEnhancerImg from "../../../../../../../../public/DistalEnhancer.png";
import TFImg from "../../../../../../../../public/TF.png";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { gql } from "common/types/generated";
import { LinkComponent } from "common/components/LinkComponent";
import { useCcreData } from "common/hooks/useCcreData";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useScreenshot } from "use-react-screenshot";

type orthologRow = {
  accession: string;
  chrom: string;
  start: number;
  stop: number;
};

type graphDataRow = {
  x: number;
  y: number;
  accession: string;
};

export const ORTHOLOG_QUERY = gql(`
  query orthologTab($assembly: String!, $accession: [String!]) {
    orthologQuery(accession: $accession, assembly: $assembly) {
      assembly
      accession
      ortholog {
        stop
        start
        chromosome
        accession
      }
    }
  }
`);

export const Conservation = ({ entity }: EntityViewComponentProps) => {
  const CONSERVATION_HEATMAP_QUERY = gql(`
query getconservationHeatmapCoords($accession: [String]!) {
  conservationHeatmapQuery(accession: $accession) {
    x_coord
    y_coord
    accession
    ccre_class
  }
}
`);

  const heatmapsRef = React.useRef<HTMLDivElement>(null);
  const [_, takeScreenshot] = useScreenshot();

  const download = () => {
    if (!heatmapsRef.current) return;

    takeScreenshot(heatmapsRef.current).then((img) => {
      const a = document.createElement("a");
      a.href = img;
      a.download = `${entity.entityID}.png`;
      a.click();
    });
  };

  const {
    data: heatmapData,
    loading: heatmapLoading,
    error: heatmapError,
  } = useQuery(CONSERVATION_HEATMAP_QUERY, {
    variables: { accession: [entity.entityID] },
  });

  const { loading, error, data } = useQuery(ORTHOLOG_QUERY, {
    variables: {
      assembly: entity.assembly === "GRCh38" ? "grch38" : "mm10",
      accession: entity.entityID,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const {
    data: dataCcre,
    loading: loadingCcre,
    error: errorCcre,
  } = useCcreData({
    assembly: entity.assembly,
    accession: [entity.entityID],
  });

  function filtercCREType(type: string) {
    switch (type) {
      case "PLS":
        return "Promoter";
      case "pELS":
        return "Proximal Enhancer";
      case "dELS":
        return "Distal Enhancer";
      case "CA":
        return "CA";
      case "CA-TF":
        return "CA-TF";
      case "CA-CTCF":
        return "CA-CTCF";
      case "CA-H3K4me3":
        return "CA-H3K4me3";
      case "TF":
        return "TF";
      default:
        return "";
    }
  }
  // current cCRE's type to determine which plot to show
  const cCREType = filtercCREType(dataCcre?.[0].pct ?? "");

  const imgSrc =
    cCREType === "Promoter"
      ? PromoterImg
      : cCREType === "Proximal Enhancer"
        ? ProximalEnhancerImg
        : cCREType === "CA-CTCF"
          ? CACTCFImg
          : cCREType === "CA-H3K4me3"
            ? CAH3K4me3Img
            : cCREType === "CA-TF"
              ? CATFImg
              : cCREType === "CA"
                ? CAImg
                : cCREType === "Distal Enhancer"
                  ? DistalEnhancerImg
                  : cCREType === "TF"
                    ? TFImg
                    : AllcCREs;

  const imageWidth = 250;
  const imageHeight = imageWidth * (imgSrc.height / imgSrc.width);

  const scalePoints = {
    left: -40,
    right: 5,
    top: 5,
    bottom: -22,
  };

  const graphData: graphDataRow[] =
    heatmapData?.conservationHeatmapQuery?.map((row) => ({
      x: row.x_coord,
      y: row.y_coord,
      accession: row.accession,
    })) ?? [];

  const ortholog: orthologRow[] = [];
  if (data && data.orthologQuery.length > 0) {
    for (const ccre of data.orthologQuery[0].ortholog) {
      ortholog.push({
        accession: ccre.accession,
        chrom: ccre.chromosome,
        start: ccre.start,
        stop: ccre.stop,
      });
    }
  }

  const cols: GridColDef[] = [
    {
      headerName: "Accession",
      field: "accession",
      renderCell: (params: GridRenderCellParams) => (
        <LinkComponent href={`/${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}/ccre/${params.row.accession}`}>
          {params.value}
        </LinkComponent>
      ),
    },
    {
      headerName: "Chromosome",
      field: "chrom",
    },
    {
      headerName: "Start",
      field: "start",
    },
    {
      headerName: "Stop",
      field: "stop",
    },
  ];

  const conservationCols: GridColDef[] = [
    {
      headerName: "Vertebrates",
      field: "vertebrates",
      valueFormatter: (value: number) => value.toFixed(2),
    },
    {
      headerName: "Mammals",
      field: "mammals",
      valueFormatter: (value: number) => value.toFixed(2),
    },
    {
      headerName: "Primates",
      field: "primates",
      valueFormatter: (value: number) => value.toFixed(2),
    },
  ];

  return (
    <>
      {entity.assembly == "GRCh38" && dataCcre && (
        <Table
          label={`Conservation`}
          loading={loadingCcre}
          error={!!errorCcre}
          columns={conservationCols}
          rows={dataCcre}
          hideFooter
          //showToolbar={false}
          emptyTableFallback={"No Conservation data found"}
        />
      )}
      <Table
        label={`Orthologous cCREs in ${entity.assembly == "GRCh38" ? "mm10" : "GRCh38"}`}
        loading={loading}
        error={!!error}
        columns={cols}
        rows={ortholog}
        emptyTableFallback={"No Orthologous cCREs found"}
      />
      {heatmapLoading && entity.assembly !== "mm10" && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      {graphData.length > 0 && entity.assembly !== "mm10" && (
        <Box>
          <Box sx={{ marginBottom: "5px" }}>
            <Button variant="outlined" color="primary" size="small" onClick={download}>
              Download Plots
            </Button>
          </Box>
          <Box ref={heatmapsRef}>
            <Box sx={{ display: "flex", gap: 5, flexDirection: { xs: "column", md: "row" } }}>
              <Box>
                <Box>All cCRE Regions</Box>
                <Box sx={{ position: "relative", width: imageWidth, height: imageHeight }}>
                  <Image src={AllcCREs} alt="All cCRE Regions plot" fill unoptimized />
                  <ScatterChart
                    width={imageWidth}
                    height={imageHeight}
                    margin={scalePoints}
                    hideLegend
                    xAxis={[{ min: 0, max: 240, tickSize: 0, tickLabelStyle: { display: "none" } }]}
                    yAxis={[{ min: 0, max: 240, tickSize: 0, tickLabelStyle: { display: "none" } }]}
                    series={[
                      {
                        data: graphData,
                        valueFormatter: (v: graphDataRow) => v?.accession ?? "",
                        color: "red",
                        highlightScope: { highlight: "item" },
                      },
                    ]}
                  />
                </Box>
              </Box>
              <Box>
                <Box>{cCREType}</Box>
                <Box sx={{ position: "relative", width: imageWidth, height: imageHeight }}>
                  <Image src={imgSrc} alt="specific cCRE plot" fill unoptimized />
                  <ScatterChart
                    width={imageWidth}
                    height={imageHeight}
                    margin={scalePoints}
                    hideLegend
                    xAxis={[{ min: 0, max: 240, tickSize: 0, tickLabelStyle: { display: "none" } }]}
                    yAxis={[{ min: 0, max: 240, tickSize: 0, tickLabelStyle: { display: "none" } }]}
                    series={[
                      {
                        data: graphData,
                        valueFormatter: (v: graphDataRow) => v?.accession ?? "",
                        color: "red",
                        highlightScope: { highlight: "item" },
                      },
                    ]}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
