import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'japanese-knives-shop-development.up.railway.app',
        pathname: '/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async rewrites() {
    return [
      {
        source: '/loaderio-c1100d19144c563ce2c5f0bacf353f46/',
        destination: '/loaderio-c1100d19144c563ce2c5f0bacf353f46.txt',
      },
      {
        source: '/loaderio-c1100d19144c563ce2c5f0bacf353f46.html',
        destination: '/loaderio-c1100d19144c563ce2c5f0bacf353f46.txt',
      },
      {
        source: '/loaderio-c1100d19144c563ce2c5f0bacf353f46',
        destination: '/loaderio-c1100d19144c563ce2c5f0bacf353f46.txt',
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
