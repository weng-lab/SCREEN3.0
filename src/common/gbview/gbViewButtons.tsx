import { Box, Button } from "@mui/material";
import { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import { useState } from "react";
import HighlightDialog from "./highlightDialog";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import { RegistryBiosample } from "app/_biosampleTables/types";
import ConfigureGBModal from "common/components/ConfigureGBModal";
import { Assembly } from "types/globalTypes";

export default function GBButtons({ browserStore, assembly, onBiosampleSelected }:
    {
        browserStore: BrowserStoreInstance;
        assembly: string;
        onBiosampleSelected: (biosample: RegistryBiosample[] | null) => void
    }) {
    const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
    const [biosampleOpen, setBiosampleOpen] = useState(false);

    const handleSelectBiosampleClick = () => {
        setBiosampleOpen(!biosampleOpen);
    };

    const handleBiosampleSelected = (biosample: RegistryBiosample[] | null) => {
        onBiosampleSelected(biosample);
    };

    return (
        <Box display="flex" gap={2}>
            <Button
                variant="contained"
                startIcon={<HighlightIcon />}
                size="small"
                onClick={() => setHighlightDialogOpen(true)}
            >
                View Current Highlights
            </Button>
            <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
            <Button
                variant="contained"
                startIcon={<EditIcon />}
                size="small"
                onClick={() => handleSelectBiosampleClick()}
            >
                Select Biosample
            </Button>
            <ConfigureGBModal
                assembly={assembly as Assembly}
                open={biosampleOpen}
                setOpen={handleSelectBiosampleClick}
                onBiosampleSelect={handleBiosampleSelected}
                multiselect={true}
            />
        </Box>
    );
}