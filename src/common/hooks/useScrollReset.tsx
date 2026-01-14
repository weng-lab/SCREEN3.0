"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function useScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Manually scroll to top on entity page change
    // Since the same page.tsx is in view, next js will always try to maintain current scroll position
    // Regardless of scroll={true/false} which only controls behavior when changing between pages
    const el = document.querySelector("html");
    if (el) el.scrollTo(0, 0);
  }, [pathname]);
}