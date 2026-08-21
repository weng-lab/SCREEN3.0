import { Alert, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ReactNode } from "react";

export type EntityHeaderLayoutProps = {
  /** Names the kind of entity, sits above the title — "Gene Details", "Region Search" */
  label: ReactNode;
  /**
   * What the entity is called. Each header owns its own loading treatment here, since some know
   * their title up front (an accession from the route) and others have to fetch it.
   */
  title: ReactNode;
  /** Detail line below the title. Omit entirely for headers with nothing to put there */
  subtitle?: ReactNode;
  /**
   * Replaces the subtitle when the header's primary fetch fails. A secondary fetch that only costs
   * part of the subtitle should use AsyncText instead, so the rest of the line still renders.
   */
  errorMessage?: string | null;
  /** External resource buttons, laid out in a row opposite the title */
  actions?: ReactNode;
};

/**
 * Shared chrome for the entity headers: the bordered container, the label/title/subtitle column,
 * and the actions column. Each entity type supplies its own content through a thin wrapper
 * component, which is where its data fetching lives.
 */
export const EntityHeaderLayout = ({ label, title, subtitle, errorMessage, actions }: EntityHeaderLayoutProps) => {
  return (
    <Grid
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      container
    >
      <Grid size={{ xs: 12, sm: 9 }}>
        <Stack>
          <Typography variant="subtitle1">{label}</Typography>
          <Typography variant="h4">{title}</Typography>
          {errorMessage ? (
            <Alert severity="error" variant="outlined" sx={{ alignSelf: "flex-start" }}>
              {errorMessage}
            </Alert>
          ) : (
            subtitle !== undefined && <Typography>{subtitle}</Typography>
          )}
        </Stack>
      </Grid>
      {actions && (
        <Grid
          size={{ xs: 12, sm: "auto" }}
          display={"flex"}
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
          alignItems={"flex-start"}
          gap={1}
        >
          {actions}
        </Grid>
      )}
    </Grid>
  );
};
