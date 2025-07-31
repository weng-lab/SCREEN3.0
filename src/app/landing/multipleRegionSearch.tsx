import React, { useCallback, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    IconButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    Container,
    FormControl,
    TextField,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDropzone } from "react-dropzone"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Cancel } from '@mui/icons-material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RequiredFieldsDialog from './requiredFieldsDialog';

type MultipleRegionSearchProps = {
    assembly: "GRCh38" | "mm10";
    toggleMultipleRegionSearchVisible: () => void;
};

//TODO - Add functionality to handle the uploaded file and text input
const MultipleRegionSearch: React.FC<MultipleRegionSearchProps> = ({ assembly, toggleMultipleRegionSearchVisible }) => {
    const [searchBy, setSearhBy] = useState<string>("tsv");
    const [files, setFiles] = useState<File>(null)
    const [textValue, setTextValue] = useState(""); // State to control the TextField value
    const [submittedText, setSubmittedText] = useState("")
    const [textChanged, setTextChanged] = useState(true);
    const [helpOpen, setHelpOpen] = useState(false);

    const handleHelpOpen = () => setHelpOpen(true);
    const handleHelpClose = () => setHelpOpen(false);

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles[0]);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleReset = () => {
        setFiles(null);
    };

    const handleSearchChange = (search: string) => {
        setSearhBy(search);
    }

    //Allow the user to insert a tab in the text box
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;

            // Insert tab character at the cursor position
            target.value =
                target.value.substring(0, start) +
                '\t' +
                target.value.substring(end);

            // Move the cursor after the inserted tab character
            target.selectionStart = target.selectionEnd = start + 1;
        }
    };

    function truncateFileName(string, maxLength, ellipsis = "...") {
        if (string.length <= maxLength) {
            return string;
        }

        return string.substring(0, maxLength - ellipsis.length) + ellipsis;
    }

    function submitTextUpload(event) {
        // const uploadedData = event.get("textUploadFile").toString()
        // const inputData = parseDataInput(uploadedData)
        // configureInputedRegions(inputData)
    }

    return (
        <Box mt={5} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"}>
            <Box
                sx={{
                    width: { xs: "90%", sm: "80%", md: "60%", lg: "45%" },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mx: "auto",
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton onClick={toggleMultipleRegionSearchVisible} sx={{ color: "white" }}>
                        <ExpandLessIcon />
                    </IconButton>
                    <Typography color="white" variant="h5">
                        Multiple Region Search
                    </Typography>
                </Stack>
                <IconButton sx={{ color: "white" }} onClick={handleHelpOpen}>
                    <HelpOutlineIcon />
                </IconButton>
            </Box>
            <Box
                sx={{
                    backgroundColor: "rgba(15, 25, 82, .8)",
                    borderRadius: 2,
                    padding: 3,
                    display: 'flex',
                    width: { xs: "90%", sm: "80%", md: "60%", lg: "45%" },
                    minWidth: { xs: "unset", md: 450 },
                    alignItems: 'stretch',
                    flexDirection: 'column',
                }}
            >
                <Stack>
                    <Typography variant="subtitle1" color="white" textAlign="left">
                        Search By
                    </Typography>
                    <RadioGroup
                        value={searchBy}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        row
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 4,
                            flexWrap: "wrap",
                        }}
                    >
                        {["tsv", "text"].map((value) => (
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
                                        {value === "tsv" ? "TSV File" : "Text Box"}
                                    </Typography>
                                }
                                sx={{ marginRight: 0 }}
                            />
                        ))}
                    </RadioGroup>
                    {searchBy === "tsv" ? (
                        <>
                            {files === null ? (
                                <Container
                                    sx={{
                                        border: isDragActive ? "2px dashed blue" : "none",
                                        borderRadius: "10px",
                                        minWidth: "250px",
                                        color: isDragActive ? "text.secondary" : "text.primary",
                                        backgroundColor: "white"
                                    }}
                                >
                                    <div {...getRootProps()} style={{ padding: "1rem" }}>
                                        <input {...getInputProps()} type="file" accept=".tsv" />
                                        <Stack spacing={1} direction="column" alignItems="center">
                                            <UploadFileIcon />
                                            <Typography>Drag and drop a .tsv file</Typography>
                                            <Typography>or</Typography>
                                            <Button variant="contained" disabled={isDragActive}>
                                                Browse files on your computer
                                            </Button>
                                        </Stack>
                                    </div>
                                </Container>
                            ) : (
                                <>
                                    <Typography mb={1} variant="h5">Uploaded:</Typography>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Typography>
                                            {`${truncateFileName(files.name, 40)}\u00A0-\u00A0${(files.size / 1000000).toFixed(1)}\u00A0mb`}
                                        </Typography>
                                        <IconButton color="primary" onClick={handleReset}>
                                            <Cancel />
                                        </IconButton>
                                    </Stack>
                                    <Button
                                        loadingPosition="end"
                                        sx={{ textTransform: 'none', maxWidth: "18rem" }}
                                        // onClick={() => submitUploadedFile(files)}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        <span>Submit</span>
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <FormControl fullWidth>
                            <form action={submitTextUpload}>
                                <TextField
                                    name="textUploadFile"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    placeholder="Copy and paste your data from Excel here"
                                    onKeyDown={handleKeyDown}
                                    value={textValue}
                                    onChange={(e) => setTextValue(e.target.value)}
                                    sx={{ backgroundColor: "#ffffff" }}
                                />
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ mt: 1 }}
                                >
                                    <Button
                                        loadingPosition="end"
                                        type="submit"
                                        size="medium"
                                        variant="contained"
                                        disabled={!textChanged}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        color="error"
                                        type="button"
                                        size="medium"
                                        variant="contained"
                                        onClick={handleReset}
                                        sx={{ textTransform: "none" }}
                                    >
                                        Reset
                                    </Button>
                                </Stack>
                            </form>
                        </FormControl>
                    )}
                </Stack>
            </Box>
            <RequiredFieldsDialog
                open={helpOpen}
                onClose={handleHelpClose}
            />
        </Box>
    );
};

export default MultipleRegionSearch;
