//Home Page
"use client";
import { IconButton } from "@mui/material";
import React from "react";
import { Search } from "@mui/icons-material";
import AutoComplete from "../common/components/autocomplete";

export default function Home() {

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
            label: "Enter a gene, cCRE, variant, or locus",
            placeholder: "Enter a gene, cCRE, variant, or locus",
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