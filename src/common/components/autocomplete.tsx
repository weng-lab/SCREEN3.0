"use client";
import { GenomeSearch, GenomeSearchProps, Result } from "@weng-lab/ui-components";
import { useRouter } from "next/navigation";

export type AutoCompleteProps = Partial<GenomeSearchProps> & {
  closeDrawer?: () => void;
};

/**
 * Redirects the user to the a new page based on the search result
 * @param props - The props for the GenomeSearch component
 */
export default function AutoComplete({ closeDrawer, ...props }: AutoCompleteProps) {
  const router = useRouter();

  const handleSearchSubmit = (r: Result) => {
    //needed to trigger closing the mobile menu drawer
    if (closeDrawer) {
      closeDrawer();
    }

    let url = "";
    switch (r.type) {
      case "Gene":
        url = `/${props.assembly}/gene/${r.title}`;
        break;
      case "cCRE":
        url = `/${props.assembly}/ccre/${r.title}`;
        break;
      case "Coordinate":
        url = `/${props.assembly}/region/${r.domain.chromosome}:${r.domain.start}-${r.domain.end}`;
        break;
      case "SNP":
        url = `/${props.assembly}/variant/${r.title}`;
        break;
    }
    router.push(url);
  };

  return (
    <GenomeSearch
      assembly={props.assembly}
      showiCREFlag={false}
      queries={["Gene", "cCRE", "SNP", "Coordinate"]}
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
      openOnFocus
      {...props}
    />
  );
}
