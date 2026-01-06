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
  const assembly = use(searchParams).assembly;
  const encodeSearch = use(searchParams).q || "";
  const oldScreenGene = use(searchParams).gene;
  const oldScreenAccessions = use(searchParams).accessions || "";
  const oldScreenSNP = use(searchParams).snpid;
  const oldScreenChr = use(searchParams).chromosome;
  const oldScreenStart = use(searchParams).start;
  const oldScreenEnd = use(searchParams).end;

  const oldScreenCoordinates =
    oldScreenChr && oldScreenStart && oldScreenEnd ? `${oldScreenChr}:${oldScreenStart}-${oldScreenEnd}` : null;

  //Should never happen, but check to make sure no duplicate entries for params and has valid assembly just in case
  if (
    Array.isArray(oldScreenGene) ||
    Array.isArray(oldScreenAccessions) ||
    Array.isArray(oldScreenSNP) ||
    Array.isArray(encodeSearch) ||
    Array.isArray(assembly) ||
    !isValidAssembly(assembly)
  ) {
    redirect("/");
  }

  const searchStrings = [
    ...encodeSearch.split(" "),
    oldScreenGene,
    oldScreenSNP,
    oldScreenCoordinates,
    ...oldScreenAccessions.split(","),
  ].filter((x) => x);

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
      <Typography variant="h4">{`Results matching "${searchStrings.join(" ")}"`}</Typography>
      <Typography variant="body2" maxWidth={700}>
        If you are coming from the ENCODE portal, please find results related to your query below. If you are revising
        this link saved from a previous version of this site, we have attempted to pulled out some items from the URL
        which may be relvant to you.{" "}
        <LinkComponent href={"/about#versions"}>Please see old versions of SCREEN here</LinkComponent>
      </Typography>
      <Typography variant="body2" maxWidth={700}>
        Search input is space-separated and terms are searched separately. Results are limited to 10 per result type per
        search term. If you don&apos;t see what you&apos;re looking, please try to search directly on our site.
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{`Error when searching ${searchStrings.join(" ")}`}</Alert>}
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
