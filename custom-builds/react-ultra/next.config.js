
// Next.js configuration for React Ultra
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
