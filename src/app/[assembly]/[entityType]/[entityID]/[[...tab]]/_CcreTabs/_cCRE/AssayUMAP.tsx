import { Box } from "@mui/system";
import { BarData, BarPlot, Point, ScatterPlot } from "@weng-lab/visualization";
import { SharedAssayViewPlotProps } from "./AssayView";
import { capitalizeFirstLetter, truncateString } from "common/utility";
import { tissueColors } from "common/lib/colors";
import { Assay, BiosampleRow, formatAssay } from "./BiosampleActivity";
import { useMemo } from "react";
import { gql } from "types/generated";
import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { scaleLinear } from '@visx/scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

const BIOSAMPLE_UMAP = gql(`
  query BiosampleUmap($assembly: String!, $assay: String!) {
    ccREBiosampleQuery(assay: [$assay], assembly: $assembly) {
      biosamples {
        name
        umap_coordinates(assay: $assay)
      }
    }
  }
`);

const TooltipBody = ({metaData, assay}: {metaData: BiosampleRow, assay: Assay}) => {
  return (
    <>
      <Typography>
        <b>Sample:</b> {metaData.displayname}
      </Typography>
      <Typography>
        <b>Organ/Tissue:</b> {metaData.ontology}
      </Typography>
      <Typography>
        <b>Sample Type:</b> {metaData.sampleType}
      </Typography>
      <Typography>
        <b>{formatAssay(assay) }:</b> {metaData[assay]}
      </Typography>
    </>
  );
};

const AssayUMAP = ({
  entity,
  rows,
  columns,
  assay,
  selected,
  setSelected,
  sortedFilteredData,
  setSortedFilteredData,
}: SharedAssayViewPlotProps) => {
  const {
    data: data_umap,
    loading: loading_umap,
    error: error_umap,
  } = useQuery(BIOSAMPLE_UMAP, {
    variables: {
      assembly: entity.assembly.toLowerCase(),
      assay,
    },
  });

  const minValue = rows ? Math.min(...rows.map(x => x[assay])) : null
  const maxValue = rows ? Math.max(...rows.map(x => x[assay])) : null

  const colorScale = useMemo(() => {
    if (!minValue || !maxValue) return null
    return scaleLinear({
      domain: [Math.max(minValue, -1), maxValue],
      range: [0, 1]
    })
  }, [maxValue, minValue])

  const scatterData: Point<BiosampleRow>[] = useMemo(() => {
    if (!rows || !data_umap || !colorScale) return [];

    const isHighlighted = (x: BiosampleRow) => selected.some((y) => y.name === x.name);

    return rows
      .map((x) => {
        // const gradientColor = interpolateYlOrRd(colorScale(logTransform(x.value)));
        const coords = data_umap.ccREBiosampleQuery.biosamples.find(
          (sample) => sample.name === x.name
        )?.umap_coordinates;
        return {
          x: coords[0] ?? 0,
          y: coords[1] ?? 0,
          shape: "circle" as const,
          r: isHighlighted(x) ? 4 : 2,
          color:
            isHighlighted(x) || selected.length === 0 ? interpolateYlOrRd(colorScale(x[assay])) : "#CCCCCC",
          metaData: x,
        };
      })
      .sort((a, b) => (isHighlighted(b.metaData) ? -1 : 0));
  }, [rows, data_umap, selected, colorScale, assay]);

  /**
   * @todo potential bug. Assumes reference equality between rows returned in callback and in state
   */
  const handlePointClick = (point: Point<BiosampleRow>) => {
    if (selected.includes(point.metaData)) {
      setSelected(selected.filter((x) => x.name !== point.metaData.name));
    } else setSelected([...selected, point.metaData]);
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <ScatterPlot
        pointData={scatterData}
        onPointClicked={handlePointClick}
        selectable
        loading={loading_umap}
        miniMap={{
          position: {
            right: 50,
            bottom: 50,
          },
        }}
        groupPointsAnchor="ontology"
        tooltipBody={(point) => <TooltipBody metaData={point.metaData} assay={assay} />}
      />
    </Box>
  );
};

export default AssayUMAP;
