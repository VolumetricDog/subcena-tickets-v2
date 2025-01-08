import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "neat-mockingbird-759.convex.cloud",
        protocol: "https",
      },
      {
        hostname: "unique-whale-382.convex.cloud",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
