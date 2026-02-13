import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@portfolio/core', '@portfolio/packages'],
};

export default nextConfig;