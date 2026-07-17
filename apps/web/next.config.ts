import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@customer-reg/shared'],
  experimental: { typedRoutes: true },
  output: 'standalone',
}

export default nextConfig
