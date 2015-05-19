var path = require('path');
var webpack = require('webpack');

module.exports = [{
  entry: './src/Autosuggest.js',

  output: {
    filename: './dist/standalone/autosuggest.js',
    libraryTarget: 'umd',
    library: 'Autosuggest'
  },
  
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel', 'eslint'],
      include: [
        path.join(__dirname, 'src') // Must be an absolute path
      ]
    }]
  },

  externals: {
    react: 'React'
  }
}, {
  entry: './src/Autosuggest.js',

  output: {
    filename: './dist/standalone/autosuggest.min.js',
    libraryTarget: 'umd',
    library: 'Autosuggest'
  },
  
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel', 'eslint'],
      include: [
        path.join(__dirname, 'src') // Must be an absolute path
      ]
    }]
  },

  externals: {
    react: 'React'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}];
  