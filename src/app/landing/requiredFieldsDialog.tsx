import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Typography,
    Box,
    IconButton,
    Button,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface RequiredFieldsDialogProps {
    open: boolean;
    onClose: () => void;
}

const RequiredFieldsDialog: React.FC<RequiredFieldsDialogProps> = ({
    open,
    onClose,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {
                borderRadius: 4,
                minWidth: 700,
                maxWidth: "90%",
                backgroundColor: "white",
            },
        }}
    >
        <DialogTitle
            sx={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
                px: 3,
                pt: 3,
            }}
        >
            Required Fields
            <IconButton onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 0, pb: 2 }}>
            <Typography variant="body1" mb={2}>
                • <strong>.tsv file</strong> should contain the following fields
            </Typography>

            <Table
                sx={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    mb: 2,
                    "& td": {
                        border: "1px solid #aaa",
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#1a237e",
                        px: 2,
                        py: 1,
                    },
                    "& td:first-of-type": {
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                    },
                    "& td:last-of-type": {
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                    },
                }}
            >
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Tooltip title="Chromosome where the variant is located Ex: Chr1" arrow>
                                <span>Chromosome</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Tooltip title="Start position of the variant Ex: 1000000" arrow>
                                <span>Start</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Tooltip title="End position of the variant Ex: 1000001" arrow>
                                <span>End</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Tooltip title="Original Sequence Ex: G" arrow>
                                <span>Reference Allele</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Tooltip title="Mutated Sequence, Insertion Ex: C, Deletion Ex: -" arrow>
                                <span>Alternate Allele</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Tooltip title="Strand information (+ or -)" arrow>
                                <span>Strand</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>
                            <Tooltip title="Optional region identifier, String or Number" arrow>
                                <span>Region ID (optional)</span>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Typography variant="body1" mb={2}>
                • If using the text box, separate fields with a tab. Below is an example file to help you format your data correctly.
            </Typography>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
            >
                <Button
                    startIcon={<DownloadIcon />}
                    variant="outlined"
                >
                    Download example file
                </Button>

                <Button
                    startIcon={<UploadFileIcon />}
                    variant="outlined"
                >
                    Use example file
                </Button>
            </Stack>
        </DialogContent>
    </Dialog>
);

export default RequiredFieldsDialog;
