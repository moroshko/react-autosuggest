var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/AutosuggestContainer.js',

  output: {
    filename: './dist/Autosuggest.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'src') // Must be an absolute path
      ]
    }]
  },

  externals: {
    react: 'React'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })/*,
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    })*/
  ]
};
