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
        source: '/region/:region',
        destination: '/region/:region/icres',
        permanent: false
      },
      {
        source: '/region',
        destination: '/',
        permanent: false
      }
    ]
  }
}

export default nextConfig;
