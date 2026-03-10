import type { NextConfig } from "next";

const normalizeDevOrigin = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // allowedDevOrigins expects host patterns (no protocol).
  try {
    if (trimmed.includes("://")) {
      return new URL(trimmed).hostname;
    }
  } catch {
    // Fall through and keep the raw value.
  }

  return trimmed.replace(/:\d+$/, "");
};

const allowedDevOrigins =
  process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",")
    .map(normalizeDevOrigin)
    .filter(Boolean) ?? [
    "192.168.50.121",
    "localhost",
    "127.0.0.1",
  ];

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  allowedDevOrigins,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com']
  }
};

export default nextConfig;
