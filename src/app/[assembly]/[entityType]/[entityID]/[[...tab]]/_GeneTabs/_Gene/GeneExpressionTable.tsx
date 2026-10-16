import { GeneExpressionTableProps } from "./types";
import { Table } from "@weng-lab/ui-components";

const GeneExpressionTable = ({ label, rows, loading, error, tableProps, columns }: GeneExpressionTableProps) => (
  <Table {...tableProps} columns={columns} label={label} rows={rows} loading={loading} error={error} />
);

export default GeneExpressionTable;
