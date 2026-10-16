"use client";
import { Alert, CircularProgress, Divider, Paper, Stack, Tab, Tooltip, Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { Assembly, isValidAssembly } from "common/types/globalTypes";
import { redirect } from "next/navigation";
import { use, useMemo, useState } from "react";
import { Result, useEntityAutocomplete } from "@weng-lab/ui-components";
import { makeResultLink } from "common/components/MainSearchAutocomplete";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const ReturnEl = ({ result, assembly }: { result: Result; assembly: Assembly }) => {
  const url = makeResultLink(result, assembly);
  return (
    <Paper sx={{ p: 2 }}>
      <LinkComponent href={url} sx={{ display: "block", alignItems: "center", gap: 0.5 }}>
        {result.type === "Gene" ? <i>{result.title}</i> : result.title}
      </LinkComponent>
      <Typography variant="body2">{result.description.trim().split("\n").join(", ")}</Typography>
    </Paper>
  );
};

const LegacyCcreReturnEl = ({ result, assembly }: { result: Result; assembly: Assembly }) => {
  const url = `https://screen-${result.description.includes("v2") ? "v2" : "v3"}.wenglab.org/search/?q=${result.title}&assembly=${assembly}`;
  return (
    <Paper sx={{ p: 2 }}>
      <Tooltip
        arrow
        placement="right-end"
        title={
          <>
            &#x26A0; Opens cCRE on legacy SCREEN {result.description.includes("v2") ? "v2" : "v3"} site. When possible
            we recommend using version 4 of the cCRE registry available on this site.
          </>
        }
      >
        <LinkComponent
          width={"fit-content"}
          href={url}
          showExternalIcon
          openInNewTab
          sx={{ display: "block", alignItems: "center", gap: 0.5 }}
        >
          {result.type === "Gene" ? <i>{result.title}</i> : result.title}
        </LinkComponent>
      </Tooltip>
      <Typography variant="body2">
        {result.description.includes("No intersecting v4 cCREs") ? (
          <>
            {result.description.trim().split("\n").join(", ")}
            {": "}
            <LinkComponent
              href={`/${assembly}/region/${result.domain.chromosome}:${result.domain.start - 1000}-${result.domain.end + 1000}`}
            >
              Search for v4 cCREs within 1kb of these coordinates
            </LinkComponent>
          </>
        ) : (
          result.description
            .trim()
            .split("\n")
            .join(", ")
            .split(/(EH38[A-Z0-9]+|EM10[A-Z0-9]+)/g)
            .map((part) =>
              /^(EH38|EM10)[A-Z0-9]+$/.test(part) ? (
                <LinkComponent key={part} href={`/${assembly}/ccre/${part}`}>
                  {part}
                </LinkComponent>
              ) : (
                part
              )
            )
        )}
      </Typography>
    </Paper>
  );
};

const Header = ({ title }: { title: string }) => (
  <div>
    <Typography variant="h6" fontWeight={700}>
      {title}
    </Typography>
    <Divider />
  </div>
);

const AlertSection = ({ type }: { type: "encode" | "old-screen" | "no-results" }) => {
  switch (type) {
    case "encode":
      return (
        <Alert severity="info" variant="outlined">
          <b>Results are limited to 10 per result type</b> per search term. If you don&apos;t see what you&apos;re
          looking for, please try to search directly on our site or visiting our downloads section.
        </Alert>
      );
    case "old-screen":
      return (
        <Alert severity="info" variant="outlined">
          <b>This site has been updated</b>. We&apos;ve pulled the relevant search terms from your URL and displayed
          results below. <LinkComponent href="/about#versions">[View old versions of SCREEN here]</LinkComponent>. If
          you don&apos;t see what you&apos;re looking for, please try to search directly on our site or visiting our
          downloads section.
        </Alert>
      );
    case "no-results":
      return (
        <Alert severity="error" variant="outlined">
          SCREEN searches for specific genes, cCREs, SNPs, and coordinates. General terms like &quot;promoters&quot; may
          not return results. If you don&apos;t see what you&apos;re looking for, please try to search directly on our
          or visiting our downloads section.
        </Alert>
      );
  }
};

type RawSearchParams = { [key: string]: string | string[] | undefined };

/**
 * Reads both the current `q` search and the legacy SCREEN URL params (gene/snpid/accessions/
 * coordinates), which the old site linked to directly. Redirects home on anything malformed.
 */
const parseSearchParams = (params: RawSearchParams) => {
  const { assembly, gene: oldScreenGene, snpid: oldScreenSNP } = params;
  const encodeSearch = params.q || "";
  const oldScreenAccessions = params.accessions || "";

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

  const { chromosome, start, end } = params;
  const oldScreenCoordinates = chromosome && start && end ? `${chromosome}:${start}-${end}` : null;

  const searchStrings: string[] = [
    ...encodeSearch.split(" "),
    oldScreenGene,
    oldScreenSNP,
    oldScreenCoordinates,
    ...oldScreenAccessions.split(","),
  ].filter((x) => x);

  return { assembly, encodeSearch, searchStrings };
};

const ResultTabs = ({
  grouped,
  assembly,
  tabValue,
  onTabChange,
}: {
  grouped: Record<string, Result[]>;
  assembly: Assembly;
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}) => {
  const resultTypes = grouped ? Object.keys(grouped) : [];
  return (
    <TabContext value={tabValue}>
      <TabList onChange={onTabChange} aria-label="lab API tabs example">
        {resultTypes.map((x, i) => (
          <Tab key={x} label={`${x} (${grouped[x].length})`} value={i} />
        ))}
      </TabList>
      {resultTypes.map((x, i) => (
        <TabPanel key={x} value={i} sx={{ p: 0 }}>
          <Stack spacing={2}>
            {grouped[x].map((result) => {
              const El = result.type === "Legacy cCRE" ? LegacyCcreReturnEl : ReturnEl;
              return <El result={result} assembly={assembly} key={result.id ?? result.title} />;
            })}
          </Stack>
        </TabPanel>
      ))}
    </TabContext>
  );
};

const NoResultsHelp = () => (
  <div>
    <Typography>Try Searching for:</Typography>
    <ul style={{ margin: 0 }}>
      <Typography component={"li"}>A gene name (e.g., &quot;SP1&quot;)</Typography>
      <Typography component={"li"}>Genomic coordinates (e.g., &quot;chr12:53380176-53385176&quot;)</Typography>
      <Typography component={"li"}>A cCRE accession or rsID</Typography>
    </ul>
  </div>
);

export default function Page({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(+newValue);
  };

  const { assembly, encodeSearch, searchStrings } = parseSearchParams(use(searchParams));

  const geneVersion = useMemo(() => (assembly === "GRCh38" ? [29, 40] : 25), [assembly]);

  const limit = 10;

  const { data, loading, error } = useEntityAutocomplete(searchStrings, {
    queries: ["Gene", "cCRE", "SNP", "Coordinate", "Study", "Legacy cCRE"],
    assembly,
    geneVersion,
    graphqlUrl: "/api/graphql",
    limit: limit,
  });

  const grouped = data?.reduce<Record<string, Result[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const noResults = data && !data.length;

  return (
    <Stack spacing={2} margin={{ xs: 2, lg: 3, xl: 4 }}>
      <Header
        title={
          noResults
            ? `No results found for "${searchStrings.join(" ")}"`
            : `Results matching "${searchStrings.join(" ")}"`
        }
      />
      {<AlertSection type={noResults ? "no-results" : encodeSearch ? "encode" : "old-screen"} />}
      {error && <Alert severity="error">{`Error when searching ${searchStrings.join(" ")}`}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : noResults ? (
        <NoResultsHelp />
      ) : (
        <ResultTabs grouped={grouped} assembly={assembly} tabValue={tabValue} onTabChange={handleChange} />
      )}
    </Stack>
  );
}
