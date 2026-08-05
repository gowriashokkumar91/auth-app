/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'recipe-data-gowri.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'recipe-data-gowri.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
