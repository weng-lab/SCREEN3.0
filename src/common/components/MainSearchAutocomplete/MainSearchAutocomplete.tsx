"use client";
import { GenomeSearch, GenomeSearchProps, Result } from "@weng-lab/ui-components";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { defaultHumanResults, defaultMouseResults, makeResultLink } from "./mainSearchHelpers";

export type AutoCompleteProps = Partial<GenomeSearchProps> & {
  closeDrawer?: () => void;
};

/**
 * Redirects the user to the a new page based on the search result
 * @param props - The props for the GenomeSearch component
 */
export function MainSearchAutocomplete({ closeDrawer, ...props }: AutoCompleteProps) {
  const router = useRouter();

  const handleSearchSubmit = (r: Result) => {
    //needed to trigger closing the mobile menu drawer
    if (closeDrawer) {
      closeDrawer();
    }
    console.log(r)
    router.push(makeResultLink(r, props.assembly), { scroll: false });
  };

  const defaultResults: Result[] = useMemo(() => {
    if (props.assembly === "GRCh38") {
      return defaultHumanResults;
    } else return defaultMouseResults;
  }, [props.assembly]);

  const geneVersion = props.assembly === "GRCh38" ? [29, 40] : 25;

  return (
    <GenomeSearch
      assembly={props.assembly}
      geneVersion={geneVersion}
      graphqlUrl="/api/graphql"
      showiCREFlag={false}
      queries={["Gene", "cCRE", "SNP", "Coordinate", "Study", "Legacy cCRE"]}
      onSearchSubmit={handleSearchSubmit}
      //This is needed to prevent the enter key press from triggering the onClick of the Menu IconButton
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      slotProps={{
        paper: {
          elevation: 1,
        },
      }}
      defaultResults={defaultResults}
      openOnFocus
      {...props}
    />
  );
}
