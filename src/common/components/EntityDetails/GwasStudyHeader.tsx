import { Button, Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { formatPortal } from "common/utility";
import { Assembly } from "common/types/globalTypes";
import Grid from "@mui/material/Grid";
import { LinkComponent } from "common/components/LinkComponent";
import { AnyEntityType } from "../../entityTabsConfig";
import { useMemo } from "react";
import { useGWASSnpsData } from "common/hooks/useGWASSnpsData";
import { expandCoordinates } from "../GenomeBrowser/utils";

export type GwasStudyHeaderProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
};

export const GwasStudyHeader = ({ assembly, entityType, entityID }: GwasStudyHeaderProps) => {
  const { data: entityMetadata, loading, error } = useEntityMetadata({ assembly, entityType, entityID });
  const { data: data, loading: GWASSnpsloading, error: GWASSnpserror } = useGWASSnpsData({ studyid: [entityID] });

  const ldblockStats = useMemo(() => {
    if (!data) return [];

    const map = new Map<number, { ldblock: number; chromosome: string; start: number; end: number }>();

    for (const { ldblock, chromosome, start, stop } of data) {
      if (!map.has(ldblock)) {
        map.set(ldblock, { ldblock, chromosome, start, end: stop });
      } else {
        const entry = map.get(ldblock)!;
        entry.start = Math.min(entry.start, start);
        entry.end = Math.max(entry.end, stop);
      }
    }

    return Array.from(map.values()).sort((a, b) => a.ldblock - b.ldblock);
  }, [data]);


  const subtitle =
    entityType === "gwas" && entityMetadata?.__typename === "GwasStudiesMetadata"
      ? entityMetadata && entityMetadata.__typename === "GwasStudiesMetadata" && entityMetadata?.author.replaceAll("_", " ")
      : "";
  const coordinatesGenomeBrowser = data && ldblockStats && ldblockStats.length > 0 ? expandCoordinates({ chromosome: ldblockStats[0].chromosome, start: ldblockStats[0].start, end: ldblockStats[0].end }, entityType) : undefined
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
        {entityMetadata ? (
          <Stack>
            <Typography variant="subtitle1">{formatPortal(entityType)} Details</Typography>
            <Typography variant="h4">
              {entityType === "gwas" && entityMetadata.__typename === "GwasStudiesMetadata"
                ? entityMetadata?.disease_trait
                : entityID}
            </Typography>
            <Typography>
              {loading ? (
                <Skeleton width={215} />
              ) : (
                <>
                  {subtitle + " "}
                  {entityType === "gwas" && entityMetadata.__typename === "GwasStudiesMetadata" && (
                    <LinkComponent
                      openInNewTab
                      showExternalIcon
                      href={`https://pubmed.ncbi.nlm.nih.gov/${entityMetadata?.studyid.split("-")[0].trim()}`}
                    >
                      ({entityMetadata?.studyid.split("-")[0].trim()})
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
      <Grid
        size={{ xs: 12, sm: 3 }}
        display={entityType === "ccre" ? "none" : "flex"}
        height={{ xs: 60 }}
        justifyContent={"flex-end"}
        alignItems="center"
        gap={1}
      >
        <Button
          variant="contained"
          href={
            coordinatesGenomeBrowser
              ? `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=hg38&g=cCREs&position=${coordinatesGenomeBrowser}`
              //: `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=hg38&g=cCREs&position=chr19:50,417,519-50,417,853`
              : `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=hg38&g=cCREs&position=default`
          }
          target="_blank"
          rel="noopener noreferrer"
          sx={{ width: "48%", height: "100%", backgroundColor: "white" }}
        >
          <Image
            style={{ objectFit: "contain" }}
            src={"https://genome.ucsc.edu/images/ucscHelixLogo.png"}
            fill
            unoptimized
            alt="ucsc-gb-icon"
          />

          Open in UCSC

        </Button>
      </Grid>
    </Grid>
  );
};
