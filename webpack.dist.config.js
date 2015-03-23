var path = require('path');

module.exports = {
  entry: './src/Autosuggest.js',

  output: {
    path: path.resolve('./dist'), // Must be an absolute path
    filename: 'Autosuggest.js',
    library: 'Autosuggest',
    libraryTarget: 'commonjs2'
  },

  externals: ['react'],
  
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel!eslint', exclude: /node_modules/ }
    ]
  }
};
