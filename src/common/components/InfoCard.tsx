import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export const InfoCard = ({
  icon,
  label,
  value,
  path,
  loading,
}: {
  icon: string;
  label: string;
  value: number;
  path: string;
  loading: boolean;
}) => (
  <Box
    component={Link}
    href={path}
    sx={{
      p: 2,
      borderRadius: 2,
      boxShadow: 2,
      textAlign: "center",
      bgcolor: "background.paper",
      textDecoration: "none",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      transformOrigin: "center",
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: 6,
        zIndex: 2,
      },
      height: 190,
    }}
  >
    <Image src={icon} alt={label} width={60} height={60} />
    <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>{label}</Typography>
    {loading ? (
      <CircularProgress size={42} />
    ) : (
      <Typography sx={{ fontSize: "2rem", fontWeight: 600, color: "text.primary" }}>
        {value.toLocaleString()}
      </Typography>
    )}
  </Box>
);
