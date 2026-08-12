import { ImageResponse } from "next/og";

/**
 * Social share card, generated at build time and served as a static PNG.
 *
 * Generated rather than checked in because the logos in public/ are transparent RGBA at a 1.95
 * aspect ratio; social platforms composite transparency onto their own background, so a
 * dark-ink logo disappears on dark-mode cards. This paints an opaque background at the 1200x630
 * both OpenGraph and Twitter expect.
 *
 * Rendered by satori, which supports only a subset of CSS: every element with more than one
 * child needs an explicit `display: flex`, and there is no cascade to inherit from.
 */
export const alt = "SCREEN: Search Candidate cis-Regulatory Elements by ENCODE";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -2 }}>SCREEN</div>
      <div style={{ fontSize: 46, lineHeight: 1.25, marginTop: 12, color: "#e4ebff" }}>
        Search Candidate cis-Regulatory Elements
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
        <div style={{ width: 72, height: 6, background: "#100e98", marginRight: 22 }} />
        <div style={{ fontSize: 30, color: "#b2bcf0" }}>by ENCODE &middot; human &amp; mouse</div>
      </div>
    </div>,
    size
  );
}
