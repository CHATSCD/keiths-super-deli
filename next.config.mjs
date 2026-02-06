/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  staticPageGenerationTimeout: 180,
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
