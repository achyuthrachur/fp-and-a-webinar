import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Tailwind v4: no special CSS config needed here
  turbopack: {
    // Fix workspace root detection when multiple lockfiles exist in parent directories
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
