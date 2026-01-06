"use client";
import { Alert, CircularProgress, Stack, Tooltip, Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { Assembly, isValidAssembly } from "common/types/globalTypes";
import { redirect } from "next/navigation";
import { use, useMemo } from "react";
import { Result, useEntityAutocomplete } from "@weng-lab/ui-components";
import { makeResultLink } from "common/components/autocomplete";
import { useV2Ccres } from "./useV2Ccres";

const ReturnEl = ({ result, assembly }: { result: Result; assembly: Assembly }) => {
  const url = makeResultLink(result, assembly);
  return (
    <span>
      <LinkComponent href={url} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
        {result.type === "Gene" ? <i>{result.title}</i> : result.title}
      </LinkComponent>
      {result.type !== "Coordinate" && (
        <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
          {result.description}
        </Typography>
      )}
    </span>
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

  /**
   * Temporary fix for supporting v2 cCREs
   */
  const { data: V2Data, loading: V2Loading, error: V2Error } = useV2Ccres(oldScreenAccessions.split(","), assembly);

  return (
    <Stack spacing={2} margin={{ xs: 2, lg: 3, xl: 4 }} maxWidth={800}>
      <Typography variant="h4">{`Results matching "${searchStrings.join(" ")}"`}</Typography>
      <Typography variant="body2">
        If you are coming from the ENCODE portal, please find results related to your query below. If you are revising
        this link saved from a previous version of this site, we have attempted to pulled out some items from the URL
        which may be relvant to you.{" "}
        <LinkComponent href={"/about#versions"}>Please see old versions of SCREEN here</LinkComponent>
      </Typography>
      <Typography variant="body2">
        Search input is space-separated and terms are searched separately. Results are limited to 10 per result type per
        search term. If you don&apos;t see what you&apos;re looking, please try to search directly on our site.
      </Typography>
      {/* Temporary fix for supporting current V2 functionality */}
      {V2Error && <Alert severity="error">{`Error when searching for v2 legacy cCREs`}</Alert>}
      {V2Data && V2Data.getv2cCREMappings.length !== 0 && (
        <div>
          <Typography variant="h5">Legacy v2 cCRE</Typography>
          <Stack alignItems={"flex-start"} spacing={1}>
            {V2Data.getv2cCREMappings.map((result, idx) => (
              <div key={idx}>
                <span>
                  <Tooltip
                    arrow
                    placement="right"
                    title="Opens on old v2 SCREEN site. We recommend using the new site and v4 registry when possible. Previous versions of SCREEN are not actively updated."
                  >
                    <LinkComponent
                      href={`https://screen-v2.wenglab.org/search/?q=${result.v2_accession}&assembly=${assembly}`}
                      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                      showExternalIcon
                      openInNewTab
                    >
                      {result.v2_accession}
                    </LinkComponent>
                  </Tooltip>
                  <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
                    {result.v2_region}
                  </Typography>
                </span>
                {result.v4_accession ? (
                  <>
                    <Typography display={"inline"}>
                      {`Intersecting v4 cCRE${result.v4_accession.split(",").length > 1 ? "s" : ""}: `}
                    </Typography>
                    {result.v4_accession.split(",").map((accession, i, arr) => (
                      <span key={i}>
                        <LinkComponent
                          href={`/${assembly}/ccre/${accession}`}
                          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                        >
                          {accession}
                        </LinkComponent>
                        {!(i === arr.length - 1) && ", "}
                      </span>
                    ))}
                  </>
                ) : (
                  <Typography display={"inline"}>This cCRE has been deprecated in v4 of the cCRE registry</Typography>
                )}
              </div>
            ))}
          </Stack>
        </div>
      )}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{`Error when searching ${searchStrings.join(" ")}`}</Alert>}
      {!loading && results.length === 0 && !(V2Data && V2Data.getv2cCREMappings.length > 0) && (
        <Typography>No Results</Typography>
      )}
      {Object.keys(grouped).map((t) => (
        <div key={t}>
          <Typography variant="h5">{t}</Typography>
          <Stack alignItems={"flex-start"} spacing={1}>
            {grouped[t].map((result, idx) => (
              <ReturnEl result={result} assembly={assembly} key={`${t}-${idx}`} />
            ))}
          </Stack>
        </div>
      ))}
    </Stack>
  );
}
