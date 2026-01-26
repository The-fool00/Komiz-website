import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.komiz.dev",
      },
      {
        protocol: "https",
        hostname: "cdn.mangaupdates.com",
      },
      {
        protocol: "https",
        hostname: "**.mangaupdates.com",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all for dev, restrict in production
      },
    ],
  },
};

export default nextConfig;
