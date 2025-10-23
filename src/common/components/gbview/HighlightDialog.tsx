import {
  Box,
  DialogContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DialogTitle } from "@mui/material";
import { Dialog } from "@mui/material";
import { Delete, Add, ExpandMore } from "@mui/icons-material";
import { BrowserStoreInstance, Highlight as GBHighlight, Chromosome } from "@weng-lab/genomebrowser";
import { useState } from "react";

// Valid chromosome values for human genome (GRCh38)
const VALID_CHROMOSOMES: Chromosome[] = [
  "chr1",
  "chr2",
  "chr3",
  "chr4",
  "chr5",
  "chr6",
  "chr7",
  "chr8",
  "chr9",
  "chr10",
  "chr11",
  "chr12",
  "chr13",
  "chr14",
  "chr15",
  "chr16",
  "chr17",
  "chr18",
  "chr19",
  "chr20",
  "chr21",
  "chr22",
  "chrX",
  "chrY",
];

// Highlight Creation Form Component
function HighlightCreationForm({ browserStore }: { browserStore: BrowserStoreInstance }) {
  const addHighlight = browserStore((state) => state.addHighlight);
  const currentDomain = browserStore((state) => state.domain);

  const [newHighlight, setNewHighlight] = useState({
    id: "",
    chromosome: "",
    start: "",
    end: "",
    color: "#0000FF",
  });

  const [errors, setErrors] = useState({
    chromosome: "",
    start: "",
    end: "",
  });

  const validateChromosome = (chromosome: string): string => {
    if (!chromosome) return "Chromosome is required";
    if (!VALID_CHROMOSOMES.includes(chromosome as Chromosome)) {
      return "Invalid chromosome. Use format: chr1, chr2, ..., chr22, chrX, chrY";
    }
    return "";
  };

  const validatePosition = (position: string, field: "start" | "end"): string => {
    if (!position) return `${field.charAt(0).toUpperCase() + field.slice(1)} position is required`;
    const num = parseInt(position);
    if (isNaN(num)) return `${field.charAt(0).toUpperCase() + field.slice(1)} must be a number`;
    if (num < 0) return `${field.charAt(0).toUpperCase() + field.slice(1)} must be positive`;
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setNewHighlight((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSetCurrentDomain = () => {
    handleInputChange("chromosome", currentDomain.chromosome);
    handleInputChange("start", currentDomain.start.toString());
    handleInputChange("end", currentDomain.end.toString());
  };

  const handleAddHighlight = () => {
    // Validate all fields
    const chromosomeError = validateChromosome(newHighlight.chromosome);
    const startError = validatePosition(newHighlight.start, "start");
    const endError = validatePosition(newHighlight.end, "end");

    // Additional validation for start < end
    let finalEndError = endError;
    if (!startError && !endError) {
      const start = parseInt(newHighlight.start);
      const end = parseInt(newHighlight.end);
      if (start >= end) {
        finalEndError = "End position must be greater than start position";
      }
    }

    setErrors({
      chromosome: chromosomeError,
      start: startError,
      end: finalEndError,
    });

    // If no errors, add the highlight
    if (!chromosomeError && !startError && !finalEndError) {
      addHighlight({
        id: newHighlight.id,
        domain: {
          chromosome: newHighlight.chromosome,
          start: parseInt(newHighlight.start),
          end: parseInt(newHighlight.end),
        },
        color: newHighlight.color,
      });

      // Reset form
      setNewHighlight({
        id: "",
        chromosome: "",
        start: "",
        end: "",
        color: "#0000FF",
      });
      setErrors({
        chromosome: "",
        start: "",
        end: "",
      });
    }
  };

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="highlight-form-content"
        id="highlight-form-header"
        sx={{
          backgroundColor: "#f5f5f5",
          "&:hover": {
            backgroundColor: "lightgray",
          },
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <Add sx={{ mr: 1 }} />
          Add New Highlight
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Chromosome"
              value={newHighlight.chromosome}
              onChange={(e) => handleInputChange("chromosome", e.target.value)}
              size="small"
              placeholder="e.g., chr1"
              error={!!errors.chromosome}
              helperText={errors.chromosome}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Start Position"
              value={newHighlight.start}
              onChange={(e) => handleInputChange("start", e.target.value)}
              size="small"
              placeholder="e.g., 1000000"
              type="number"
              error={!!errors.start}
              helperText={errors.start}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="End Position"
              value={newHighlight.end}
              onChange={(e) => handleInputChange("end", e.target.value)}
              size="small"
              placeholder="e.g., 2000000"
              type="number"
              error={!!errors.end}
              helperText={errors.end}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Color"
              value={newHighlight.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
              size="small"
              type="color"
              sx={{
                "& input[type='color']": {
                  height: "23px",
                  cursor: "pointer",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="ID"
              value={newHighlight.id}
              onChange={(e) => handleInputChange("id", e.target.value)}
              size="small"
              placeholder="Enter highlight ID"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button variant="contained" fullWidth onClick={handleSetCurrentDomain}>
              Use Current Region
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddHighlight}
              disabled={!newHighlight.id || !newHighlight.chromosome || !newHighlight.start || !newHighlight.end}
            >
              Add Highlight
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

// Individual Highlight Item Component
function HighlightItem({
  highlight,
  index,
  browserStore,
}: {
  highlight: GBHighlight;
  index: number;
  browserStore: BrowserStoreInstance;
}) {
  const removeHighlight = browserStore((state) => state.removeHighlight);

  const handleRemoveHighlight = (highlightId: string) => {
    removeHighlight(highlightId);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="left"
      width="100%"
      bgcolor={index % 2 === 0 ? "#f5f5f5" : "white"}
      sx={{
        "&:hover": {
          backgroundColor: "lightgray",
        },
      }}
      p={2}
      mb={1}
    >
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" color={highlight.color}>
          {highlight.id}
        </Typography>
        <IconButton
          size="small"
          onClick={() => handleRemoveHighlight(highlight.id)}
          sx={{
            color: "gray",
            "&:hover": {
              color: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
            },
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color={"gray"}>
          {highlight.domain.chromosome}:{highlight.domain.start.toLocaleString()}-
          {highlight.domain.end.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

// Highlights List Component
function HighlightsList({ browserStore }: { browserStore: BrowserStoreInstance }) {
  const highlights = browserStore((state) => state.highlights);

  return (
    <>
      {highlights.map((highlight, index) => (
        <HighlightItem
          key={highlight.id}
          highlight={{ ...highlight, domain: highlight.domain }}
          index={index}
          browserStore={browserStore}
        />
      ))}
    </>
  );
}

// Main Dialog Component
export default function HighlightDialog({
  open,
  setOpen,
  browserStore,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  browserStore: BrowserStoreInstance;
}) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Current Highlights</DialogTitle>
      <DialogContent>
        <HighlightCreationForm browserStore={browserStore} />
        <HighlightsList browserStore={browserStore} />
      </DialogContent>
    </Dialog>
  );
}
