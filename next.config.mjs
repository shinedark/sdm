/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  // Disable type checking during build (we have missing optional dependencies)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Production optimizations
  experimental: {
    optimizePackageImports: ['@vercel/blob', '@vercel/edge-config', 'axios', 'ethers']
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 🚀 SDM CUSTOM REACT ULTRA INTEGRATION (commented out for now)
    // Note: React Ultra build needs more work for full Next.js compatibility
    // if (!dev && !isServer) {
    //   const reactUltraPath = path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js');
    //   config.resolve.alias = {
    //     ...config.resolve.alias,
    //     'react': reactUltraPath,
    //     'react-dom': reactUltraPath
    //   };
    //   console.log('⚛️  Using React Ultra build for production optimization');
    // }
    
    // Enhanced bundle optimization
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      innerGraph: true,
      
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          
          // Custom React Ultra chunk
          reactUltra: {
            test: /[\\/]custom-builds[\\/]react-ultra[\\/]/,
            name: 'react-ultra',
            chunks: 'all',
            priority: 50,
            enforce: true
          },
          
          // Optimized vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            minChunks: 2
          }
        }
      }
    };
    
    // 🎯 Custom React Build Integration - DISABLED (JSX runtime compatibility issues)
    // The custom React builds don't include react/jsx-runtime needed by Next.js
    // Keeping disabled until custom builds are updated with full JSX runtime support
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   'react': path.resolve(__dirname, 'custom-react-builds/react.custom.js'),
    //   'react-dom': path.resolve(__dirname, 'custom-react-builds/react-dom.custom.js'),
    // };
    return config;
  },
  
  // Production compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-testid$', '^data-test.*$']
    } : false
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
  },
  
  // Enhanced caching headers
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
      },
      {
        source: '/_next/static/css/:path*',
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
