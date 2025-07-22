import { Skeleton } from "@mui/material";
import { DataTable, DataTableColumn } from "psychscreen-legacy-components";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";

type Frequency = {
  population: string;
  frequency: number;
};

export default function SnpFrequencies({ snpid }: { snpid: string }) {
  const SnpAlleleFrequencies = useSnpFrequencies([snpid], "variant");
  const loading = SnpAlleleFrequencies.loading;
  const frequencies =
    SnpAlleleFrequencies.data && SnpAlleleFrequencies.data[snpid] ? SnpAlleleFrequencies.data[snpid].frequencies : [];

  //map populations to
  const populations: Record<string, string> = {
    SAS: "South Asian",
    EUR: "European",
    EAS: "East Asian",
    AMR: "American",
    AFR: "African",
  };

  const frequencyColumns: DataTableColumn<Frequency>[] = [
    { header: "Population", value: (row) => (row.population ? populations[row.population] : "") },
    { header: "Frequency", value: (row) => (row.frequency ? row.frequency.toFixed(2) : "") },
  ];

  return (
    <>
      {loading ? (
        <Skeleton variant={"rounded"} width={"100%"} height={400} />
      ) : (
        <DataTable
          key={Math.random()}
          columns={frequencyColumns}
          rows={frequencies}
          sortColumn={1}
          itemsPerPage={5}
          searchable
          tableTitle={"Population Frequencies"}
          downloadFileName="populationFrequencies.tsv"
        />
      )}
    </>
  );
}
