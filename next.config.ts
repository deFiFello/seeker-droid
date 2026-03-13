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
  // 1. Move from experimental to top-level for Next 16
  // @ts-ignore
  turbopack: {}, 
  
  // 2. Keep the webpack explicit return
  webpack: (config) => {
    return config;
  },
};

export default withPWA(nextConfig);