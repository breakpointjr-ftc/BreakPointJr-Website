import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.2.94:3000",
    "192.168.2.94",
    "localhost:3000"
  ],
  experimental: {
    // Gerekirse deneysel özellikler buraya eklenebilir
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;