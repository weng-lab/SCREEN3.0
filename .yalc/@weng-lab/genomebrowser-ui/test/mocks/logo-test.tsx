import { ReactNode } from "react";

function Stub({ children }: { children?: ReactNode }) {
  return <>{children ?? null}</>;
}

export const A = Stub;
export const C = Stub;
export const G = Stub;
export const T = Stub;
export const DNALogo = Stub;
