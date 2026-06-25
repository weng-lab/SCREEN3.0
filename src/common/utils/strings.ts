export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function capitalizeWords(input: string): string {
  return input.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const truncateString = (input: string, maxLength: number) => {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 3) + "...";
};
