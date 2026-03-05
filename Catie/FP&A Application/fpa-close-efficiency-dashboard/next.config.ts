import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Tailwind v4: no special CSS config needed here
  turbopack: {
    // Fix workspace root detection when multiple lockfiles exist in parent directories
    root: path.resolve(__dirname),
  },
  webpack: (config) => {
    // Force recharts and victory-vendor to use CJS builds in webpack mode.
    // The ESM builds fail because victory-vendor/es/d3-scale.js re-exports from
    // the bare name "d3-scale" which webpack can't resolve in strict ESM context.
    const alias = config.resolve!.alias as Record<string, string>;
    alias.recharts = path.resolve(__dirname, 'node_modules/recharts/lib/index.js');
    return config;
  },
};

export default nextConfig;
