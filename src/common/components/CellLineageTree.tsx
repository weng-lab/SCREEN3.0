import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { HierarchyPointLink, HierarchyPointNode } from "@visx/hierarchy/lib/types";
import { LinkVertical } from "@visx/shape";
import { useCallback, useMemo } from "react";

const primaryColor = "#494d6b";

export type CellType =
  | "B Cells"
  | "CD4+ T Cells"
  | "CD8+ T Cells"
  | "Central Memory CD8+ T Cells"
  | "Common Lymphoid Progenitors"
  | "Common Myeloid Progenitors"
  | "Effector CD4+ Tcells"
  | "Effector Memory CD8+ T Cells"
  | "Erythroblasts"
  | "Follicular T Helper Cells"
  | "Gamma Delta T Cells"
  | "Granulocyte-monocyte progenitors"
  | "Hematopoetic Stem Cells"
  | "Immature Natural Killer Cells"
  | "Inflammatory Macrophages"
  | "Leukemia Blast Cells"
  | "Leukemic Stem Cells"
  | "Lymphoid-Primed Multipotent Progenitor Cells"
  | "Mature Natural Killer Cells"
  | "Megakaryocyte-Erythroid Progenitors"
  | "Memory B Cells"
  | "Memory CD8+ T Cells"
  | "Memory Natural Killer Cells"
  | "Memory T Effector Cells"
  | "Memory T Regulatory Cells"
  | "Monocytes"
  | "Multipotent Progenitors"
  | "Myeloid Dendritic Cells"
  | "Naive B Cells"
  | "Naive CD8+ T Cells"
  | "Naive T Effector Cells"
  | "Naive T Regulatory Cells"
  | "Natural Killer Cells"
  | "Plasmablasts"
  | "Plasmacytoid Dendritic Cells"
  | "Regulatory T cells"
  | "Suppressor Macrophages"
  | "T Cells"
  | "T-helper 1 Cell"
  | "T-helper 17 Cell"
  | "T-helper 2 Cell"
  | "T-helper 22 Cell"
  | "T-helper 9 Cell"
  | "pre-Hematopoetic Leukemic Stem Cell";

/**
 * Provides mapping between celltype and if there is stim/unstim data for each assay
 * @todo ensure this is correct, AI generated based on files given by Nishi
 */
export const cellTypeConfig: {
  [key in CellType]: { ATAC: { Stim: boolean; Unstim: boolean }; DNase: { Stim: boolean; Unstim: boolean } };
} = {
  "B Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "CD4+ T Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "CD8+ T Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "Central Memory CD8+ T Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Common Lymphoid Progenitors": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Common Myeloid Progenitors": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "Effector CD4+ Tcells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Effector Memory CD8+ T Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: false } },
  Erythroblasts: { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "Follicular T Helper Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Gamma Delta T Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: false } },
  "Granulocyte-monocyte progenitors": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Hematopoetic Stem Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Immature Natural Killer Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Inflammatory Macrophages": { ATAC: { Stim: false, Unstim: false }, DNase: { Stim: false, Unstim: true } },
  "Leukemia Blast Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Leukemic Stem Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Lymphoid-Primed Multipotent Progenitor Cells": {
    ATAC: { Stim: false, Unstim: true },
    DNase: { Stim: false, Unstim: false },
  },
  "Mature Natural Killer Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Megakaryocyte-Erythroid Progenitors": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Memory B Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "Memory CD8+ T Cells": { ATAC: { Stim: false, Unstim: false }, DNase: { Stim: true, Unstim: true } },
  "Memory Natural Killer Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Memory T Effector Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "Memory T Regulatory Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  Monocytes: { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "Multipotent Progenitors": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "Myeloid Dendritic Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "Naive B Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "Naive CD8+ T Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "Naive T Effector Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "Naive T Regulatory Cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Natural Killer Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  Plasmablasts: { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Plasmacytoid Dendritic Cells": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Regulatory T cells": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: false } },
  "Suppressor Macrophages": { ATAC: { Stim: false, Unstim: false }, DNase: { Stim: false, Unstim: true } },
  "T Cells": { ATAC: { Stim: false, Unstim: false }, DNase: { Stim: false, Unstim: true } },
  "T-helper 1 Cell": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "T-helper 17 Cell": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: false, Unstim: true } },
  "T-helper 2 Cell": { ATAC: { Stim: true, Unstim: true }, DNase: { Stim: true, Unstim: true } },
  "T-helper 22 Cell": { ATAC: { Stim: false, Unstim: false }, DNase: { Stim: false, Unstim: true } },
  "T-helper 9 Cell": { ATAC: { Stim: false, Unstim: false }, DNase: { Stim: true, Unstim: true } },
  "pre-Hematopoetic Leukemic Stem Cell": { ATAC: { Stim: false, Unstim: true }, DNase: { Stim: false, Unstim: false } },
};

