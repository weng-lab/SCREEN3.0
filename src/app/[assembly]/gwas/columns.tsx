import { TableColDef } from "@weng-lab/ui-components";
import { LinkComponent } from "common/components/LinkComponent";
import { GwasStudiesMetadata } from "common/types/generated/graphql";

export const studiesColumns: TableColDef<GwasStudiesMetadata>[] = [
  {
    field: "disease_trait",
    headerName: "Disease",
    renderCell: (params) => (
      <LinkComponent href={`/GRCh38/gwas/${params.row.studyid}/biosample_enrichment`}>{params.value}</LinkComponent>
    ),
  },
  {
    field: "population",
    headerName: "Population",
    valueGetter: (v: string) => v.toUpperCase(),
  },
  {
    field: "studyid",
    headerName: "PubMed ID",
    valueGetter: (v: string) => v?.split("-")[0],
    renderCell: (params) => (
      <LinkComponent href={`https://pubmed.ncbi.nlm.nih.gov/${params.value}`} showExternalIcon openInNewTab>
        {params.value}
      </LinkComponent>
    ),
  },
  {
    field: "author",
    headerName: "Author",
    valueGetter: (v: string) => v?.replaceAll("_", " "),
  },
  {
    field: "has_enrichment_info",
    headerName: "Biosample Enrichment",
    valueGetter: (v: boolean) => (v ? "Available" : "Not Available"),
  },
  {
    field: "total_ld_blocks",
    headerName: "Total LD blocks",
  },
];
