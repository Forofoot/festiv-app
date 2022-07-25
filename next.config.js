/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = {
  images:{
    domains: ['res.cloudinary.com']
  },
  env: {
    CLOUD_NAME: process.env.CLOUD_NAME
  },
  nextConfig,
  productionBrowserSourceMaps: true,
}

