import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/webp"],
    // Kept short: every entry is repeated in each image's srcset in the HTML.
    deviceSizes: [640, 828, 1080, 1600],
    imageSizes: [96, 256, 384],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
