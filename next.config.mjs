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
  api: {
    bodyParser: {
      sizeLimit: '500mb', // Ajuste conforme necessário (ex: '5mb', '50mb')
    },
  },
  // output: 'export',
  webpack(config) {
    return config;
  },
};

export default withVideos(nextConfig, {
  assetPrefix: '/assets/video',
});
