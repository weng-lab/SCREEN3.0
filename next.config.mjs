/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:assembly/region/:region",
        destination: "/:assembly/region/:region/ccres",
        permanent: false,
      },
      {
        source: "/:assembly/bed/:fileName",
        destination: "/:assembly/bed/:fileName/overview",
        permanent: false,
      },
      {
        source: "/:assembly/gwas/:study",
        destination: "/:assembly/gwas/:study/biosample_enrichment",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [new URL("https://www.ncbi.nlm.nih.gov/**"), new URL("https://geneanalytics.genecards.org/**"), new URL("https://genome.ucsc.edu/**")],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
