import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CRITICAL: Prevent bundling issues for these libraries
  serverExternalPackages: ["puppeteer", "pdf-parse"],
};

export default nextConfig;