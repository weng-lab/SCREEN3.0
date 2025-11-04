export type PageInfo = {
  pageName: string;
  link: string;
  dropdownID?: number;
  subPages?: { pageName: string; link: string }[];
};