export interface NodeInfo {
  /**
   * unique identifier for the node, should match ```celltype``` field of useIcreActivity
   */
  celltype: CellType;
}

interface CellTypeTreeProps {
  width: number;
  height: number;
  /**
   * Determines if a node is selected (places outline around node)
   */
  getCellSelected?: (cellNode: HierarchyPointNode<TreeNode>) => boolean;
  /**
   * Determines if a node is disabled (greyed out and uninteractive)
   */
  getCellDisabled?: (cellNode: HierarchyPointNode<TreeNode>) => boolean;
  /**
   * Makes it so that nodes do not grow slightly on hover
   */
  uninteractive?: boolean;
  onNodeClicked?: (node: NodeInfo) => void;
}

/**
 * Processes a cell type and returns a string based on the cell type
 * @param cellType The cell type to process
 * @returns An empty string for now
 */
export function getCellImagePath(cellType: CellType): string {
  switch (cellType) {
    case "B Cells":
      return "/cells/B.png";
    case "CD4+ T Cells":
      return "/cells/CD4+_T.png";
    case "CD8+ T Cells":
      return "/cells/CD8+_T.png";
    case "Central Memory CD8+ T Cells":
      return "/cells/Central_Memory_CD8+_T.png";
    case "Common Lymphoid Progenitors":
      return "/cells/Common_Lymphoid_Progenitors.png";
    case "Common Myeloid Progenitors":
      return "/cells/Common_Myeloid_Progenitors.png";
    case "Effector CD4+ Tcells":
      return "/cells/Effector_CD4+_T.png";
    case "Effector Memory CD8+ T Cells":
      return "/cells/Effector_Memory_CD8+_T.png";
    case "Erythroblasts":
      return "/cells/Erythroblasts.png";
    case "Follicular T Helper Cells":
      return "/cells/Follicular_T_Helper.png";
    case "Gamma Delta T Cells":
      return "/cells/Gamma_Delta_T.png";
    case "Granulocyte-monocyte progenitors":
      return "/cells/Granulocyte-Monocyte_Progenitors.png";
    case "Hematopoetic Stem Cells":
      return "/cells/Hematopoetic_Stem.png";
    case "Immature Natural Killer Cells":
      return "/cells/Immature_Natural_Killer.png";
    case "Inflammatory Macrophages":
      return "/cells/Inflammatory_Macrophages.png";
    case "Leukemia Blast Cells":
      return null;
    case "Leukemic Stem Cells":
      return null;
    case "Lymphoid-Primed Multipotent Progenitor Cells":
      return "/cells/Lymphoid_Primed_Multipotent_Progenitor.png";
    case "Mature Natural Killer Cells":
      return "/cells/Mature_Natural_Killer.png";
    case "Megakaryocyte-Erythroid Progenitors":
      return "/cells/Megakaryocyte-Erythroid_Progenitors.png";
    case "Memory B Cells":
      return "/cells/Memory_B_Cells.png";
    case "Memory CD8+ T Cells":
      return "/cells/Memory_CD8+_T.png";
    case "Memory Natural Killer Cells":
      return "/cells/Memory_Natural_Killer.png";
    case "Memory T Effector Cells":
      return "/cells/Memory_T_Effector.png";
    case "Memory T Regulatory Cells":
      return "/cells/Memory_T_Regulatory.png";
    case "Monocytes":
      return "/cells/Monocytes.png";
    case "Multipotent Progenitors":
      return "/cells/Multipotent_Progenitors.png";
    case "Myeloid Dendritic Cells":
      return "/cells/Myeloid_Dendritic.png";
    case "Naive B Cells":
      return "/cells/Naive_B.png";
    case "Naive CD8+ T Cells":
      return "/cells/Naive_CD8+_T.png";
    case "Naive T Effector Cells":
      return "/cells/Naive_T_Effector.png";
    case "Naive T Regulatory Cells":
      return "/cells/Naive_T_Regulatory.png";
    case "Natural Killer Cells":
      return "/cells/Natural_Killer.png";
    case "Plasmablasts":
      return "/cells/Plasmablasts.png";
    case "Plasmacytoid Dendritic Cells":
      return "/cells/Plasmacytoid_Dendritic.png";
    case "Regulatory T cells":
      return "/cells/Regulatory_T.png";
    case "Suppressor Macrophages":
      return "/cells/Suppressor_Macrophages.png";
    case "T Cells":
      return "/cells/T.png";
    case "T-helper 1 Cell":
      return "/cells/T-helper_1.png";
    case "T-helper 17 Cell":
      return "/cells/T-helper_17.png";
    case "T-helper 2 Cell":
      return "/cells/T-helper_2.png";
    case "T-helper 22 Cell":
      return "/cells/T-helper_22.png";
    case "T-helper 9 Cell":
      return "/cells/T-helper_9.png";
    case "pre-Hematopoetic Leukemic Stem Cell":
      return null;
    case null:
      return "/cells/Hematopoetic_Stem.png";
    default:
      const exhaustiveCheck: never = cellType;
      throw new Error(`Unhandled cell type: ${exhaustiveCheck}`);
  }
}

