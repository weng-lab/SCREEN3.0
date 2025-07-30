import React from 'react';
import {
    Box,
    Typography,
    Stack,
    IconButton,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type MultipleRegionSearchProps = {
    assembly: "GRCh38" | "mm10";
    multipleRegionSearchVisible?: boolean;
    toggleMultipleRegionSearchVisible: () => void;
};

const MultipleRegionSearch: React.FC<MultipleRegionSearchProps> = ({ assembly, multipleRegionSearchVisible, toggleMultipleRegionSearchVisible }) => {

    return (
        <>
            <Stack direction={"row"} alignItems="center" spacing={1}>
                <Typography>Multiple Region Search</Typography>
                <IconButton onClick={toggleMultipleRegionSearchVisible}>
                    {<ExpandLessIcon />}
                </IconButton>
            </Stack>
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
                    flexDirection: 'column',
                    mx: "auto",
                }}
            >
                <Stack spacing={2} mb={4} justifyContent="flex-start" alignItems="center">
                    <Typography variant="subtitle1" color="white" textAlign="left">
                        Search By
                    </Typography>
                </Stack>
                
            </Box>
        </>
    );
};

export default MultipleRegionSearch;
