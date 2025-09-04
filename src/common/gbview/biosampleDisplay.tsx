import { CancelRounded } from "@mui/icons-material";
import { Typography, IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { RegistryBiosample } from "app/_biosampleTables/types";

export default function BiosampleDisplay({ biosample, name, onBiosampleDeslect }: { biosample: RegistryBiosample | null; name: string; onBiosampleDeslect: () => void }) {

    const handleDeselectBiosample = () => {
        sessionStorage.removeItem(`${name}-selectedBiosample`);
        onBiosampleDeslect();
    };

    return (
        <Stack
            borderRadius={1}
            direction={"row"}
            justifyContent={"space-between"}
            sx={{ backgroundColor: theme => theme.palette.secondary.light }}
            alignItems={"center"}
            width={"fit-content"}
        >
            <Typography
                sx={{ color: "#2C5BA0", pl: 1 }}
            >
                <b>Selected Biosample: </b>
                {" " + biosample.ontology.charAt(0).toUpperCase() +
                    biosample.ontology.slice(1) +
                    " - " +
                    biosample.displayname}
            </Typography>
            <IconButton
                onClick={() => handleDeselectBiosample()}
            >
                <CancelRounded />
            </IconButton>
        </Stack>
    );
}