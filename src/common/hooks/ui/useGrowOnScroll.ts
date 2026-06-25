import { useEffect, useRef, useState } from "react";

export function useGrowOnScroll(length: number) {
  const [visible, setVisible] = useState<boolean[]>(() => Array(length).fill(false));
  const refs = useRef<(HTMLDivElement | HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const copy = [...prev];
              copy[index] = true;
              return copy;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [length]);

  return { visible, refs };
}
