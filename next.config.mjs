/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGO_URL: process.env.MONGO_URL,
  },
  images: {
    domains: ["cdn-icons-png.flaticon.com"],
  },
};

export default nextConfig;
