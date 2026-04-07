import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@portfolio/core', '@portfolio/packages', '@portfolio/database'],
  distDir: 'dist',
};

export default nextConfig;