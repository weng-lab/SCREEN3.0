import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const LegacyVersionsTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          borderCollapse: "collapse",
          "& td, & th": {
            border: "1px solid rgba(0,0,0,0.3)",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Registry of cCREs Version</b>
            </TableCell>
            <TableCell>
              <b>UI Release</b>
            </TableCell>
            <TableCell>
              <b>URL</b>
            </TableCell>
            <TableCell>
              <b>Citation</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>V4</TableCell>
            <TableCell>2024</TableCell>
            <TableCell>
              <Link href="https://screen-v4.wenglab.org/" target="_blank" rel="noopener">
                screen-v4.wenglab.org
              </Link>
            </TableCell>
            <TableCell rowSpan={2}>
              <Link
                href="https://www.nature.com/articles/s41586-025-09909-9"
                target="_blank"
                rel="noopener"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Moore...Weng (2026) <br /> <i>Nature</i>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>V3</TableCell>
            <TableCell>2020</TableCell>
            <TableCell>
              <Link href="https://screen-v3.wenglab.org/" target="_blank" rel="noopener">
                screen-v3.wenglab.org
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>V2</TableCell>
            <TableCell>2020</TableCell>
            <TableCell>
              <Link href="https://screen-v2.wenglab.org/" target="_blank" rel="noopener">
                screen-v2.wenglab.org
              </Link>
            </TableCell>
            <TableCell rowSpan={2}>
              <Link
                href="https://www.nature.com/articles/s41586-020-2493-4"
                target="_blank"
                rel="noopener"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                The ENCODE Project Consortium,
                <br />
                Moore…Weng (2020)
                <br />
                <i>Nature</i>
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>V1 (hg19)</TableCell>
            <TableCell>2018</TableCell>
            <TableCell>
              <Link href="https://screen-v1.wenglab.org/" target="_blank" rel="noopener">
                screen-v1.wenglab.org
              </Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LegacyVersionsTable;
