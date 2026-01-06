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
    <Tooltip
      placement="right"
      arrow
      title={
        <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
          {result.description}
        </Typography>
      }
    >
      <LinkComponent href={url} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
        <Typography>{result.type === "Gene" ? <i>{result.title}</i> : result.title}</Typography>
        <InfoOutline fontSize="small" />
      </LinkComponent>
    </Tooltip>
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

  const results = data ?? [];

  const grouped = results.reduce<Record<string, Result[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <Stack spacing={2} margin={{ xs: 2, lg: 3, xl: 4 }}>
      <Typography variant="h3">{`Results matching "${search}"`}</Typography>
      <Typography variant="body2" maxWidth={700}>
        {
          "Search input is space-separated and terms are searched separately. Results are limited to 10 per result type per search term. If you don't see what you're looking, please try to search directly on our site."
        }
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{`Error when searching ${search}`}</Alert>}
      {!loading && results.length === 0 && <Typography>No Results</Typography>}
      {Object.keys(grouped).map((t) => (
        <div key={t} style={{ width: "100%" }}>
          <Typography variant="h5">{t}</Typography>
          <Stack alignItems={"flex-start"}>
            {grouped[t].map((result, idx) => (
              <ReturnEl result={result} assembly={assembly} key={`${t}-${idx}`} />
            ))}
          </Stack>
        </div>
      ))}
    </Stack>
  );
}
