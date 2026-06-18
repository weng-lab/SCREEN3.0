import type { GenomicRange } from "common/types/globalTypes";
import pako from "pako";

// Convert Uint8Array → binary string for btoa
function uint8ToBinaryString(uint8: Uint8Array): string {
  let binary = "";
  const len = uint8.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return binary;
}

// Convert binary string → Uint8Array for inflate
function binaryStringToUint8(binary: string): Uint8Array {
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeRegions(regions: GenomicRange[]): string {
  const json = JSON.stringify(regions);
  const compressed = pako.deflate(json); // Uint8Array
  return btoa(uint8ToBinaryString(compressed)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // URL-safe
}

export function decodeRegions(encoded: string): GenomicRange[] {
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = binaryStringToUint8(binary);
  const decompressed = pako.inflate(bytes, { to: "string" });
  return JSON.parse(decompressed);
}
