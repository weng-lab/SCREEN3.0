import { useSnpAlleles } from "common/hooks/data/variant";
import { Table, TableColDef } from "@weng-lab/ui-components";

//map populations to
const populations: Record<string, string> = {
  SAS: "South Asian",
  EUR: "European",
  EAS: "East Asian",
  AMR: "American",
  AFR: "African",
};

export default function SnpFrequencies({ snpid }: { snpid: string }) {
  const SnpAlleleFrequencies = useSnpAlleles([snpid], { includeFrequencies: true });
  const loading = SnpAlleleFrequencies.loading;
  const frequencies = SnpAlleleFrequencies.data?.[snpid]?.frequencies ?? [];

  const columns: TableColDef<(typeof frequencies)[number]>[] = [
    {
      field: "row.population",
      renderHeader: () => (
        <strong>
          <p>Population</p>
        </strong>
      ),
      valueGetter: (_, row) => (row.population ? populations[row.population] : ""),
    },
    {
      field: "row.frequency",
      renderHeader: () => (
        <strong>
          <p>Frequency</p>
        </strong>
      ),
      valueGetter: (_, row) => (row.frequency ? row.frequency.toFixed(2) : ""),
    },
  ];

  return (
    <Table
      showToolbar
      rows={frequencies || []}
      columns={columns}
      loading={loading}
      label={`Population Frequencies`}
      divHeight={{ height: 325 }}
    />
  );
}
