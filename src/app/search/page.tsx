"use client";
import { Alert, CircularProgress, Stack, Tooltip, Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { Assembly, isValidAssembly } from "common/types/globalTypes";
import { redirect } from "next/navigation";
import { use, useMemo } from "react";
import { Result, useEntityAutocomplete } from "@weng-lab/ui-components";
import { InfoOutline } from "@mui/icons-material";
import { makeResultLink } from "common/components/autocomplete";

/**
 * @todo
 * V2
 */

const ReturnEl = ({ result, assembly }: { result: Result; assembly: Assembly }) => {
  const url = makeResultLink(result, assembly);
  return (
    <LinkComponent href={url} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      <Typography>
        {result.type} - {result.type === "Gene" ? <i>{result.title}</i> : result.title}
      </Typography>
      <Tooltip
        title={
          <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
            {result.description}
          </Typography>
        }
      >
        <InfoOutline fontSize="small" />
      </Tooltip>
    </LinkComponent>
  );
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Need to test this with empty q
  const search = use(searchParams).q;
  const assembly = use(searchParams).assembly;

  //Should never happen, but check to make sure valid assembly just in case
  if (Array.isArray(search) || Array.isArray(assembly) || !isValidAssembly(assembly)) {
    redirect("/");
  }

  const searchStrings = search.split(" ");

  const geneVersion = useMemo(() => (assembly === "GRCh38" ? [29, 40] : 25), [assembly]);

  const limit = 10;

  const { data, loading, error } = useEntityAutocomplete(searchStrings, {
    queries: ["Gene", "cCRE", "SNP", "Coordinate", "Study"],
    assembly,
    geneVersion,
    limits: {
      gene: limit,
      snp: limit,
      icre: limit,
      ccre: limit,
      study: limit,
    },
  });

  return (
    <Stack spacing={2} margin={{ xs: 2, lg: 3, xl: 4 }} alignItems={"flex-start"}>
      <Typography variant="h3">{`Results matching "${search}"`}</Typography>
      <Typography variant="body2" maxWidth={700}>
        {
          "Results limited to 10 per result type. Search input is space-separated and terms searched separately. If you don't see what you're looking, please try to search directly on our site."
        }
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{`Error when searching ${search}`}</Alert>}
      {data.map((result, i) => (
        <ReturnEl result={result} assembly={assembly} key={i} />
      ))}
    </Stack>
  );
}
