import { useState } from "react";
import { Stack, TextField } from "@mui/material";
import type { TrackSettingsProps } from "@weng-lab/genomebrowser";
import type { Config, Peak } from "./tfPeaks";

const createRows = (filter: string[]) => [...filter, ""].map((value) => ({ id: crypto.randomUUID(), value }));

export default function TfFilterFields({
  filter,
  updateTrack,
}: Pick<TrackSettingsProps<Config, Peak>, "updateTrack"> & { filter: string[] }) {
  const saved = JSON.stringify(filter);
  const [draft, setDraft] = useState(() => ({ saved, rows: createRows(filter) }));
  const [error, setError] = useState<string>();
  if (draft.saved !== saved) setDraft({ saved, rows: createRows(filter) });

  function commit() {
    const nextFilter = draft.rows.flatMap(({ value }) => {
      const normalized = value.trim().toUpperCase();
      return normalized ? [normalized] : [];
    });
    const result = updateTrack({ config: { filter: nextFilter } });
    if (result.ok) {
      setDraft({ saved: JSON.stringify(nextFilter), rows: draft.rows });
      setError(undefined);
    } else {
      setError("Unable to apply TF filters.");
    }
  }

  return (
    <Stack spacing={1}>
      {draft.rows.map(({ id, value }, index) => (
        <TextField
          key={id}
          fullWidth
          size="small"
          label={`Filter TF ${index + 1}`}
          placeholder="e.g. CTCF"
          value={value}
          error={error !== undefined}
          helperText={index === draft.rows.length - 1 ? error : undefined}
          onChange={(event) => {
            const rows = [...draft.rows];
            rows[index] = { id, value: event.target.value };
            if (rows.every((row) => row.value.trim() !== "")) rows.push({ id: crypto.randomUUID(), value: "" });
            setDraft({ ...draft, rows });
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
          }}
        />
      ))}
    </Stack>
  );
}
