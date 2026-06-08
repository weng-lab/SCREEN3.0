import { FolderView } from '../../types';
export interface MohdViewSelectorProps {
    views: FolderView[];
    activeViewId: string;
    onChange: (viewId: string) => void;
}
export declare function MohdViewSelector({ views, activeViewId, onChange, }: MohdViewSelectorProps): import("react/jsx-runtime").JSX.Element;
