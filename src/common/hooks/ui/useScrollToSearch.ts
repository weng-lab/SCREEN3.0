"use client";
import { useEffect, useState } from "react";

/**
 * Scrolls the landing page search bar into view, then focuses it once the scroll lands.
 * Returns the click handler to attach to whatever triggers the scroll.
 */
export function useScrollToSearch() {
  // Bumped on every click. A counter rather than a boolean so that repeat clicks always re-run the
  // effect below, which frees it from having to reset the value to re-arm itself.
  const [focusRequest, setFocusRequest] = useState(0);

  const scrollToSearch = () => {
    document.getElementById("main-search-component")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFocusRequest((n) => n + 1);
  };

  // Focusing mid-scroll fights the smooth scroll, so wait until the helix is fully back in view
  useEffect(() => {
    if (focusRequest === 0) return;

    const searchEl = document.getElementById("main-search-component");
    const headerEl = document.getElementById("header-helix");
    if (!searchEl || !headerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          searchEl.focus();
          observer.disconnect();
        }
      },
      {
        threshold: 1.0,
      }
    );
    observer.observe(headerEl);

    // Give up if the helix never becomes fully visible, so the observer can't outlive the click
    const timeout = setTimeout(() => observer.disconnect(), 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [focusRequest]);

  return scrollToSearch;
}
