"use client";
import { GenomeSearch, GenomeSearchProps, Result } from "@weng-lab/ui-components";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export type AutoCompleteProps = Partial<GenomeSearchProps> & {
  closeDrawer?: () => void;
};

export const defaultHumanResults: Result[] = [
  {
    title: "chr19:44,905,754-44,909,393",
    domain: {
      chromosome: "chr19",
      start: 44905754,
      end: 44909393,
    },
    description: "chr19:44,905,754-44,909,393",
    type: "Coordinate",
  },
  {
    title: "SP1",
    description: "Sp1 Transcription Factor\nENSG00000185591.10\nchr12:53380176-53416446",
    domain: {
      chromosome: "chr12",
      start: 53380176,
      end: 53416446,
    },
    type: "Gene",
  },
  {
    title: "EH38E3314260",
    description: "chr19:50417519-50417853",
    domain: {
      chromosome: "chr19",
      start: 50417519,
      end: 50417853,
    },
    type: "cCRE",
  },
  {
    title: "rs9466027",
    description: "chr6:21298226-21298227",
    domain: {
      chromosome: "chr6",
      start: 21298226,
      end: 21298227,
    },
    type: "SNP",
  },
  {
    title: "Adiponectin Levels",
    description: "Dastani Z\n22479202",
    id: "Dastani_Z-22479202-Adiponectin_levels",
    type: "Study",
  },
];

export const defaultMouseResults: Result[] = [
  {
    title: "chr7:19,696,109-19,699,188",
    domain: {
      chromosome: "chr7",
      start: 19696109,
      end: 19699188,
    },
    description: "chr7:19,696,109-19,699,188",
    type: "Coordinate",
  },
  {
    title: "Sp1",
    description: "Sp1 Transcription Factor\nENSMUSG00000001280.13\nchr15:102406143-102436404",
    domain: {
      chromosome: "chr15",
      start: 102406143,
      end: 102436404,
    },
    type: "Gene",
  },
  {
    title: "EM10E1179536",
    description: "chr7:19698911-19699257",
    domain: {
      chromosome: "chr7",
      start: 19698911,
      end: 19699257,
    },
    type: "cCRE",
  },
];

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
      case "Study":
        url = `/GRCh38/gwas/${r.id}`;
        break;
    }
    router.push(url);
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
      ccreLimit={3}
      showiCREFlag={false}
      queries={["Gene", "cCRE", "SNP", "Coordinate", "Study"]}
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
