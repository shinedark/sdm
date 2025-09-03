
# @sdm/react-ultra

Ultra-optimized React build with 0.43% size reduction.

## Stats
- Original size: 135.37KB
- Optimized size: 134.79KB  
- Reduction: 0.58KB (0.43%)

## Usage

### Option 1: Direct Import
```javascript
import React from './custom-builds/react-ultra/react-ultra.js';
```

### Option 2: Webpack Alias
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'react': path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js'),
      'react-dom': path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js')
    }
  }
};
```

### Option 3: Next.js Integration
```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js'),
      'react-dom': path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js')
    };
    return config;
  }
};
```

## Features
- Full React 18 API compatibility
- 0.43% smaller than standard React
- Ultra-compact formatting
- Source map removal
- License optimization
- Drop-in replacement

## Generated
2025-09-03T01:12:56.315Z by SDM Semantic Build Optimizer
