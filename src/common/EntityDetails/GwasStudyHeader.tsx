import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { formatPortal } from "common/utility";
import { Assembly } from "types/globalTypes";
import Grid from "@mui/material/Grid";
import { LinkComponent } from "common/components/LinkComponent";
import { AnyEntityType } from "./entityTabsConfig";

export type GwasStudyHeaderProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
};

export const GwasStudyHeader = ({ assembly, entityType, entityID }: GwasStudyHeaderProps) => {
  const { data: entityMetadata, loading, error } = useEntityMetadata({ assembly, entityType, entityID });

  const subtitle =
    entityType === "gwas" && entityMetadata?.__typename === "GwasStudies"
      ? entityMetadata?.author.replaceAll("_", " ")
      : "";

  return (
    <Grid
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      container
    >
      <Grid size={12}>
        {entityMetadata ? (
          <Stack>
            <Typography variant="subtitle1">{formatPortal(entityType)} Details</Typography>
            <Typography variant="h4">
              {entityType === "gwas" && entityMetadata.__typename === "GwasStudies"
                ? entityMetadata.studyname
                : entityID}
            </Typography>
            <Typography>
              {loading ? (
                <Skeleton width={215} />
              ) : (
                <>
                  {subtitle + " "}
                  {entityType === "gwas" && entityMetadata.__typename === "GwasStudies" && (
                    <LinkComponent
                      openInNewTab
                      showExternalIcon
                      href={`https://pubmed.ncbi.nlm.nih.gov/${entityMetadata.pubmedid}`}
                    >
                      ({entityMetadata.pubmedid.trim()})
                    </LinkComponent>
                  )}
                </>
              )}
            </Typography>
          </Stack>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
};
