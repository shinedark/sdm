/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  // Existing Next.js configuration
  experimental: {
    optimizePackageImports: ['@vercel/blob', '@vercel/edge-config']
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom React Ultra Build Integration
    if (!dev && !isServer) {
      // Use our ultra-optimized React build in production
      const reactUltraPath = path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js');
      
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': reactUltraPath,
        'react-dom': reactUltraPath,
        'react/jsx-runtime': 'react/jsx-runtime',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime'
      };
      
      console.log('🚀 Using React Ultra build for production optimization');
    }
    
    // Bundle analyzer (optional)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-analysis.html',
          openAnalyzer: false
        })
      );
    }
    
    // Additional optimizations
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      
      // More aggressive tree shaking
      innerGraph: true,
      
      // Split chunks optimization
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          
          // Custom React chunk with our optimized build
          reactUltra: {
            test: /[\\/]custom-builds[\\/]react-ultra[\\/]/,
            name: 'react-ultra',
            chunks: 'all',
            priority: 40,
            enforce: true
          },
          
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          }
        }
      }
    };
    
    return config;
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-testid$']
    } : false
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
