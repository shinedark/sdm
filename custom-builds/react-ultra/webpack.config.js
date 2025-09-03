
// Webpack configuration for React Ultra
module.exports = {
  resolve: {
    alias: {
      'react': path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js'),
      'react-dom': path.resolve(__dirname, 'custom-builds/react-ultra/react-ultra.js')
    }
  }
};
