export const nameKey = (name?: string) => name?.split(/[-_]/)[0].trim().toUpperCase() ?? "";
