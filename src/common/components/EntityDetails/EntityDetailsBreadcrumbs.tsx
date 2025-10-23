"use client";

import { NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { formatPortal } from "common/utility";
import { usePathname } from "next/navigation";

/**
 * Currently not used, but saving for now
 */
const ElementDetailsBreadcrumbs = () => {
  const pathname = usePathname();
  const links = pathname.split("/").slice(1, 3);

  const formatSubPath = (path: string) => {
    // handle encoded colons in region path
    if (path.includes("%3A")) {
      return path.replace("%3A", ":");
    } else {
      return path;
    }
  };

  return (
    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumbs">
      <LinkComponent color="inherit" href="/">
        Home
      </LinkComponent>
      {links.map((subpath, i) => {
        if (i === 0) {
          return (
            <LinkComponent color="inherit" href={"/" + subpath} key={subpath}>
              {formatPortal(subpath)}
            </LinkComponent>
          );
        } else return <Typography key={subpath}>{formatSubPath(subpath)}</Typography>;
      })}
    </Breadcrumbs>
  );
};

export default ElementDetailsBreadcrumbs;
