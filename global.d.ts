//This allows us to ?raw import text data as a string without TS complaining
declare module "*.txt" {
  const src: string;
  export default src;
}