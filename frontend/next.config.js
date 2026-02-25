/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable Turbopack for now due to compatibility issues
    turbo: {
      enabled: false,
    },
  },
  // Configure webpack to handle the SWC issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Workaround for Windows SWC binary issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;