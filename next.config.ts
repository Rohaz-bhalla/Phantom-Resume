import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Puppeteer to work in Next.js 16
  serverExternalPackages: ["puppeteer"],
};

export default nextConfig;