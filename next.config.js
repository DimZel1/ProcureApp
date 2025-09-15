/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <-- add this
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  }
};
module.exports = nextConfig;