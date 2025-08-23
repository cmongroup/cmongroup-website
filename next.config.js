/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // removed deprecated swcMinify option
  output: "standalone",
};

module.exports = nextConfig;
