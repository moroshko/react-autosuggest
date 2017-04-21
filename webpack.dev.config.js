var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var host = process.env.NODE_HOST || 'localhost';
var port = process.env.NODE_PORT || 3000;

module.exports = {
  entry: [
    `webpack-dev-server/client?http://${host}:${port}`,
    './demo/src/index'
  ],

  output: {
    path: path.join(__dirname, 'dist'), // Must be an absolute path
    filename: 'index.js',
    publicPath: '/demo/dist'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.join(__dirname, 'src'), // Must be an absolute path
          path.join(__dirname, 'demo', 'src') // Must be an absolute path
        ]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less'
        ),
        exclude: /node_modules/
      },
      {
        test: /\.jpg$/,
        loader: 'url?limit=8192' // 8kb
      },
      {
        test: /\.svg$/,
        loader: 'url?limit=8192!svgo' // 8kb
      }
    ]
  },

  postcss: function() {
    return [autoprefixer];
  },

  resolve: {
    modulesDirectories: [
      'node_modules',
      'components',
      'src',
      path.join(__dirname, 'demo', 'src') // Must be an absolute path
    ]
  },

  devtool: 'source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('app.css')
  ]
};
