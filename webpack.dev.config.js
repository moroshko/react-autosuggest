const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const host = process.env.NODE_HOST || 'localhost';
const port = process.env.NODE_PORT || 3000;

module.exports = {
  mode: 'development',
  entry: [
    `webpack-dev-server/client?http://${host}:${port}`,
    './demo/src/index'
  ],

  output: {
    path: path.join(__dirname, 'dist'), // Must be an absolute path
    filename: 'index.js',
    publicPath: '/demo/dist/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'src'), // Must be an absolute path
          path.join(__dirname, 'demo', 'src') // Must be an absolute path
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()]
            }
          },
          {
            loader: 'less-loader',
            options: {
              paths: [path.resolve(__dirname, 'demo', 'src')]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader?limit=8192' // 8kb
      },
      {
        test: /\.svg$/,
        use: [
          'url-loader?limit=8192!', // 8kb
          'svgo-loader'
        ]
      }
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      'components',
      'src',
      path.join(__dirname, 'demo', 'src') // Must be an absolute path
    ]
  },

  devtool: 'source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'app.css'
    })
  ]
};
