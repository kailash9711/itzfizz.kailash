import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for static site generation (like GitHub Pages)
  output: "export",
  // Ensures assets load from /itzfizz.kailash instead of the root domain
  basePath: "/itzfizz.kailash",
  // Next.js Image Optimization API doesn't work on static exports
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
