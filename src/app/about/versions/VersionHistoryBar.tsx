"use client";

import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { Box, Stack, Typography } from "@mui/material";
import { ReleaseNote } from "./releaseNotes";

type VersionHistoryBarProps = {
  releases: ReleaseNote[];
  selectedReleaseId: string;
  onSelect: (releaseId: string) => void;
};

const VersionHistoryBar = ({ releases, selectedReleaseId, onSelect }: VersionHistoryBarProps) => {
  return (
    <Box
      component="aside"
      sx={{
        position: { md: "sticky" },
        top: { md: "calc(var(--header-height, 64px) + 24px)" },
        alignSelf: "start",
        width: "100%",
        maxWidth: { xs: "none", md: 340 },
        maxHeight: { md: "calc(100vh - var(--header-height, 64px) - 48px)" },
        py: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="body1" sx={{ mb: 2 }} color="primary.main">
        Release History
      </Typography>
      <Timeline
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          m: 0,
          p: 0,
          pr: 1,
          minHeight: 0,
          [`& .MuiTimelineItem-root:before`]: {
            display: "none",
          },
        }}
      >
        {releases.map((release, index) => {
          const isLast = index === releases.length - 1;
          const isSelected = selectedReleaseId === release.id;

          return (
            <TimelineItem
              key={release.id}
              sx={{
                alignItems: "stretch",
                minHeight: isLast ? "auto" : 96,
              }}
            >
              <TimelineSeparator
                sx={{
                  flex: "0 0 auto",
                }}
              >
                <TimelineDot
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{
                    width: isSelected ? 5 : 3,
                    height: isSelected ? 5 : 3,
                    minWidth: isSelected ? 5 : 3,
                    boxShadow: "none",
                    bgcolor: isSelected ? "primary.main" : "transparent",
                    borderColor: isSelected ? "#F7F4EE" : "grey.400",
                    color: isSelected ? "primary.main" : "grey.400",
                    boxSizing: "content-box",
                  }}
                />
                {!isLast && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  px: 1,
                }}
              >
                <Box
                  onClick={() => onSelect(release.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(release.id);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    p: 1.5,
                    cursor: "pointer",
                    bgcolor: isSelected ? "secondary.light" : "transparent",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 28,
                        px: 1.25,
                        borderRadius: 2,
                        bgcolor: isSelected ? "primary.main" : "#FFFFFF",
                        border: "1px solid",
                        borderColor: isSelected ? "primary.main" : "grey.400",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: isSelected ? "#FFFFFF" : "grey.600" }}
                      >
                        {release.version}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: isSelected ? "primary.main" : "grey.600" }}>
                      {release.date}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: isSelected ? "primary.main" : "grey.600" }}>
                    {release.title}
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default VersionHistoryBar;
