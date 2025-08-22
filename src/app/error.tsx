"use client" // Error components must be Client Components

// See https://nextjs.org/docs/app/api-reference/file-conventions/error

import { useEffect } from "react"
import { Alert, AlertTitle, Button, Grid, Snackbar } from "@mui/material"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <Grid container alignItems="center" justifyContent="center" direction="column" sx={{ minHeight: "90vh" }}>
        <Snackbar
          id="errorpopper"
          open={true}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert severity="error" variant="filled">
            <AlertTitle>Error</AlertTitle>
            There was an error loading. — <strong>{"Error"}</strong>
          </Alert>
        </Snackbar>
      </Grid>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}
