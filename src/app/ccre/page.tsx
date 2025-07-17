'use client'

import { OpenInNew, Search } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { Box, Button, Container, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function cCREPage({ searchParams }: { searchParams: { accession?: string } }) {
  const accession = searchParams.accession;
  const url = `https://screen.wenglab.org/search/?q=${accession}&uuid=0&assembly=GRCh38`;

  if (!accession) {
    return (
      <main>
        <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: "center",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Image
                src="/SCREEN-on-light@16x.png"
                alt="SCREEN Logo"
                width={200}
                height={100}
                style={{ margin: "0 auto" }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 500,
                color: "#2c3e50",
                mb: 3,
              }}
            >
              No Accession Provided
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "#34495e",
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              igSCREEN only has information regarding iCREs. Please visit SCREEN to search for a cCRE.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/icre"
                startIcon={<Search />}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontSize: "1.1rem",
                }}
              >
                Search for iCREs
              </Button>
              <Button
                variant="outlined"
                color="primary"
                href="https://screen.wenglab.org"
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNew />}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontSize: "1.1rem",
                }}
              >
                Visit SCREEN
              </Button>
            </Box>
          </Paper>
          <RangeSlider title={"test"} width={"400"} />
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Image
              src="/SCREEN-on-light@16x.png"
              alt="SCREEN Logo"
              width={200}
              height={100}
              style={{ margin: "0 auto" }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 500,
              color: "#2c3e50",
              mb: 3,
            }}
          >
            {accession} is not annotated as an iCRE
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "#34495e",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            This cCRE is not currently annotated as an iCRE in our database. To view detailed information about this
            cCRE, please visit SCREEN.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNew />}
            sx={{
              py: 1.5,
              px: 3,
              fontSize: "1.1rem",
            }}
          >
            View on SCREEN
          </Button>
        </Paper>
        
      </Container>
    </main>
  );
}
