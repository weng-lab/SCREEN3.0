import React, { useMemo } from 'react';
import {
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    Stack,
    IconButton,
    FormControl,
    Tooltip,
} from '@mui/material';
import AutoComplete, { defaultHumanResults, defaultMouseResults } from 'common/components/autocomplete';
import { Search, InfoOutlined } from '@mui/icons-material';

type MainSearchProps = {
    assembly: "GRCh38" | "mm10";
    handleAssemblyChange: (asmb: "GRCh38" | "mm10") => void;
};

const MainSearch: React.FC<MainSearchProps> = ({ assembly, handleAssemblyChange }) => {

    const defaultResults = assembly === "GRCh38" ? defaultHumanResults : defaultMouseResults

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
                            Search in:
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
                                label: `Enter a gene, cCRE${assembly === "GRCh38" ? ", variant, GWAS," : ""} or locus`,
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
                    <Stack direction="row" alignItems="center" justifyContent="flex-start" mt={1}>
                        <Tooltip
                            title={
                                <Box>
                                    {defaultResults.map((r, i) => (
                                        <Typography key={i} variant="body2">
                                            <strong>{r.type}: </strong>{r.title}
                                        </Typography>
                                    ))}
                                </Box>
                            }
                            arrow
                            placement="bottom"
                        >
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "white", cursor: "default" }}>
                                <InfoOutlined fontSize="small" />
                                <Typography variant="body2">Try these example searches to get started</Typography>
                            </Stack>
                        </Tooltip>
                    </Stack>
                </FormControl>
            </Box>
        </>
    );
};

export default MainSearch;
