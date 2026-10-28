import { Stack, Typography } from "@mui/material";
import { InfoOutlineRounded } from "@mui/icons-material";
import { ReactNode } from "react";

/**
 * Bordered "nothing to show" row used as a Table's emptyTableFallback: info icon and message on
 * the left, optional action on the right. The action repeats the table's toolbar button, which is
 * not reachable while the table is empty.
 *
 * Almost duplicate of EmptyFallback in @weng-lab/ui-components but that's not public surface
 * currently and does not have an action slot we need here.
 */
export function EmptyTableFallback({ message, action }: { message: ReactNode; action?: ReactNode }) {
  return (
    <Stack
      direction={"row"}
      border={"1px solid #e0e0e0"}
      borderRadius={1}
      p={2}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Stack direction={"row"} spacing={1}>
        <InfoOutlineRounded />
        <Typography>{message}</Typography>
      </Stack>
      {action}
    </Stack>
  );
}
