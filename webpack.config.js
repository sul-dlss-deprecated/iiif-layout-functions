var path = require('path');

module.exports = {
  entry: './src/iiif-layout-functions.js',
  output: {
    path: __dirname,
    filename: 'iiif-layout-functions.js',
    libraryTarget:'umd',
    library: 'manifestLayout'
  },
  module: {
    loaders: [
      { test: path.join(__dirname, 'src'),
        loader: 'babel-loader' }
    ]
  }
};
