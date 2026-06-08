import { FolderDefinition } from '../Folders/types';
export interface FolderListProps {
    folders: FolderDefinition[];
    onFolderSelect: (folderId: string) => void;
}
export declare function FolderList({ folders, onFolderSelect }: FolderListProps): import("react/jsx-runtime").JSX.Element;
