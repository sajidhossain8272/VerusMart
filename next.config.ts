import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['cloudinary'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
      {
        protocol: "https",
        hostname: "verusmart.com",
      },
    ],
  },
};


export default nextConfig;