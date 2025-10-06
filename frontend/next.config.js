/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'media.multiversx.com',
      'ipfs.io',
      'gateway.pinata.cloud'
    ],
  },
  env: {
    NEXT_PUBLIC_MULTIVERSX_CHAIN: process.env.NEXT_PUBLIC_MULTIVERSX_CHAIN || 'devnet',
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig