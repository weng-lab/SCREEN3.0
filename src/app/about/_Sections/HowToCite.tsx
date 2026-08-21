import { Box, Stack, Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { ReactNode } from "react";
import { AboutSection } from "./AboutSection";

type CitationProps = {
  /** Text (or inline JSX) explaining when this paper should be cited */
  intro: ReactNode;
  title: string;
  link: string;
  authors: string;
  journal: string;
};

const CITATIONS: CitationProps[] = [
  {
    intro:
      "When using cCRE annotations or analyses derived from SCREEN in publications, preprints, or other public disclosures, users should cite the following paper:",
    title: "An Expanded Registry of Candidate cis-Regulatory Elements.",
    link: "https://doi.org/10.1038/s41586-025-09909-9",
    authors:
      "Moore J.E., Pratt H.E., Fan K., Phalke N., Fisher J., Elhajjajy S.I., Andrews G., Gao M., Shedd N., Fu Y., Lacadie M.C., Meza J., Khandpekar M., Ganna M., Choudhury E., Swofford R., Phan H., Ramirez C.C., Campbell M., Likhite M., Farrell N.P., Weimer A.K., Pampari A., Ramalingam V., Reese F., Borsari B., Yu X., Wattenberg E., Ruiz-Romero M., Razavi-Mohseni M., Xu J., Galeev T., Colubri A., Beer M.A., Guigó R., Gerstein M.B., Engreitz J.M., Ljungman M., Reddy T.E., Snyder M.P., Epstein C.B., Gaskell E., Bernstein B.E., Dickel D.E., Visel A., Pennacchio L.A., Mortazavi A., Kundaje A., Weng Z.",
    journal: "Nature (2026). doi:10.1038/s41586-025-09909-9",
  },
  {
    intro: (
      <>
        If you use the transcription factor ChIP-seq peaks or transcription factor binding sites, please additionally
        cite the following paper. See also our sister resource,{" "}
        <LinkComponent href="https://factorbook.org" openInNewTab showExternalIcon>
          Factorbook.org
        </LinkComponent>
        .
      </>
    ),
    title: "Factorbook: an updated catalog of transcription factor motifs and candidate regulatory motif sites.",
    link: "https://doi.org/10.1093/nar/gkab1039",
    authors: "Pratt H.E., Andrews G.R., Phalke N., Huey J.D., Purcaro M.J., van der Velde A., Moore J.E., Weng Z.",
    journal: "Nucleic Acids Research 50, D141–D149 (2022). doi:10.1093/nar/gkab1039",
  },
  {
    intro:
      "If you use the evolutionary conservation annotations or mammalian sequence alignments, please additionally cite:",
    title: "Mammalian evolution of human cis-regulatory elements and transcription factor binding sites.",
    link: "https://doi.org/10.1126/science.abn7930",
    authors:
      "Andrews G., Fan K., Pratt H.E., Phalke N., Zoonomia Consortium, Karlsson E.K., Lindblad-Toh K., Gazal S., Moore J.E., Weng Z.",
    journal: "Science 380, eabn7930 (2023). doi:10.1126/science.abn7930",
  },
];

const Citation = ({ intro, title, link, authors, journal }: CitationProps) => (
  <Stack spacing={0.5} pt={1}>
    <Typography variant="body1">{intro}</Typography>
    <Box>
      <LinkComponent href={link} openInNewTab variant="body2" underline="always">
        {title}
      </LinkComponent>
      <Typography variant="body2">{authors}</Typography>
      <Typography variant="body2">{journal}</Typography>
    </Box>
  </Stack>
);

export default function HowToCite() {
  return (
    <AboutSection id="citations" title="How to cite SCREEN">
      {CITATIONS.map((citation) => (
        <Citation key={citation.link} {...citation} />
      ))}
    </AboutSection>
  );
}
