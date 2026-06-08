import { TreeViewBaseItem } from "@mui/x-tree-view";
import { ExtendedTreeItemProps } from "./types";

type TreeRow = {
  id: string;
  [key: string]: unknown;
};

type BuildSelectedTreeOptions = {
  folderId: string;
  rootLabel: string;
  selectedRows: TreeRow[];
  groupingModel: string[];
  leafField: string;
};

const toLabel = (value: unknown, fallback: string) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
};

const isHighlightedField = (field: string) => {
  return field === "assay" || field === "ome";
};

const createRootNode = (
  folderId: string,
  rootLabel: string,
): TreeViewBaseItem<ExtendedTreeItemProps> => ({
  id: `${folderId}::root`,
  kind: "root",
  label: rootLabel,
  icon: "folder",
  children: [],
  allExpAccessions: [],
});

const createLeafNode = (
  row: TreeRow,
  leafField: string,
): TreeViewBaseItem<ExtendedTreeItemProps> => {
  const value = row[leafField];
  const label = toLabel(value, row.id);

  return {
    id: row.id,
    kind: "leaf",
    field: leafField,
    value: label,
    rowId: row.id,
    label,
    icon: "removeable",
    highlightName: isHighlightedField(leafField) ? label : undefined,
    isHighlightedItem: isHighlightedField(leafField),
    children: [],
    allExpAccessions: [row.id],
  };
};

const appendGroupedRows = (
  parent: TreeViewBaseItem<ExtendedTreeItemProps>,
  rows: TreeRow[],
  groupingModel: string[],
  depth: number,
  folderId: string,
  leafField: string,
  path: string[],
) => {
  if (depth >= groupingModel.length) {
    rows.forEach((row) => {
      const leafNode = createLeafNode(row, leafField);
      parent.children!.push(leafNode);
      parent.allExpAccessions!.push(row.id);
    });
    return;
  }

  const field = groupingModel[depth];
  const groupedRows = new Map<string, TreeRow[]>();

  rows.forEach((row) => {
    const value = toLabel(row[field], row.id);
    const groupRows = groupedRows.get(value);
    if (groupRows) {
      groupRows.push(row);
      return;
    }

    groupedRows.set(value, [row]);
  });

  groupedRows.forEach((groupRows, value) => {
    const nodeId = `${folderId}::${[...path, `${field}=${encodeURIComponent(value)}`].join("::")}`;
    const groupNode: TreeViewBaseItem<ExtendedTreeItemProps> = {
      id: nodeId,
      kind: "group",
      field,
      value,
      label: value,
      icon: "removeable",
      highlightName: isHighlightedField(field) ? value : undefined,
      isHighlightedItem: isHighlightedField(field),
      children: [],
      allExpAccessions: [],
    };

    appendGroupedRows(
      groupNode,
      groupRows,
      groupingModel,
      depth + 1,
      folderId,
      leafField,
      [...path, `${field}=${encodeURIComponent(value)}`],
    );

    parent.children!.push(groupNode);
    parent.allExpAccessions!.push(...groupNode.allExpAccessions!);
  });
};

export const buildSelectedTree = ({
  folderId,
  rootLabel,
  selectedRows,
  groupingModel,
  leafField,
}: BuildSelectedTreeOptions): TreeViewBaseItem<ExtendedTreeItemProps>[] => {
  const root = createRootNode(folderId, rootLabel);

  appendGroupedRows(
    root,
    selectedRows,
    groupingModel,
    0,
    folderId,
    leafField,
    [],
  );

  return [root];
};
