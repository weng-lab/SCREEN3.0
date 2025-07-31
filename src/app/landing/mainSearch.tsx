import React from 'react';
import {
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    Stack,
    IconButton,
    FormHelperText,
    FormControl,
} from '@mui/material';
import AutoComplete from 'common/components/autocomplete';
import { Search } from '@mui/icons-material';

type MainSearchProps = {
    assembly: "GRCh38" | "mm10";
    handleAssemblyChange: (asmb: "GRCh38" | "mm10") => void;
};

const MainSearch: React.FC<MainSearchProps> = ({ assembly, handleAssemblyChange }) => {

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "rgba(15, 25, 82, .8)",
                    borderRadius: 2,
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 3, sm: 4 },
                    display: 'flex',
                    width: { xs: "90%", sm: "80%", md: "60%", lg: "45%" },
                    minWidth: { xs: "unset", md: 450 },
                    mt: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    mx: "auto",
                }}
            >
                <Stack spacing={2} mb={4} justifyContent="center" alignItems="center">
                    <Stack justifyContent="center" alignItems="center">
                        <Typography variant="subtitle1" color="white" textAlign="center">
                            I&apos;m searching for cCRE&apos;s in:
                        </Typography>
                        <RadioGroup
                            value={assembly}
                            onChange={(e) => handleAssemblyChange(e.target.value as "GRCh38" | "mm10")}
                            row
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                                gap: { xs: 2, sm: 4, md: 6 },
                                flexWrap: "wrap",
                            }}
                        >
                            {["GRCh38", "mm10"].map((value) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={
                                        <Radio
                                            sx={{
                                                color: 'white',
                                                '&.Mui-checked': { color: 'white' },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography color="white">
                                            {value === "GRCh38" ? "Human" : "Mouse"}
                                        </Typography>
                                    }
                                    sx={{ marginRight: 0 }}
                                />
                            ))}
                        </RadioGroup>
                    </Stack>
                </Stack>
                <FormControl sx={{ width: "75%" }}>
                    <AutoComplete
                        sx={{ display: { xs: "flex", md: "flex" } }}
                        style={{ width: "100%" }}
                        slots={{
                            button: (
                                <IconButton sx={{ color: "white" }}>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                        assembly={assembly}
                        id="main-search-component"
                        slotProps={{
                            box: { gap: 1 },
                            input: {
                                size: "small",
                                label: `Enter a gene, cCRE${assembly === "GRCh38" ? ", variant" : ""} or locus`,
                                placeholder: "Enter a gene, cCRE, variant or locus",
                                sx: {
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "#ffffff",
                                        "& fieldset": {
                                            border: "none",
                                        },
                                        "&:hover fieldset": {
                                            border: "none",
                                        },
                                        "&.Mui-focused fieldset": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "#666666",
                                        "&.Mui-focused": {
                                            color: "#444444",
                                        },
                                    },
                                    "& .MuiInputLabel-shrink": {
                                        display: "none",
                                    },
                                },
                            },
                        }}
                    />
                    <FormHelperText sx={{ ml: 0, color: "white" }}>
                        Try{" "}
                        &quot;<i>{assembly === "GRCh38" ? "SOX4" : "Sox4"}</i>&quot;,
                        &quot;<i>{assembly === "GRCh38" ? "rs9466027" : "EM10E0000207"}</i>&quot;,
                        or &quot;chr11:12345678-12345679&quot;
                    </FormHelperText>
                </FormControl>
            </Box>
        </>
    );
};

export default MainSearch;
