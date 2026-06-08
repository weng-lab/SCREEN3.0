import { FolderDefinition } from '../Folders/types';
export interface BreadcrumbProps {
    currentFolder: FolderDefinition | null;
    onNavigateToRoot: () => void;
}
export declare function Breadcrumb({ currentFolder, onNavigateToRoot, }: BreadcrumbProps): import("react/jsx-runtime").JSX.Element;
