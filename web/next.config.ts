import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@portfolio/core', '@portfolio/packages', '@portfolio/database'],
  distDir: 'dist',
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;