import { Box } from "@mui/material";
import { Treemap, TreemapNode } from "@weng-lab/visualization";
import PlotTooltip from "common/components/PlotTooltip";
import { ParentTermMetadata, subdisease_treemap, tree } from "./gwasTreeMappings";

const treemapStyle = {
  padding: 8,
  borderRadius: 5,
  paddingOuter: 1,
  opacity: 0.5,
};

const tooltipBody = (node: TreemapNode<ParentTermMetadata>) => (
  <PlotTooltip title={node.label} rows={[{ label: "Studies", value: node.value }]} />
);

type GWASTreemapProps = {
  activeCategory: string | null;
  onNodeClicked: (node: TreemapNode<ParentTermMetadata>) => void;
};

export default function GWASTreemap({ activeCategory, onNodeClicked }: GWASTreemapProps) {
  return (
    <Box sx={{ height: 400, width: "100%", overflow: "hidden" }}>
      <Treemap
        key={activeCategory || "root"}
        onNodeClicked={onNodeClicked}
        tooltipBody={tooltipBody}
        data={activeCategory ? subdisease_treemap[activeCategory] : tree}
        animation="scale"
        labelPlacement="topLeft"
        treemapStyle={treemapStyle}
      />
    </Box>
  );
}
