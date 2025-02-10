import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
       
      },
    ],
  },
  reactStrictMode: true,
  env: {
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  },
};

export default nextConfig;
