import { FolderDefinition } from "../../types";
import { MohdDataFile, MohdRowInfo } from "./types";
import { getMohdOmeConfig } from "./config";
import { mohdViews } from "./columns";
import { MohdGroupingCell } from "./MohdGroupingCell";
import { MohdTreeItem } from "./MohdTreeItem";
import { createMohdTrack } from "./toTrack";
import { MohdViewSelector } from "./MohdViewSelector";

const WGBS_DESCRIPTION = "DNA Methylation";

function createBaseRow(folderId: string, row: MohdDataFile[number]) {
  return {
    id: `${folderId}/${row.sample_id}::${row.filename}`,
    ome: getMohdOmeConfig(row.ome).label,
    site: row.site,
    sampleId: row.sample_id,
    kitId: row.kit_id,
    sex: row.sex,
    status: row.status,
  };
}

function createFileRow(
  folderId: string,
  row: MohdDataFile[number],
): MohdRowInfo {
  const trackCategory = row.filename.endsWith(".bigBed")
    ? "Annotation"
    : "Signal";

  return {
    ...createBaseRow(folderId, row),
    kind: "file",
    description: row.file_type,
    trackCategory,
    filename: row.filename,
  };
}

function getRequiredWgbsFilename(
  sampleRows: MohdDataFile,
  includesText: string,
) {
  const match = sampleRows.find((row) => row.filename.includes(includesText));

  if (!match) {
    throw new Error(`Missing WGBS file matching ${includesText}`);
  }

  return match.filename;
}

function createWgbsMethylRow(
  folderId: string,
  sampleRows: MohdDataFile,
): MohdRowInfo {
  const sampleId = sampleRows[0]?.sample_id;

  if (!sampleId) {
    throw new Error("Cannot build WGBS row without a sample ID");
  }

  const base = createBaseRow(folderId, sampleRows[0]!);

  return {
    ...base,
    id: `${folderId}/${sampleId}`,
    kind: "wgbs-methyl",
    description: WGBS_DESCRIPTION,
    trackCategory: "Methylation",
    filenames: {
      plusStrand: {
        cpg: getRequiredWgbsFilename(sampleRows, "DNAme-CpG-plus"),
        chg: getRequiredWgbsFilename(sampleRows, "DNAme-CHG-plus"),
        chh: getRequiredWgbsFilename(sampleRows, "DNAme-CHH-plus"),
        depth: getRequiredWgbsFilename(sampleRows, "coverage-plus"),
      },
      minusStrand: {
        cpg: getRequiredWgbsFilename(sampleRows, "DNAme-CpG-minus"),
        chg: getRequiredWgbsFilename(sampleRows, "DNAme-CHG-minus"),
        chh: getRequiredWgbsFilename(sampleRows, "DNAme-CHH-minus"),
        depth: getRequiredWgbsFilename(sampleRows, "coverage-minus"),
      },
    },
  };
}

function transformData(folderId: string, data: MohdDataFile): MohdRowInfo[] {
  const signalRows = data
    .filter((row) => row.ome !== "wgbs")
    .map((row) => createFileRow(folderId, row));
  const wgbsRowsBySampleId = new Map<string, MohdDataFile>();

  data.forEach((row) => {
    if (row.ome !== "wgbs") {
      return;
    }

    const sampleRows = wgbsRowsBySampleId.get(row.sample_id);

    if (sampleRows) {
      sampleRows.push(row);
      return;
    }

    wgbsRowsBySampleId.set(row.sample_id, [row]);
  });

  const methylationRows = Array.from(wgbsRowsBySampleId.values()).map(
    (sampleRows) => createWgbsMethylRow(folderId, sampleRows),
  );

  return [...signalRows, ...methylationRows];
}

export interface CreateMohdFolderOptions {
  id: string;
  label: string;
  description?: string;
  data: MohdDataFile;
}

export function createMohdFolder(
  options: CreateMohdFolderOptions,
): FolderDefinition<MohdRowInfo> {
  const { id, label, description, data } = options;
  const rows = transformData(id, data);
  const defaultView = mohdViews[0]!;

  return {
    id,
    label,
    description,
    rows,
    columns: defaultView.columns,
    groupingModel: defaultView.groupingModel,
    leafField: defaultView.leafField,
    createTrack: createMohdTrack,
    views: mohdViews,
    ViewSelector: MohdViewSelector,
    GroupingCellComponent: MohdGroupingCell,
    TreeItemComponent: MohdTreeItem,
  };
}
