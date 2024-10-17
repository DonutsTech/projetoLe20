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
  },
  output: 'export',
  webpack(config) {
    return config;
  },
};

export default withVideos(nextConfig, {
  assetPrefix: '/assets/video',
});
