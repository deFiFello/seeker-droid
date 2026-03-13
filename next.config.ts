import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // This satisfies the error message's request for an empty turbopack config
  // while allowing the PWA webpack plugins to run.
  experimental: {
    turbo: {},
  } as any,
  webpack: (config) => {
    return config;
  },
};

export default withPWA(nextConfig);