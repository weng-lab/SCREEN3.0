import { capitalize } from "@mui/material";
import { FolderDefinition } from "../../types";
import {
  BiosampleDataFile,
  BiosampleRowInfo,
  BiosampleTrackInfo,
} from "./types";
import {
  defaultColumns,
  defaultGroupingModel,
  defaultLeafField,
  sortedByAssayColumns,
  sortedByAssayGroupingModel,
  sortedByAssayLeafField,
} from "./columns";
import { formatAssayType } from "./constants";
import { BiosampleViewSelector } from "./BiosampleViewSelector";
import BiosampleGroupingCell from "./BiosampleGroupingCell";
import { BiosampleTreeItem } from "./BiosampleTreeItem";
import { createBiosampleTrack } from "./toTrack";

/** Flatten a biosample track into one row per assay. */
function flattenTrackIntoRows(
  folderId: string,
  track: BiosampleTrackInfo,
): BiosampleRowInfo[] {
  const { ontology, lifeStage, sampleType, displayName, collection } = track;

  // Keep cCRE rows first so aggregate selections stay prominent in the UI.
  const sortedAssays = [...track.assays].sort((a, b) => {
    const aIsCcre = a.assay.toLowerCase() === "ccre";
    const bIsCcre = b.assay.toLowerCase() === "ccre";
    if (aIsCcre && !bIsCcre) return -1;
    if (!aIsCcre && bIsCcre) return 1;
    return 0;
  });

  return sortedAssays.map(
    ({
      id,
      assay,
      experimentAccession,
      fileAccession,
      url,
      cpgPlus,
      cpgMinus,
      coverage,
    }) => ({
      id: `${folderId}/${id}`,
      ontology: capitalize(ontology),
      lifeStage: capitalize(lifeStage),
      sampleType: capitalize(sampleType),
      displayName: capitalize(displayName),
      assay: formatAssayType(assay),
      experimentAccession,
      fileAccession,
      url,
      collection,
      cpgPlus,
      cpgMinus,
      coverage,
    }),
  );
}

function transformData(
  folderId: string,
  data: BiosampleDataFile,
): BiosampleRowInfo[] {
  return data.tracks.flatMap((track) => flattenTrackIntoRows(folderId, track));
}

export interface CreateBiosampleFolderOptions {
  id: string;
  label: string;
  description?: string;
  data: BiosampleDataFile;
}

/**
 * Build a biosample folder with its data, tree builder, and track factory.
 */
export function createBiosampleFolder(
  options: CreateBiosampleFolderOptions,
): FolderDefinition<BiosampleRowInfo> {
  const { id, label, description, data } = options;
  const rows = transformData(id, data);
  const views = [
    {
      id: "default",
      label: "Tissue",
      columns: defaultColumns,
      groupingModel: defaultGroupingModel,
      leafField: defaultLeafField,
    },
    {
      id: "by-assay",
      label: "Assay",
      columns: sortedByAssayColumns,
      groupingModel: sortedByAssayGroupingModel,
      leafField: sortedByAssayLeafField,
    },
  ];

  return {
    id,
    label,
    description,
    rows,
    columns: defaultColumns,
    groupingModel: defaultGroupingModel,
    leafField: defaultLeafField,
    createTrack: createBiosampleTrack,
    views,
    ViewSelector: BiosampleViewSelector,
    GroupingCellComponent: BiosampleGroupingCell,
    TreeItemComponent: BiosampleTreeItem,
  };
}
