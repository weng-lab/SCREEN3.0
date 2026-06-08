import { FolderView } from '../../types';
export interface BiosampleViewSelectorProps {
    views: FolderView[];
    activeViewId: string;
    onChange: (viewId: string) => void;
}
export declare function BiosampleViewSelector({ views, activeViewId, onChange, }: BiosampleViewSelectorProps): import("react/jsx-runtime").JSX.Element;
