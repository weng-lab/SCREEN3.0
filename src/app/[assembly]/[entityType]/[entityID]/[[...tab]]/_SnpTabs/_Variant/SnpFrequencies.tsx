import { Skeleton } from "@mui/material";
//import { DataTable, DataTableColumn } from "@weng-lab/ui-components";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";
import { GridColDef } from "@mui/x-data-grid-pro";
import { Table } from  "@weng-lab/ui-components";
//import { LinkComponent } from "common/components/LinkComponent";

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
 
  const columns: GridColDef<(typeof frequencies)[number]>[] = [
    
    {
      field: "row.population",      
      renderHeader: () => <strong><p>Population</p></strong>,
      valueGetter: (_, row) => (row.population ? populations[row.population] : ""),
    },    
    {
      field: "row.frequency",
      renderHeader: () => <strong><p>Frequency</p></strong>,
      valueGetter: (_, row) => (row.frequency ? row.frequency.toFixed(2) : ""),
    }]

  return (
    <>
      {loading ? (
        <Skeleton variant={"rounded"} width={"100%"} height={400} />
      ) : (
        <Table
        showToolbar
        rows={frequencies || []}
        columns={columns}     
        loading={loading}    
        label={`Population Frequencies`}            
      />       
      )}
    </>
  );
}
