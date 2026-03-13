import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore - Turbo property exists at runtime in Next 16 but may fail strict typing
    turbo: {},
  } as any, 
  webpack: (config) => {
    return config;
  },
};

export default withPWA(nextConfig);