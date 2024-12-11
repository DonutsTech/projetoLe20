import path from 'path';
import withVideos from 'next-videos';


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(process.cwd(), './src/styles')],
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // output: 'export',
  webpack(config) {
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default withVideos(nextConfig, {
  assetPrefix: '/assets/video',
});
