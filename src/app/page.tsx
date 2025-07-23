//Home Page
"use client";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { theme } from "./theme";
import { alpha } from '@mui/material/styles';
import Image from "next/image"
import MainSearch from "./landing/mainSearch";

export default function Home() {

  return (
    <div>
      <Box
        width="100%"
        height="70vh"
        sx={{
          background: `
            linear-gradient(${alpha(theme.palette.secondary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.9)}),
            url("/backgroundHelix.png")
          `,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={4}>
          <Image
            src="/helix.png"
            alt="Screen Helix"
            height={120}
            width={120}
            style={{ width: "auto", height: 120 }}
            priority
          />
          <Typography variant="h4"
            sx={{
              fontWeight: 400,
              fontSize: '40px',
              lineHeight: '40px',
              letterSpacing: 0,
              color: 'white',
              textAlign: 'center',
            }}
          >
            Search Candidate cis-Regulatory Elements
          </Typography>
        </Stack>
        <MainSearch />
      </Box>
    </div>
  );
}