"use client";
import { useEffect, useState } from "react";

/**
 * Scrolls the landing page search bar into view, then focuses it once the scroll lands.
 * Returns the click handler to attach to whatever triggers the scroll.
 */
export function useScrollToSearch() {
  // Flag used by the scroll/auto-focus machinery
  const [pendingSearchFocus, setPendingSearchFocus] = useState(false);

  const scrollToSearch = () => {
    document.getElementById("main-search-component")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setPendingSearchFocus(true);
  };

  // Focusing mid-scroll fights the smooth scroll, so wait until the helix is fully back in view
  useEffect(() => {
    if (!pendingSearchFocus) return;

    const searchEl = document.getElementById("main-search-component");
    const headerEl = document.getElementById("header-helix");
    if (!searchEl || !headerEl) {
      setPendingSearchFocus(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          searchEl.focus();
          setPendingSearchFocus(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    observer.observe(headerEl);

    // Give up if the helix never becomes fully visible, so the observer can't outlive the click
    const timeout = setTimeout(() => setPendingSearchFocus(false), 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [pendingSearchFocus]);

  return scrollToSearch;
}
