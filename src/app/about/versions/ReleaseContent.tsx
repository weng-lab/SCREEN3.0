import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, IconButton, Link, Stack, Typography } from "@mui/material";
import { ReleaseNote } from "./releaseNotes";

type ReleaseContentProps = {
  release: ReleaseNote;
};

const DESCRIPTION_MIN_WIDTH = 340;

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
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {release.title}
      </Typography>
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
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {child.title}
                              </Typography>
                            </Link>
                          ) : (
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                              {child.title}
                            </Typography>
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
                        <Box
                          sx={{
                            flex: `0 1 ${child.imgWidth ?? 280}px`,
                            width: "100%",
                            maxWidth: child.imgWidth ?? 280,
                            overflow: "hidden",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "grey.300",
                            bgcolor: "grey.100",
                          }}
                        >
                          <Box
                            component="img"
                            src={`/versionScreenshots/${child.screenshot}`}
                            alt={`${child.title ?? section.title ?? release.title} screenshot`}
                            sx={{ display: "block", width: "100%", height: "auto" }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
              {section.screenshot && (
                <Box
                  sx={{
                    flex: `0 1 ${section.imgWidth ?? 280}px`,
                    width: "100%",
                    maxWidth: section.imgWidth ?? 280,
                    overflow: "hidden",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    bgcolor: "grey.100",
                  }}
                >
                  <Box
                    component="img"
                    src={`/versionScreenshots/${section.screenshot}`}
                    alt={`${section.title ?? release.title} screenshot`}
                    sx={{ display: "block", width: "100%", height: "auto" }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default ReleaseContent;
