import React, { useState } from 'react';
import { Box, Radio, RadioGroup, FormControlLabel, Typography, Stack, IconButton, FormHelperText, FormControl } from '@mui/material';
import AutoComplete from 'common/components/autocomplete';
import { Search } from '@mui/icons-material';
import { theme } from 'app/theme';

const MainSearch: React.FC = () => {
    const [assembly, setAssembly] = useState<"GRCh38" | "mm10">('GRCh38');

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "rgba(15, 25, 82, .8)",
                    borderRadius: 2,
                    padding: 4,
                    display: 'flex',
                    width: "45%",
                    minWidth: 450,
                    marginTop: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Stack marginBottom={4} justifyContent={"center"} alignItems="center">
                    <Typography variant="subtitle1" color="white">
                        I&apos;m searching for cCRE&apos;s in:
                    </Typography>
                    <RadioGroup
                        value={assembly}
                        onChange={(e) => setAssembly(e.target.value as "GRCh38" | "mm10")}
                        row
                        sx={{ justifyContent: "center", alignItems: "center", gap: 6 }}
                    >
                        <FormControlLabel
                            value="GRCh38"
                            control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                            label={<Typography color="white">Human</Typography>}
                            sx={{ marginRight: 0 }}
                        />
                        <FormControlLabel
                            value="mm10"
                            control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                            label={<Typography color="white">Mouse</Typography>}
                            sx={{ marginRight: 0 }}
                        />
                    </RadioGroup>
                </Stack>
                <FormControl sx={{ width: 400 }} >
                    <AutoComplete
                        sx={{ display: { xs: "none", md: "flex" } }}
                        style={{ width: "100%" }}
                        slots={{
                            button: (
                                <IconButton sx={{ color: "white" }}>
                                    <Search />
                                </IconButton>
                            ),
                        }}
                        assembly={assembly}
                        id="desktop-search-component"
                        slotProps={{
                            box: { gap: 1 },
                            input: {
                                size: "small",
                                label: "Enter a gene, cCRE, variant or locus",
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
                    <FormHelperText sx={{ marginLeft: 0, color: "white" }}>
                        Try &quot;<i>SOX4</i>&quot;, &quot;rs9466027&quot;, or &quot;chr11:12345678-12345679&quot;
                    </FormHelperText>
                </FormControl>
            </Box>
            <Box sx={{ width: "45%", display: "flex", justifyContent: "flex-end" }}>
                <Typography variant="subtitle2" color={theme.palette.secondary.light}>
                    Looking to search multiple regions?{" "}
                    <a href="#" style={{ color: theme.palette.secondary.light, textDecoration: "underline" }}>
                        Click here!
                    </a>
                </Typography>
            </Box>
        </>
    );
};

export default MainSearch;