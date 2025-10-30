import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better performance
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // ESLint: allow production builds to succeed even if there are ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [];
  },

  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'https://tam-tac.com/:path*',
      },
    ];
  },

  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  serverExternalPackages: ['@ant-design/plots'],

  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
    optimizeCss: true,
    webpackBuildWorker: true,
  },

  turbopack: {
    rules: {},
  },

  webpack: (config, { dev }) => {
    if (dev && process.env.TURBOPACK) {
      return config;
    }
    return config;
  },
};

export default nextConfig;
