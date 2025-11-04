/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  // Skip static page generation - all pages are dynamic
  skipTrailingSlashRedirect: true,
  webpack: (config, { isServer }) => {
    // Handle GLTF/GLB files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    })

    // Externalize canvas for server-side (Three.js compatibility)
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }

    // Ignore Three.js warnings in server build
    config.ignoreWarnings = [
      { module: /node_modules\/three/ },
    ]

    return config
  },
}

module.exports = nextConfig
