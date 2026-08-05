// Signed offset relative to the TSS: negative = upstream, positive = downstream
export const formatTssOffset = (value: number) => {
  if (value === 0) return "TSS";
  return `${Math.abs(value) / 1000}kb ${value < 0 ? "upstream" : "downstream"}`;
};
