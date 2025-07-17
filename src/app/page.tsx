//Home Page

"use client";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import Grid2 from "@mui/material/Grid2";
import Image from "next/image";
import { ArrowForwardIos, ExpandMore, Search } from "@mui/icons-material";
import AutoComplete from "../common/components/autocomplete";
import Link from "next/link";
import { portalDescriptions, portalImagePaths } from "common/consts";

export default function Home() {
  type PortalTileProps = {
    imagePosition: "right" | "left";
    imagePath: string;
    title: string;
    description: string;
    link: string;
    buttonText: string;
  };

  const PortalTile = ({ imagePosition, imagePath, title, description, link, buttonText }: PortalTileProps) => (
    <Stack
      direction={{ xs: "column", md: imagePosition === "left" ? "row" : "row-reverse" }}
      alignItems={"center"}
      spacing={2}
    >
      <Box
        position={"relative"}
        width={"100%"}
        height={300}
        //affects alignment of the image
        sx={{ objectPosition: { md: imagePosition === "left" ? "left bottom" : "right bottom", xs: "bottom" } }}
      >
        <Image
          style={{ objectFit: "contain", objectPosition: "inherit" }}
          src={imagePath}
          fill
          alt={title + " image"}
        />
      </Box>
      <Stack alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "initial" }}>
        <Typography variant="h4" mb={1}>
          {title}
        </Typography>
        <Typography mb={2}>{description}</Typography>
        <Button LinkComponent={Link} href={link} variant="contained" endIcon={<ArrowForwardIos />}>
          {buttonText}
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <div>
      <AutoComplete
        style={{ width: 400, maxWidth: "100%" }}
        slots={{
          button: (
            <IconButton color="primary">
              <Search />
            </IconButton>
          ),
        }}
        slotProps={{
          box: { gap: 2 },
          input: {
            label: "Enter a gene, iCRE, variant, or locus",
            placeholder: "Enter a gene, iCRE, variant, or locus",
            sx: {
              backgroundColor: "white",
              "& label.Mui-focused": {
                color: "primary",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "primary",
                },
              },
            },
          },
        }}
      />
    </div>
  );
}