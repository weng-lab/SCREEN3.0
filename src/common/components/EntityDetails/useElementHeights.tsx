import { useEffect } from "react";

/**
 * This measures the height of the header and entity tabs for proper positioning of all elements.
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

    // Initial measurement
    updateHeights();

    // Update on window resize
    window.addEventListener("resize", updateHeights);

    // Observe elements for size changes
    const header = document.querySelector<HTMLElement>("header");
    const entityTabs = document.querySelector<HTMLElement>(".entity-tabs");

    const observer = new ResizeObserver(updateHeights);

    if (header) observer.observe(header);
    if (entityTabs) observer.observe(entityTabs);

    return () => {
      window.removeEventListener("resize", updateHeights);
      observer.disconnect();
    };
  }, []);
};
