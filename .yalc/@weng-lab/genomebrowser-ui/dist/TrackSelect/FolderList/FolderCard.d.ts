import { FolderDefinition } from '../Folders/types';
export interface FolderCardProps {
    folder: FolderDefinition;
    onClick: () => void;
}
export declare function FolderCard({ folder, onClick }: FolderCardProps): import("react/jsx-runtime").JSX.Element;
