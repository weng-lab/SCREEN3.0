"use client";
/* eslint-disable react-doctor/no-cascading-set-state */

import { Box, Divider, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReleaseContent from "./ReleaseContent";
import { releaseNotes } from "./releaseNotes";
import VersionHistoryBar from "./VersionHistoryBar";

const VersionsLayout = () => {
  const [selectedReleaseId, setSelectedReleaseId] = useState(releaseNotes[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateSelectedRelease = () => {
      if (isProgrammaticScrollRef.current) {
        ticking = false;
        return;
      }

      const lastRelease = releaseNotes[releaseNotes.length - 1];
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;

      if (lastRelease && pageBottom - scrollBottom <= 8) {
        setSelectedReleaseId((current) => (current === lastRelease.id ? current : lastRelease.id));
        ticking = false;
        return;
      }

      const fullyVisibleRelease = releaseNotes.find((release) => {
        const element = sectionRefs.current[release.id];
        if (!element) {
          return false;
        }

        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      if (fullyVisibleRelease) {
        setSelectedReleaseId((current) => (current === fullyVisibleRelease.id ? current : fullyVisibleRelease.id));
        ticking = false;
        return;
      }

      const viewportAnchor = window.innerHeight * 0.3;
      let closestReleaseId = releaseNotes[0]?.id ?? "";
      let closestDistance = Number.POSITIVE_INFINITY;

      releaseNotes.forEach((release) => {
        const element = sectionRefs.current[release.id];
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - viewportAnchor);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestReleaseId = release.id;
        }
      });

      setSelectedReleaseId((current) => (current === closestReleaseId ? current : closestReleaseId));
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateSelectedRelease);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (programmaticScrollTimeoutRef.current !== null) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectRelease = (releaseId: string) => {
    setSelectedReleaseId(releaseId);

    const section = sectionRefs.current[releaseId];
    if (!section) {
      return;
    }

    isProgrammaticScrollRef.current = true;
    if (programmaticScrollTimeoutRef.current !== null) {
      window.clearTimeout(programmaticScrollTimeoutRef.current);
    }
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    programmaticScrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "340px minmax(0, 1fr)" },
        gap: { xs: 3, md: 5 },
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 4 },
        alignItems: "start",
      }}
    >
      <VersionHistoryBar releases={releaseNotes} selectedReleaseId={selectedReleaseId} onSelect={handleSelectRelease} />
      <Stack spacing={3}>
        {releaseNotes.map((release) => (
          <Box
            key={release.id}
            ref={(node: HTMLDivElement | null) => {
              sectionRefs.current[release.id] = node;
            }}
            data-release-id={release.id}
            sx={{
              scrollMarginTop: "calc(var(--header-height, 64px) + 32px)",
            }}
          >
            <ReleaseContent release={release} />
            <Divider />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default VersionsLayout;
