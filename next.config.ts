import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['cloudinary'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'verusmart.com',
        'www.verusmart.com',
        'admin.verusmart.com',
        'localhost:3000',
        'admin.localhost:3000',
      ],
    },
  },
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