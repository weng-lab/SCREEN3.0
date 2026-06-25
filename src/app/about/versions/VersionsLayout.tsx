"use client";

import { Box, Divider, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReleaseContent from "./ReleaseContent";
import { RELEASE_NOTES } from "./releaseNotes";
import VersionHistoryBar from "./VersionHistoryBar";

const VersionsLayout = () => {
  const [selectedReleaseId, setSelectedReleaseId] = useState(RELEASE_NOTES[0]?.id ?? "");
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

      const lastRelease = RELEASE_NOTES[RELEASE_NOTES.length - 1];
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageBottom = document.documentElement.scrollHeight;

      // Keep the final release selected once the page can't scroll any further,
      // since a short last section's top may never reach the anchor line.
      if (lastRelease && pageBottom - scrollBottom <= 8) {
        setSelectedReleaseId((current) => (current === lastRelease.id ? current : lastRelease.id));
        ticking = false;
        return;
      }

      // Activate a release only once its top reaches the same line that clicking
      // it on the timeline scrolls it to: scroll-padding-top (header height + 8px).
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 64;
      const anchorLine = headerHeight + 8;

      let activeReleaseId = RELEASE_NOTES[0]?.id ?? "";
      for (const release of RELEASE_NOTES) {
        const element = sectionRefs.current[release.id];
        if (!element) {
          continue;
        }

        // Sections render in document order, so the active one is the last whose
        // top has crossed (scrolled above) the anchor line.
        if (element.getBoundingClientRect().top <= anchorLine + 1) {
          activeReleaseId = release.id;
        } else {
          break;
        }
      }

      setSelectedReleaseId((current) => (current === activeReleaseId ? current : activeReleaseId));
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
      <VersionHistoryBar releases={RELEASE_NOTES} selectedReleaseId={selectedReleaseId} onSelect={handleSelectRelease} />
      <Stack spacing={2} divider={<Divider />}>
        {RELEASE_NOTES.map((release) => (
          <Box
            key={release.id}
            ref={(node: HTMLDivElement | null) => {
              sectionRefs.current[release.id] = node;
            }}
            data-release-id={release.id}
          >
            <ReleaseContent release={release} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default VersionsLayout;
