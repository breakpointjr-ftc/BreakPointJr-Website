import os from "os";
import type { NextConfig } from "next";

function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const network of interfaces[name] ?? []) {
      if (network.family === "IPv4" && !network.internal) {
        ips.push(network.address);
      }
    }
  }

  return ips;
}

const nextConfig: NextConfig = {
  output: "export",

  allowedDevOrigins: getLocalIPs(),

  experimental: {},

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;