import { useEffect } from "react";

/**
 * This measures the height of the header, entity tabs, and amount of footer visible for proper positioning of all elements.
 * I really, really wanted to make this layout simpler while making it work as I wanted but here we are.
 */
export const useElementHeights = () => {
  useEffect(() => {
    const updateHeights = () => {
      const header = document.querySelector<HTMLElement>("header"); //AppBar component renders a header component
      const entityTabs = document.querySelector<HTMLElement>("#entity-tabs"); //Entity tabs given this id

      if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
      }

      if (entityTabs) {
        const entityTabsHeight = entityTabs.offsetHeight;
        document.documentElement.style.setProperty("--entity-tabs-height", `${entityTabsHeight}px`);
      }
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visibleHeight = entry.intersectionRect.height;
          document.documentElement.style.setProperty("--footer-visible-height", `${visibleHeight}px`);
        });
      },
      {
        root: null, // Observes relative to the viewport
        rootMargin: "0px",
        threshold: buildThresholdList(),
      }
    );

    function buildThresholdList() {
      const thresholds = [];
      for (let i = 0; i <= 1.0; i += 0.01) {
        thresholds.push(i);
      }
      return thresholds;
    }

    // Initial measurement
    updateHeights();

    // Update on window resize
    window.addEventListener("resize", updateHeights);

    // Observe elements for size changes
    const header = document.querySelector<HTMLElement>("header");
    const entityTabs = document.querySelector<HTMLElement>(".entity-tabs");
    const footer = document.querySelector<HTMLElement>("footer");

    const observer = new ResizeObserver(updateHeights);

    if (header) observer.observe(header);
    if (entityTabs) observer.observe(entityTabs);
    if (footer) visibilityObserver.observe(footer);

    return () => {
      window.removeEventListener("resize", updateHeights);
      observer.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);
};
