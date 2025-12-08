"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Manually scroll to top on page change
    const el = document.getElementById("content-wrapper");
    if (el) el.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
