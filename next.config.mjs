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
        source: "/:assembly/gwas/:study",
        destination: "/:assembly/gwas/:study/biosample_enrichment",
        permanent: false,
      },
      //redirect /:entityType was redirect static files, like the images in public
      //Now excludes routes that look like files from the redirect
      // {
      //   source: '/:entityType((?!.*\\..*).+)',
      //   destination: '/',
      //   permanent: false
      // }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
