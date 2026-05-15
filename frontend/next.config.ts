import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['8326-46-28-64-177.ngrok-free.app'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },{
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
