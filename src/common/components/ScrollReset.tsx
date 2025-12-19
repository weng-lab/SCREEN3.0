"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const el = document.getElementById("content-wrapper");
    if (el) el.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
