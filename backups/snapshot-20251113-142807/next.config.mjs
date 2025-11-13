/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow optimized images from Shopify CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
    // Alternatively, you could use:
    // domains: ['cdn.shopify.com'],
  },
};

export default nextConfig;
