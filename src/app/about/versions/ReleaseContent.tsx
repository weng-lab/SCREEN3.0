"use client";

import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, IconButton, Link, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ReleaseNote } from "./releaseNotes";

type ReleaseContentProps = {
  release: ReleaseNote;
};

const DESCRIPTION_MIN_WIDTH = 340;
const SCREENSHOT_DEFAULT_WIDTH = 280;

type ScreenshotProps = {
  src: string;
  alt: string;
  width?: number;
  /** Skip the default frame so images that bring their own styling (e.g. a window drop shadow) aren't clipped or double-framed. */
  disableStyling?: boolean;
  /** Disable click-to-enlarge (lightbox). Enabled by default. */
  disableLightbox?: boolean;
};

const Screenshot = ({ src, alt, width, disableStyling, disableLightbox }: ScreenshotProps) => {
  const maxWidth = width ?? SCREENSHOT_DEFAULT_WIDTH;
  const fullSrc = `/versionScreenshots/${src}`;
  const lightboxEnabled = !disableLightbox;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        role={lightboxEnabled ? "button" : undefined}
        tabIndex={lightboxEnabled ? 0 : undefined}
        aria-label={lightboxEnabled ? `Enlarge ${alt}` : undefined}
        onClick={lightboxEnabled ? () => setOpen(true) : undefined}
        onKeyDown={
          lightboxEnabled
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setOpen(true);
                }
              }
            : undefined
        }
        sx={{
          flex: `0 1 ${maxWidth}px`,
          width: "100%",
          maxWidth,
          cursor: lightboxEnabled ? "zoom-in" : "default",
          // The frame clips with overflow:hidden, so it must be dropped entirely
          // (not just the border) to let a drop shadow render outside the box.
          ...(disableStyling
            ? {}
            : {
                overflow: "hidden",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.300",
                bgcolor: "grey.100",
              }),
        }}
      >
        <Box component="img" src={fullSrc} alt={alt} sx={{ display: "block", width: "100%", height: "auto" }} />
      </Box>

      {lightboxEnabled && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-label={alt}
          slotProps={{
            backdrop: {
              sx: {
                bgcolor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
              },
            },
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, md: 4 },
          }}
        >
          <Box
            tabIndex={-1}
            sx={{
              position: "relative",
              outline: "none",
              display: "flex",
              maxWidth: "90vw",
              maxHeight: "90vh",
            }}
          >
            <IconButton
              aria-label="Close enlarged screenshot"
              onClick={() => setOpen(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#FFFFFF",
                bgcolor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={fullSrc}
              alt={alt}
              sx={{
                display: "block",
                maxWidth: "90vw",
                maxHeight: "90vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

const ReleaseContent = ({ release }: ReleaseContentProps) => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 28,
            px: 1,
            borderRadius: 2,
            bgcolor: "secondary.light",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main" }}>
            {release.version}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "grey.600" }}>
          {release.date}
        </Typography>
      </Stack>
      <Typography variant="h5" sx={{ mb: release.summary ? 0.5 : 2, fontWeight: 600 }}>
        {release.title}
      </Typography>
      {release.summary && (
        <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary" }}>
          {release.summary}
        </Typography>
      )}
      <Stack spacing={4}>
        {release.sections.map((section, sectionIndex) => (
          <Stack key={`${release.id}-section-${section.title ?? sectionIndex}`} spacing={2}>
            {section.title && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "start",
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  flex: "1 1 0",
                  minWidth: `min(100%, ${DESCRIPTION_MIN_WIDTH}px)`,
                }}
              >
                {section.description && (
                  <Typography variant="body1" color="text.secondary">
                    {section.description}
                  </Typography>
                )}
                {section.children?.map((child, childIndex) => (
                  <Box
                    key={`${release.id}-${sectionIndex}-${child.title ?? childIndex}`}
                    sx={
                      section.bulletedChildren
                        ? {
                            display: "grid",
                            gridTemplateColumns: "16px minmax(0, 1fr)",
                            columnGap: 1,
                            alignItems: "start",
                          }
                        : undefined
                    }
                  >
                    {section.bulletedChildren && (
                      <Box
                        aria-hidden="true"
                        sx={{
                          alignSelf: "start",
                          color: "text.secondary",
                          fontSize: "2rem",
                          lineHeight: 1,
                          mt: "-0.10em",
                          textAlign: "center",
                        }}
                      >
                        •
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        alignItems: "start",
                      }}
                    >
                      <Box
                        sx={{
                          flex: "1 1 0",
                          minWidth: `min(100%, ${DESCRIPTION_MIN_WIDTH}px)`,
                        }}
                      >
                        {child.title ? (
                          child.link ? (
                            <Link
                              href={child.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              color="black"
                              sx={{ display: "inline-block", mb: 1 }}
                            >
                              <Typography sx={{ fontWeight: 600 }}>{child.title}</Typography>
                            </Link>
                          ) : (
                            <Typography sx={{ mb: 1, fontWeight: 600 }}>{child.title}</Typography>
                          )
                        ) : null}
                        {child.link ? (
                          <Typography variant="body1" color="text.secondary">
                            {child.description}{" "}
                            <IconButton
                              component="a"
                              href={child.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open ${child.title ?? "release note link"} in a new tab`}
                              size="small"
                              sx={{
                                ml: 0.25,
                                p: 0.25,
                                verticalAlign: "middle",
                                color: "primary.main",
                              }}
                            >
                              <OpenInNewIcon fontSize="inherit" />
                            </IconButton>
                          </Typography>
                        ) : (
                          <Typography variant="body1" color="text.secondary">
                            {child.description}
                          </Typography>
                        )}
                      </Box>
                      {child.screenshot && (
                        <Screenshot
                          src={child.screenshot}
                          alt={`${child.title ?? section.title ?? release.title} screenshot`}
                          width={child.imgWidth}
                          disableStyling={child.disableScreenshotStyling}
                          disableLightbox={child.disableLightbox}
                        />
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
              {section.screenshot && (
                <Screenshot
                  src={section.screenshot}
                  alt={`${section.title ?? release.title} screenshot`}
                  width={section.imgWidth}
                  disableStyling={section.disableScreenshotStyling}
                  disableLightbox={section.disableLightbox}
                />
              )}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default ReleaseContent;
