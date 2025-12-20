/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hubbe.biz",
      },
    ],
  },
};

export default nextConfig;
