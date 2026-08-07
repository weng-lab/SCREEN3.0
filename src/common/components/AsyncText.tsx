import { Skeleton, SxProps, Theme, Typography } from "@mui/material";
import { ReactNode } from "react";

export type AsyncTextProps = {
  loading: boolean;
  /** Anything truthy renders `errorMessage` in place of the children */
  error: unknown;
  /** Kept short — this renders inline, next to text that did load */
  errorMessage: string;
  skeletonWidth?: number | string;
  /** Applied to the skeleton, for spacing it against the text it follows */
  sx?: SxProps<Theme>;
  children: ReactNode;
};

/**
 * Renders a fragment of text that comes from its own fetch: a skeleton while it loads, a short
 * error message if it fails, otherwise the text.
 *
 * For values that sit inside a line of text rather than owning it. A fetch that fails and takes the
 * whole line with it should use an Alert instead.
 */
export const AsyncText = ({ loading, error, errorMessage, skeletonWidth = 215, sx, children }: AsyncTextProps) => {
  if (loading) {
    return <Skeleton width={skeletonWidth} sx={[{ display: "inline-block" }, ...(Array.isArray(sx) ? sx : [sx])]} />;
  }

  if (error) {
    return (
      <Typography component="span" variant="body1" color="error">
        {errorMessage}
      </Typography>
    );
  }

  return <>{children}</>;
};
