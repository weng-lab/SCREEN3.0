import { useEffect } from "react";

/**
 * Measures the height of the first element matching `selector` and writes it (in px) to the given
 * CSS variable on the document root, keeping it current as the element resizes. No-op while the
 * element is absent. Backs the height hooks in this folder, and pages measuring an element of their own —
 * not exported from the barrel.
 */
export const useMeasuredHeightVar = (selector: string, cssVar: `--${string}`) => {
  useEffect(() => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;

    const update = () => {
      document.documentElement.style.setProperty(cssVar, `${element.offsetHeight}px`);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, [selector, cssVar]);
};
