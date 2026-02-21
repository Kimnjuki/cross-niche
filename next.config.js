/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO Configuration
  trailingSlash: true,
  
  // Redirects for 404 pages (FIX-001)
  async redirects() {
    return [
      // Add 404 redirects here when identified
      // Example: { source: '/old-page', destination: '/new-page', permanent: true },
    ];
  },

  // Headers for security and SEO
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' }
        ]
      }
    ];
  },

  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  poweredByHeader: false,
  
  // Compression
  compress: true,
};

module.exports = nextConfig;
