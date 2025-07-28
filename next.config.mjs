/** @type {import('next').NextConfig} */

const nextConfig = {
  //Image optimization incompatible with static exports
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
            fs: false
        }
    }

    return config
  },
  async redirects() {
    return [
      {
        source: '/:assembly/region/:region',
        destination: '/:assembly/region/:region/ccres',
        permanent: false
      },
      //redirect /:entityType was redirect static files, like the images in public
      //Now excludes routes that look like files from the redirect
      // {
      //   source: '/:entityType((?!.*\\..*).+)',
      //   destination: '/',
      //   permanent: false
      // }

    ]
  }
}

export default nextConfig;
