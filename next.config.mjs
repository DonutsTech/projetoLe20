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
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Content-Length', value: '849346560' }, // 10MB
        ],
      },
    ];
  },
};

export default withVideos(nextConfig, {
  assetPrefix: '/assets/video',
});
