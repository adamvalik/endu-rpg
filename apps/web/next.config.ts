import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@endu/shared'],
};

export default nextConfig;
