import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailark.com',
      },
      {
        protocol: 'https',
        hostname: 'html.tailus.io',
      },
    ]
  },
  experimental: {
    // @ts-ignore - Turbopack might be forced in some versions, but we try to disable it for stability
    turbopack: false
  }
};

export default nextConfig;
