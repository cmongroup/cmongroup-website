/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // removed deprecated swcMinify option
  output: 'standalone',
};

module.exports = nextConfig;
