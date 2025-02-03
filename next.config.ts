/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["frontend-take-home.fetch.com"], // Allow images from this domain
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://frontend-take-home-service.fetch.com/:path*",
      },
    ]
  },
}

module.exports = nextConfig
