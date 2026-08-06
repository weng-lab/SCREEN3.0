import { List, ListItem, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type SectionProps = {
  /** Anchor target for nav/footer links (e.g. `/about#citations`) */
  id?: string;
  title: string;
  children: ReactNode;
};

/**
 * A top level section of the About page. Renders an `h5` heading followed by
 * evenly spaced content, so sections never need their own margins.
 */
export const AboutSection = ({ id, title, children }: SectionProps) => (
  <Stack component="section" id={id} spacing={1}>
    <Typography variant="h5" fontWeight={600}>
      {title}
    </Typography>
    {children}
  </Stack>
);

/**
 * A block nested inside an {@link AboutSection}, headed by an `h6`. The extra
 * top padding separates it from the preceding block.
 */
export const AboutSubsection = ({ id, title, children }: SectionProps) => (
  <Stack id={id} spacing={1} pt={1}>
    <Typography variant="h6" fontWeight={600}>
      {title}
    </Typography>
    {children}
  </Stack>
);

/** Disc-bulleted list. Children should be {@link Bullet}s. */
export const BulletList = ({ children }: { children: ReactNode }) => (
  <List component="ul" sx={{ listStyleType: "disc", paddingLeft: 4, paddingY: 0 }}>
    {children}
  </List>
);

export const Bullet = ({ children }: { children: ReactNode }) => (
  <ListItem component="li" sx={{ display: "list-item", whiteSpace: "normal" }}>
    {children}
  </ListItem>
);
