export type SubPageInfo = {
  pageName: string;
  link: string;
};

export type PageInfo = {
  pageName: string;
  link: string;
  subPages?: SubPageInfo[];
};
