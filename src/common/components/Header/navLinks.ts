import { PageInfo } from "./types";

/** Top level navigation, shared by the desktop nav and the mobile drawer */
export const pageLinks: PageInfo[] = [
  {
    pageName: "Downloads",
    link: "/downloads",
  },
  {
    pageName: "About",
    link: "/about",
    subPages: [
      { pageName: "Overview", link: "/about" },
      { pageName: "cCRE Classification", link: "/about#classifications" },
      { pageName: "How to Cite", link: "/about#citations" },
      { pageName: "Contact Us", link: "/about#contact-us" },
      { pageName: "Release History", link: "/about/versions" },
    ],
  },
  {
    pageName: "Help",
    link: "/about#contact-us",
  },
];
