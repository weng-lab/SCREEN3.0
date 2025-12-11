import { Stack, styled } from "@mui/material";
import React, { useState } from "react";
import AnnotationsHeader from "./Header";
import AnnotationsByClass from "./AnnotationsByClass";
import AnnotationsGeneLinks from "./AnnotationsCcreGeneLinks";
import AnnotationsByCelltype from "./AnnotationsByCelltype";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, TreeItemProps } from "@mui/x-tree-view";
import AnnotationsOtherOrthologous from "./AnnotationsOtherOrthologous";
import AnnotationsContactUs from "./AnnotationsContactUs";
import AnnotationsFunctional from "./AnnotationsFunctional";

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

export type Assembly = "GRCh38" | "mm10" | "other";

const Content = ({ tab, assembly }: { tab: string; assembly: Assembly }) => {
  switch (tab) {
    case "byClass":
      return <AnnotationsByClass assembly={assembly} />;
    case "byCelltype":
      return <AnnotationsByCelltype assembly={assembly} />;
    case "geneLinks":
      return <AnnotationsGeneLinks />;
    case "ortho":
      return <AnnotationsOtherOrthologous />;
    case "functional":
      return <AnnotationsFunctional assembly={assembly} />;
  }
};

const Annotations = () => {
  const [selectedTab, setSelectedTab] = useState<string>("GRCh38/byClass");
  const [assembly, tab] = selectedTab.split("/") as [Assembly, string];

  return (
    <Stack gap={2} height={"100%"} justifyContent={"space-between"}>
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
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
          </StyledTreeItem>
          <StyledTreeItem className="tree-category" itemId="mouse" label="Mouse">
            <StyledTreeItem itemId="mm10/byClass" label="cCREs by Class" />
            <StyledTreeItem itemId="mm10/byCelltype" label="cCREs by Cell and Tissue Type" />
            <StyledTreeItem itemId="mm10/functional" label="Functional Characterization" />
          </StyledTreeItem>
          <StyledTreeItem className="tree-category" itemId="other" label="Other">
            <StyledTreeItem itemId="other/ortho" label="Orthologous cCREs" />
          </StyledTreeItem>
        </SimpleTreeView>
        {/* overflow: visible allows box shadows of buttons to not be clipped */}
        <Stack flexGrow={1} overflow={"visible"} gap={2} minWidth={0}>
          {assembly !== "other" && <AnnotationsHeader assembly={assembly} />}
          <Content tab={tab} assembly={assembly} />
        </Stack>
      </Stack>
      <AnnotationsContactUs />
    </Stack>
  );
};

export default Annotations;
