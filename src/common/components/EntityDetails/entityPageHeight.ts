// Sized off the window rather than a flat 60vh, which runs past the fold on a laptop and leaves a large
// monitor half empty. Matches MOHD's omePageHeight.

/** `viewport` under the app bar and the open entities tabs, which both stay put as the page scrolls. */
const underHeaders = (viewport: string) => `${viewport} - var(--header-height, 64px) - var(--entity-tabs-height, 48px)`;

/** EntityDetailsLayout's spacing, in px: main-content's top and bottom margins, and the gap under the entity header. */
const ENTITY_PAGE_CHROME = 16 + 16 + 16;

const entityPageHeight = (viewport: string, chrome: number, min: number, above = "0px") =>
  `max(calc(${underHeaders(viewport)} - ${chrome}px - ${above}), ${min}px)`;

// A phone gives most touches on a stacked pane to the pane (the table and long plots scroll their rows, the
// UMAP pans), so it's held this far short of the window to leave a strip that scrolls the page past it.
const STACKED_RESERVE = 96;

/**
 * TwoPaneLayout's heights on an entity page. `above` is anything the tab puts over the panes, with the gap
 * under it, as a CSS length.
 *
 * Side by side, the panes end at the window's bottom with the page scrolled to the top, so the entity header
 * comes off too. Stacked, the panes show one at a time as tabs, the tab bar included in the height, and are
 * scrolled to with the header gone.
 */
export const twoPaneHeights = (above = "0px") => ({
  rowHeight: entityPageHeight("100vh", ENTITY_PAGE_CHROME, 560, `var(--entity-header-height, 112px) - ${above}`),
  // svh is a phone's window with the browser's toolbars showing; 100vh is it with them hidden, which would cost
  // the reserve their height whenever they're out. The two are equal on desktop.
  columnHeight: entityPageHeight("100svh", ENTITY_PAGE_CHROME + STACKED_RESERVE, 460),
});
