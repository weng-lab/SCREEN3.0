import { useEffect } from "react";

/**
 * Measures the height of the first element matching `selector` and writes it (in px) to the given
 * CSS variable on the document root, keeping it current as the element resizes. No-op while the
 * element is absent. Shared internals for the height hooks in this folder — not exported from the barrel.
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
