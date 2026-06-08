import { FolderDefinition } from "../../types";
import { OtherTrackDataFile, OtherTrackInfo } from "./types";
import {
  defaultColumns,
  defaultGroupingModel,
  defaultLeafField,
} from "./columns";
import { createOtherTrack } from "./toTrack";

function transformData(
  folderId: string,
  data: OtherTrackDataFile,
): OtherTrackInfo[] {
  return data.map((row) => ({
    ...row,
    sourceId: row.id,
    id: `${folderId}/${row.id}`,
  }));
}

export interface CreateOtherTracksFolderOptions {
  id: string;
  label: string;
  description?: string;
  data: OtherTrackDataFile;
}

export function createOtherTracksFolder(
  options: CreateOtherTracksFolderOptions,
): FolderDefinition<OtherTrackInfo> {
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
    createTrack: createOtherTrack,
  };
}