interface TreeNode extends NodeInfo {
  label: string;
  alwaysDisabled?: boolean;
  children?: TreeNode[];
}

const tree: TreeNode = {
  celltype: "Hematopoetic Stem Cells",
  label: "Hematopoetic/Stem Cell",
  children: [
    {
      celltype: "Multipotent Progenitors",
      label: "Multipotent/Progenitor",
      children: [
        {
          celltype: "Common Myeloid Progenitors",
          label: "Common Myeloid/Progenitor",
          children: [
            {
              celltype: "Granulocyte-monocyte progenitors",
              label: "Granulocyte-monocyte/progenitor",
              children: [
                {
                  celltype: "Plasmacytoid Dendritic Cells",
                  label: "Plasmacytoid/DC",
                },
                {
                  celltype: "Myeloid Dendritic Cells",
                  label: "Myeloid/DC",
                },
                {
                  celltype: "Monocytes",
                  label: "Monocyte",
                },
                {
                  celltype: "Suppressor Macrophages",
                  label: "Suppressor/Macrophage",
                },
                {
                  celltype: "Inflammatory Macrophages",
                  label: "Inflammatory/Macrophage",
                },
              ],
            },
          ],
        },
        {
          celltype: "Megakaryocyte-Erythroid Progenitors",
          label: "Megakaryocyte-Erythroid/Progenitor",
          children: [
            {
              celltype: "Erythroblasts",
              label: "Erythroblast",
            },
          ],
        },
        {
          celltype: "Lymphoid-Primed Multipotent Progenitor Cells",
          label: "Lymphoid-Primed/Multipotent Progenitor",
          children: [
            {
              celltype: "Common Lymphoid Progenitors",
              label: "Common Lymphoid/Progenitor",
              children: [
                {
                  celltype: null,
                  label: "Double/Negative",
                  alwaysDisabled: true,
                  children: [
                    {
                      celltype: "Natural Killer Cells",
                      label: "Natural Killer",
                      children: [
                        {
                          celltype: "Immature Natural Killer Cells",
                          label: "Immature NK",
                          children: [
                            {
                              celltype: "Mature Natural Killer Cells",
                              label: "Mature NK",
                              children: [
                                {
                                  celltype: "Memory Natural Killer Cells",
                                  label: "Memory NK",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      celltype: "T Cells",
                      label: "T Cell",
                      children: [
                        {
                          celltype: "Gamma Delta T Cells",
                          label: "Gamma/Delta T",
                        },
                        {
                          celltype: null,
                          label: "Double/Positive",
                          alwaysDisabled: true,
                          children: [
                            {
                              celltype: "CD4+ T Cells",
                              label: "CD4+ T Cell",
                              children: [
                                {
                                  celltype: "Effector CD4+ Tcells",
                                  label: "Effector/CD4+ T",
                                  children: [
                                    {
                                      celltype: "Naive T Effector Cells",
                                      label: "Naive T/Effector",
                                      children: [
                                        {
                                          celltype: "Memory T Effector Cells",
                                          label: "Memory T/Effector",
                                          children: [
                                            {
                                              celltype: "T-helper 1 Cell",
                                              label: "T-helper 1",
                                            },
                                            {
                                              celltype: "T-helper 2 Cell",
                                              label: "T-helper 2",
                                            },
                                            {
                                              celltype: "T-helper 9 Cell",
                                              label: "T-helper 9",
                                            },
                                            {
                                              celltype: "T-helper 17 Cell",
                                              label: "T-helper 17",
                                            },
                                            {
                                              celltype: "T-helper 22 Cell",
                                              label: "T-helper 22",
                                            },
                                            {
                                              celltype: "Follicular T Helper Cells",
                                              label: "T Follicular/Helper",
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  celltype: "Regulatory T cells",
                                  label: "Regulatory T",
                                  children: [
                                    {
                                      celltype: "Naive T Regulatory Cells",
                                      label: "Naive T/Regulatory",
                                      children: [
                                        {
                                          celltype: "Memory T Regulatory Cells",
                                          label: "Memory T/Regulatory",
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              celltype: "CD8+ T Cells",
                              label: "CD8+ T Cell",
                              children: [
                                {
                                  celltype: "Naive CD8+ T Cells",
                                  label: "Naive CD8+ T",
                                  children: [
                                    {
                                      celltype: "Central Memory CD8+ T Cells",
                                      label: "Central/Memory/CD8+ T",
                                    },
                                    {
                                      celltype: "Effector Memory CD8+ T Cells",
                                      label: "Effector/Memory/CD8+ T",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  celltype: "B Cells",
                  label: "B Cell",
                  children: [
                    {
                      celltype: "Naive B Cells",
                      label: "Naive B Cell",
                      children: [
                        {
                          celltype: "Memory B Cells",
                          label: "Memory B Cell",
                          children: [
                            {
                              celltype: "Plasmablasts",
                              label: "Plasmablast",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const CellLineageTree = ({
  width,
  height,
  getCellSelected = () => true,
  getCellDisabled = () => false,
  uninteractive = false,
  onNodeClicked = () => {},
}: CellTypeTreeProps) => {
  const innerMarginTop = 70;
  const innerMarginBottom = 30;
  const innerMarginLeft = 0;
  const innerMarginRight = 0;

  const innerWidth = width - innerMarginLeft - innerMarginRight;
  const innerHeight = height - innerMarginTop - innerMarginBottom;

  const data = useMemo(() => hierarchy(tree), []);

  const Node = useCallback(
    ({ node }: { node: HierarchyPointNode<TreeNode> }) => {
      const width = 60;
      const height = 60;
      const centerX = -width / 2;
      const centerY = -height / 2;
      const top = node.y;
      const left = node.x;

      const isSelected = getCellSelected(node)
      const isDisabled = node.data.alwaysDisabled || getCellDisabled(node)
      const opacity = isDisabled ? 0.3 : 1;

      const fontSize = 12
      const labelLines = node.data.label.split("/")

      return (
        <Group
          top={top}
          left={left}
          opacity={opacity}
          onMouseEnter={(event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              event.currentTarget.setAttribute("opacity", "1");
          }}
          onMouseOut={(event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              event.currentTarget.setAttribute("opacity", String(opacity));
          }}
          style={{
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          {/* 
            Text positioned above the group, all positioning is done relative to image position.
            Vertical offset based on how many lines label take up after splitting
          */}
          <text y={-35 - (fontSize + 2) * labelLines.length} textAnchor="middle" fontSize={fontSize}>
            {labelLines.map((str, i) => {
              return (
                <tspan key={i} x="0" dy={fontSize + 2}>
                  {str}
                </tspan>
              );
            })}
          </text>
          {isSelected && (
            <rect
              width={width}
              height={height}
              x={centerX}
              y={centerY - 2}
              rx={15}
              fill="none"
              stroke={primaryColor}
              strokeWidth={1}
            />
          )}
          <image
            id={`cell-${node.data.celltype}`}
            href={getCellImagePath(node.data.celltype)}
            width={width}
            height={height}
            x={centerX}
            y={centerY}
            cursor={uninteractive ? 'initial' : isDisabled ? "not-allowed" : "pointer"}
            onMouseEnter={(event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              if (!uninteractive && !isDisabled) {
                event.currentTarget.setAttribute("transform", "scale(1.1)");
              }
            }}
            onMouseOut={(event: React.MouseEvent<SVGImageElement, MouseEvent>) => {
              if (!uninteractive && !isDisabled) {
                event.currentTarget.setAttribute("transform", "scale(1)");
              }
            }}
            style={{
              transition: "transform 0.1s ease-in-out",
            }}
            onClick={() => !isDisabled && onNodeClicked(node.data)}
          />
        </Group>
      );
    },
    [getCellDisabled, getCellSelected, onNodeClicked, uninteractive]
  );

  return innerWidth < 10 ? null : (
    <svg width={'100%'} viewBox={`0 0 ${width} ${height}`}>
      <Tree<TreeNode>
        root={data}
        size={[innerWidth, innerHeight]}
        separation={(a, b) => (a.parent == b.parent ? 1.6 : 2)}
      >
        {(tree) => (
          <Group top={innerMarginTop} left={innerMarginLeft}>
            {tree.links().map((link, i) => (
              <LinkVertical<HierarchyPointLink<TreeNode>, HierarchyPointNode<TreeNode>>
                key={`tree-link-${i}`}
                data={link}
                stroke={"#b4b6cc"}
                strokeWidth={
                  link.target.descendants().find((childNode) => getCellSelected(childNode)) ? 4 : 0.75
                }
                fill="none"
                style={{
                  transition: "stroke-width 0.2s ease-in-out",
                }}
              />
            ))}
            {tree.descendants().map((node, i) => (
              <Node key={`node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Tree>
    </svg>
  );
};

export default CellLineageTree;
