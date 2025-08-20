import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { formatPortal } from "common/utility";
import { Assembly, EntityType } from "types/globalTypes";

import Grid2 from "@mui/material/Grid2";
import { LinkComponent } from "common/components/LinkComponent";

export type GwasStudyHeaderProps = {
  assembly: Assembly;
  entityType: EntityType;
  entityID: string;
};

export const GwasStudyHeader = ({ assembly, entityType, entityID }: GwasStudyHeaderProps) => {
  const { data: entityMetadata, loading, error } = useEntityMetadata({ assembly, entityType, entityID });



  const subtitle =
    entityType === "gwas" && entityMetadata.__typename==="GWAS" ? (
      entityMetadata.author 
    )  : (
      ""
    );

  return (
    <Grid2
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      container
    >
      <Grid2 size={{ xs: 12, sm: 9 }}>
        <Stack>
          <Typography variant="subtitle1">{formatPortal(entityType)} Details</Typography>
          <Typography variant="h4">
            {entityType === "gwas" && entityMetadata.__typename==="GWAS"? entityMetadata.study_name : entityID}
            
            
          </Typography>
          <Typography>{loading ? <Skeleton width={215} /> : <>{subtitle}
             { entityType === "gwas" && entityMetadata.__typename==="GWAS" && <LinkComponent openInNewTab showExternalIcon href={`https://pubmed.ncbi.nlm.nih.gov/${entityMetadata.pubmedid}`}>
                      {"  ("}{entityMetadata.pubmedid} {")"}
                    </LinkComponent>}
          </>}</Typography>
        </Stack>
      </Grid2>
    
    </Grid2>
  );
};