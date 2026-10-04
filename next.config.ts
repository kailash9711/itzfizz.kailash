import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for static site generation (like GitHub Pages)
  output: "export",
  // Next.js Image Optimization API doesn't work on static exports
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
