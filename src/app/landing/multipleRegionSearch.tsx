import React, { useCallback, useState } from "react";
import { Box, Typography, Stack, IconButton, Button, Container, Tooltip } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Cancel } from "@mui/icons-material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { GenomicRange } from "common/types/globalTypes";
import { encodeRegions } from "common/utility";

type MultipleRegionSearchProps = {
  assembly: "GRCh38" | "mm10";
  toggleMultipleRegionSearchVisible: () => void;
};

const MultipleRegionSearch: React.FC<MultipleRegionSearchProps> = ({ assembly, toggleMultipleRegionSearchVisible }) => {
  const [file, setFile] = useState<File>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleReset = () => {
    setLoading(false);
    setFile(null);
  };

  //Encode the regions and open the tab
  const configureInputedRegions = useCallback(
    async (data, fileName: string) => {
      const regions: GenomicRange[] = data.map((item) => ({
        chromosome: item[0],
        start: Number(item[1]),
        end: Number(item[2]),
      }));

      setLoading(true);

      // Sort the regions
      const sortedRegions = regions.sort((a, b) => {
        const chrA = Number(a.chromosome.replace("chr", ""));
        const chrB = Number(b.chromosome.replace("chr", ""));

        if (chrA !== chrB) {
          return chrA - chrB;
        }
        return a.start - b.start;
      });
      const encoded = encodeRegions(sortedRegions);
      sessionStorage.setItem(fileName, encoded);
      window.open(`/${assembly}/bed/${fileName}`, "_self");
    },
    [assembly]
  );

  //read the file and retreive all lines
  const submitUploadedFile = () => {
    setLoading(true);
    const allLines = [];
    const filename = file.name;

    const reader = new FileReader();
    reader.onload = (r) => {
      const contents = r.target.result;
      const lines = contents.toString().split("\n");
      lines.forEach((line) => {
        // The if statement checks if the BED file has a header and does not push those
        // Also checks for empty lines
        if (!(line.startsWith("#") || line.startsWith("browser") || line.startsWith("track") || line.length === 0)) {
          allLines.push(line.split("\t"));
        }
      });
    };
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onloadend = () => {
      configureInputedRegions(allLines, filename.split(".")[0]);
    };
    reader.readAsText(file);
  };

  function truncateFileName(string, maxLength, ellipsis = "...") {
    if (string.length <= maxLength) {
      return string;
    }

    return string.substring(0, maxLength - ellipsis.length) + ellipsis;
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
        <Tooltip title="This will search a range of your uploaded regions">
          <HelpOutlineIcon sx={{ color: "white" }} />
        </Tooltip>
      </Box>
      <Box
        sx={{
          backgroundColor: "rgba(15, 25, 82, .8)",
          borderRadius: 2,
          padding: 3,
          display: "flex",
          width: { xs: "90%", sm: "80%", md: "60%", lg: "45%" },
          minWidth: { xs: "unset", md: 450 },
          alignItems: "stretch",
          flexDirection: "column",
        }}
      >
        <Stack>
          {file === null ? (
            <Container
              sx={{
                border: isDragActive ? "2px dashed blue" : "none",
                borderRadius: "10px",
                color: isDragActive ? "text.secondary" : "text.primary",
                backgroundColor: "white",
                height: "192.5px", //exact height of text box with buttons so no height changes
              }}
            >
              <div {...getRootProps()} style={{ padding: "1rem" }}>
                <input {...getInputProps()} type="file" accept=".bed" />
                <Stack spacing={1} direction="column" alignItems="center">
                  <UploadFileIcon />
                  <Typography>Drag and drop a .bed file</Typography>
                  <Typography>or</Typography>
                  <Button variant="contained" disabled={isDragActive}>
                    Browse files on your computer
                  </Button>
                </Stack>
              </div>
            </Container>
          ) : (
            <Box justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"}>
              <Typography mb={1} variant="h5" color="white">
                Uploaded:
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography color="white">
                  {`${truncateFileName(file.name, 40)}\u00A0-\u00A0${(file.size / 1000000).toFixed(1)}\u00A0mb`}
                </Typography>
                <IconButton sx={{ color: "white" }} onClick={handleReset}>
                  <Cancel />
                </IconButton>
              </Stack>
              <Button
                loadingPosition="end"
                loading={loading}
                sx={{ textTransform: "none", maxWidth: "18rem" }}
                onClick={submitUploadedFile}
                variant="contained"
                color="primary"
              >
                <span>Submit</span>
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default MultipleRegionSearch;
