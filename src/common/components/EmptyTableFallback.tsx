import { Paper, Typography } from "@mui/material";

export type EmptyTableFallbackProps = {
  message: string
}

const EmptyTableFallback = ({message}: EmptyTableFallbackProps) => {
  return (
    <Paper>
      <Typography variant="h6" p={2} border={"1px solid #e0e0e0"} borderRadius={1}>
        {message}
      </Typography>
    </Paper>
  );
};

export default EmptyTableFallback