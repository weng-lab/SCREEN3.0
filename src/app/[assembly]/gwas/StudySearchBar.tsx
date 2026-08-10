import { CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Close } from "@mui/icons-material";

type StudySearchBarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  activeCategory: string | null;
  loading: boolean;
};

export default function StudySearchBar({ search, onSearchChange, activeCategory, loading }: StudySearchBarProps) {
  if (loading) {
    return (
      <>
        <CircularProgress size={20} /> <span>Fetching GWAS Studies…</span>
      </>
    );
  }

  return (
    <TextField
      fullWidth
      label="Disease/Trait, Author, PubMed ID"
      placeholder={!activeCategory ? "Search all categories and studies..." : `Search ${activeCategory} studies...`}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      slotProps={{
        input: {
          endAdornment: search ? (
            <IconButton onClick={() => onSearchChange("")}>
              <Close />
            </IconButton>
          ) : (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
