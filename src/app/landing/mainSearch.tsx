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
import AutoComplete from 'common/components/autocomplete';
import { Search, InfoOutlined } from '@mui/icons-material';
import { Result } from '@weng-lab/ui-components';

type MainSearchProps = {
    assembly: "GRCh38" | "mm10";
    handleAssemblyChange: (asmb: "GRCh38" | "mm10") => void;
};

const MainSearch: React.FC<MainSearchProps> = ({ assembly, handleAssemblyChange }) => {

    const defaultResults: Result[] = useMemo(() => {
        if (assembly === "GRCh38") {
            return [
                {
                    title: "chr19:44,905,754-44,909,393",
                    domain: {
                        chromosome: "chr19",
                        start: 44905754,
                        end: 44909393,
                    },
                    description: "chr19:44,905,754-44,909,393",
                    type: "Coordinate",
                },
                {
                    title: "SP1",
                    description:
                        "Sp1 Transcription Factor\nENSG00000185591.10\nchr12:53380176-53416446",
                    domain: {
                        chromosome: "chr12",
                        start: 53380176,
                        end: 53416446,
                    },
                    type: "Gene",
                },
                {
                    title: "EH38E3314260",
                    description: "chr19:50417519-50417853",
                    domain: {
                        chromosome: "chr19",
                        start: 50417519,
                        end: 50417853,
                    },
                    type: "cCRE",
                },
                {
                    title: "rs9466027",
                    description: "chr6:21298226-21298227",
                    domain: {
                        chromosome: "chr6",
                        start: 21298226,
                        end: 21298227,
                    },
                    type: "SNP",
                },
                {
                    title: "Adiponectin Levels",
                    description: "Dastani Z\n22479202",
                    id: "Dastani_Z-22479202-Adiponectin_levels",
                    type: "Study",
                },
            ];
        } else return [
            {
                title: "chr7:19,696,109-19,699,188",
                domain: {
                    chromosome: "chr7",
                    start: 19696109,
                    end: 19699188,
                },
                description: "chr7:19,696,109-19,699,188",
                type: "Coordinate",
            },
            {
                title: "Sp1",
                description:
                    "Sp1 Transcription Factor\nENSMUSG00000001280.13\nchr15:102406143-102436404",
                domain: {
                    chromosome: "chr15",
                    start: 102406143,
                    end: 102436404,
                },
                type: "Gene",
            },
            {
                title: "EM10E1179536",
                description: "chr7:19698911-19699257",
                domain: {
                    chromosome: "chr7",
                    start: 19698911,
                    end: 19699257,
                },
                type: "cCRE",
            },
        ];
    }, [assembly]);

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
                        defaultResults={defaultResults}
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
