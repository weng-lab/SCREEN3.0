import { FolderDefinition } from "../../types";
import { PsychscreenDataFile, PsychscreenTrackInfo } from "./types";
import {
  defaultColumns,
  defaultGroupingModel,
  defaultLeafField,
} from "./columns";
import { PsychscreenGroupingCell } from "./PsychscreenGroupingCell";
import { createPsychscreenTrack } from "./toTrack";

function transformData(
  folderId: string,
  data: PsychscreenDataFile,
): PsychscreenTrackInfo[] {
  return data.map((row) => ({
    ...row,
    sourceId: row.id,
    id: `${folderId}/${row.id}`,
  }));
}

export interface CreatePsychscreenFolderOptions {
  id: string;
  label: string;
  description?: string;
  data: PsychscreenDataFile;
}

export function createPsychscreenFolder(
  options: CreatePsychscreenFolderOptions,
): FolderDefinition<PsychscreenTrackInfo> {
  const { id, label, description, data } = options;

  return {
    id,
    label,
    description,
    rows: transformData(id, data),
    columns: defaultColumns,
    groupingModel: defaultGroupingModel,
    leafField: defaultLeafField,
    createTrack: createPsychscreenTrack,
    GroupingCellComponent: PsychscreenGroupingCell,
  };
}
