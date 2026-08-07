import { Box } from "@mui/material";
import { Treemap, TreemapNode } from "@weng-lab/visualization";
import { ParentTermMetadata, subdisease_treemap, tree } from "./gwasTreeMappings";

const treemapStyle = {
  padding: 8,
  borderRadius: 5,
  paddingOuter: 1,
  opacity: 0.5,
};

const tooltipBody = (node: TreemapNode<ParentTermMetadata>) => (
  <Box maxWidth={300}>
    <div>
      <strong>{node.label}</strong>
    </div>
    <div>
      <strong>{node.value}</strong>
    </div>
  </Box>
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
