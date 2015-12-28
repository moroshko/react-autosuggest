var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './demo/src/index'
  ],

  output: {
    path: path.join(__dirname, 'dist'), // Must be an absolute path
    filename: 'index.js',
    publicPath: '/demo/dist'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(__dirname, 'src'), // Must be an absolute path
        path.join(__dirname, 'demo', 'src') // Must be an absolute path
      ]
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer!less'),
      exclude: /node_modules/
    }, {
      test: /\.svg$/,
      loader: 'url?limit=8192!svgo' // 8kb
    }]
  },

  resolve: {
    modulesDirectories: [
      'node_modules',
      'components',
      'src',
      path.join(__dirname, 'demo', 'src') // Must be an absolute path
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('app.css')
  ]
};
