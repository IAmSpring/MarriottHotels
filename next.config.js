/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: '/DocsPage?path=:path*'
      }
    ];
  },
  // Enable static file serving for markdown files
  async headers() {
    return [
      {
        source: '/docs/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/markdown'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 