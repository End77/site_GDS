/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove all experimental and invalid options
  images: {
    domains: [],
  },
  poweredByHeader: false,
  compress: true,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
