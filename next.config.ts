import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude canvas from client-side bundling
      config.externals = config.externals || {};
      config.externals['canvas'] = 'canvas';
    }
    return config;
  },
};

export default nextConfig;
