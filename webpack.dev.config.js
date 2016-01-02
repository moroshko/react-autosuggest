var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HappyPack = require('happypack');

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
    loaders: [
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        include: [
          path.join(__dirname, 'src'), // Must be an absolute path
          path.join(__dirname, 'demo', 'src') // Must be an absolute path
        ]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer!less'),
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
    new ExtractTextPlugin('app.css'),
    new HappyPack({
      loaders: [
        {
          path: path.resolve(__dirname, 'node_modules/babel-loader/index.js'), // Must be an absolute path
          query: '?presets[]=es2015,presets[]=stage-0,presets[]=react'
        }
      ]
    })
  ]
};
