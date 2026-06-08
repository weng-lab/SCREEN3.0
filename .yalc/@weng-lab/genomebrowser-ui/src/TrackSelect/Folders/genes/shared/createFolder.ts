import { FolderDefinition } from "../../types";
import { GeneDataFile, GeneRowInfo, GeneTrackInfo } from "./types";
import {
  defaultColumns,
  defaultGroupingModel,
  defaultLeafField,
} from "./columns";
import { createGeneTrack } from "./toTrack";

/** Genes map 1:1 from JSON track entries to table rows. */
function trackToRow(folderId: string, track: GeneTrackInfo): GeneRowInfo {
  return {
    id: `${folderId}/${track.id}`,
    trackId: track.id,
    displayName: track.displayName,
    versions: track.versions,
  };
}

function transformData(folderId: string, data: GeneDataFile): GeneRowInfo[] {
  return data.map((track) => trackToRow(folderId, track));
}

export interface CreateGeneFolderOptions {
  id: string;
  label: string;
  description?: string;
  data: GeneDataFile;
}

/** Build a gene folder with its row lookup, tree, and track factory. */
export function createGeneFolder(
  options: CreateGeneFolderOptions,
): FolderDefinition<GeneRowInfo> {
  const { id, label, description, data } = options;
  const rows = transformData(id, data);

  return {
    id,
    label,
    description,
    rows,
    columns: defaultColumns,
    groupingModel: defaultGroupingModel,
    leafField: defaultLeafField,
    createTrack: createGeneTrack,
  };
}
