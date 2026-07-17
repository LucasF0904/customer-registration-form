/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@customer-reg/shared'],
  experimental: { typedRoutes: true },
  output: 'standalone',
}

export default nextConfig
