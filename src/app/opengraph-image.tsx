import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Social share card, generated at build time and served as a static PNG.
 *
 * Generated rather than checked in so the real logo can be composited onto a background we
 * control: public/on-dark@16x.png is transparent RGBA with white ink, and social platforms paint
 * transparency onto their own card background, so the wordmark disappears wherever that
 * background is light. Painting the brand gradient behind it here pins the logo to the dark
 * background it was drawn for, at the 1200x630 both OpenGraph and Twitter expect.
 *
 * Rendered by satori, which supports only a subset of CSS: every element with more than one
 * child needs an explicit `display: flex`, and there is no cascade to inherit from. It also has
 * no filesystem or network access, so the logo is read here and handed over as a data URI.
 */
export const alt = "SCREEN: Search Candidate cis-Regulatory Elements by ENCODE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Source asset is 1869x960 and tightly cropped; scaled down at its own aspect ratio. */
const LOGO_WIDTH = 620;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 960) / 1869);

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "on-dark@16x.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 90px",
        // theme.palette.primary.main -> secondary.main
        backgroundImage: "linear-gradient(135deg, #0c184a 0%, #00063D 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <img src={logoSrc} width={LOGO_WIDTH} height={LOGO_HEIGHT} alt="" />
      <div style={{ fontSize: 46, lineHeight: 1.25, marginTop: 28, color: "#e4ebff" }}>
        Search Candidate cis-Regulatory Elements
      </div>
    </div>,
    size
  );
}
