import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@portfolio/core', '@portfolio/packages', '@portfolio/database'],
};

export default nextConfig;