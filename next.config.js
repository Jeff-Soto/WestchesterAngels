/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_VERSION: '15.5',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://clientdomain.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://clientdomain.com",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

