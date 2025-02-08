// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://0.0.0.0:3001/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
