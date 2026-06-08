interface ClearDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    folderLabel: string;
    clearAll: boolean;
}
export declare function ClearDialog({ open, onClose, onConfirm, folderLabel, clearAll, }: ClearDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
