import { Box, Stack, styled } from "@mui/material";
import { useState } from "react";
import AnnotationsHeader from "./Header";
import AnnotationsByClass from "./AnnotationsByClass";
import AnnotationsGeneLinks from "./AnnotationsCcreGeneLinks";
import AnnotationsByCelltype from "./AnnotationsByCelltype";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, TreeItemProps } from "@mui/x-tree-view";
import AnnotationsOtherOrthologous from "./AnnotationsOtherOrthologous";
import AnnotationsContactUs from "./AnnotationsContactUs";
import AnnotationsFunctional from "./AnnotationsFunctional";
import AnnotationsGeneExpression from "./AnnotationsGeneExpression";
import { Assembly } from "common/types/globalTypes";

const StyledTreeItem = styled(TreeItem)<TreeItemProps>(({ theme }) => ({
  "& .MuiTreeItem-label": {
    fontSize: "14px",
  },
  //no space after '&' applies selector to root element
  "&.tree-category > .MuiTreeItem-content .MuiTreeItem-label": {
    fontSize: "16px",
    fontWeight: 600,
  },
  "& .Mui-selected": {
    color: theme.palette.primary.main,
    fontWeight: 900,
  },
}));

//The tree groups content by assembly, plus an "other" category that is not assembly specific
type TreeCategory = Assembly | "other";

function Content({ tab, category }: { tab: string; category: TreeCategory }) {
  //"other" only holds orthologous cCREs, so narrowing it off here leaves a real assembly below
  if (category === "other") {
    return <AnnotationsOtherOrthologous />;
  }

  switch (tab) {
    case "byClass":
      return <AnnotationsByClass assembly={category} />;
    case "byCelltype":
      return <AnnotationsByCelltype assembly={category} />;
    case "geneLinks":
      return <AnnotationsGeneLinks />;
    case "functional":
      return <AnnotationsFunctional assembly={category} />;
    case "geneExpression":
      return <AnnotationsGeneExpression assembly={category} />;
  }
}

function Annotations() {
  const [selectedTab, setSelectedTab] = useState<string>("GRCh38/byClass");
  const [category, tab] = selectedTab.split("/") as [TreeCategory, string];

  return (
    <Box height={"100%"} display={"grid"} gridTemplateRows={"1fr auto"} gap={2} id="annotations">
      <Box
        display={"grid"}
        gridTemplateColumns={{ xs: "auto", md: "auto 1fr" }}
        gridTemplateRows={{ xs: "auto 1fr", md: "auto" }}
        gap={2}
      >
        <SimpleTreeView
          multiSelect={false}
          selectedItems={selectedTab}
          // disable selecting human and mouse, they do not have the '/'
          onSelectedItemsChange={(_, id) => id.includes("/") && setSelectedTab(id)}
          defaultExpandedItems={["human", "mouse", "other"]}
        >
          <StyledTreeItem className="tree-category" itemId="human" label="Human">
            <StyledTreeItem itemId="GRCh38/byClass" label={"cCREs by Class"} />
            <StyledTreeItem itemId="GRCh38/byCelltype" label="cCREs by Cell and Tissue Type" />
            <StyledTreeItem itemId="GRCh38/geneLinks" label="cCRE-Gene Links" />
            <StyledTreeItem itemId="GRCh38/functional" label="Functional Characterization" />
            <StyledTreeItem itemId="GRCh38/geneExpression" label="Gene Expression" />
          </StyledTreeItem>
          <StyledTreeItem className="tree-category" itemId="mouse" label="Mouse">
            <StyledTreeItem itemId="mm10/byClass" label="cCREs by Class" />
            <StyledTreeItem itemId="mm10/byCelltype" label="cCREs by Cell and Tissue Type" />
            <StyledTreeItem itemId="mm10/functional" label="Functional Characterization" />
            <StyledTreeItem itemId="mm10/geneExpression" label="Gene Expression" />
          </StyledTreeItem>
          <StyledTreeItem className="tree-category" itemId="other" label="Other">
            <StyledTreeItem itemId="other/ortho" label="Orthologous cCREs" />
          </StyledTreeItem>
        </SimpleTreeView>
        {/* overflow: visible allows box shadows of buttons to not be clipped */}
        <Stack overflow={"visible"} gap={2} minWidth={0}>
          {category !== "other" && <AnnotationsHeader assembly={category} />}
          <Content tab={tab} category={category} />
        </Stack>
      </Box>
      <AnnotationsContactUs />
    </Box>
  );
}

export default Annotations;
