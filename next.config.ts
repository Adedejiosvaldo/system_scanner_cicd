import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: ".next",
  experimental: {},
  webpack: (config) => {
    // Handle OSX module resolution
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        "osx-temperature-sensor": false,
      },
    };
    return config;
  },
};
export default nextConfig;
