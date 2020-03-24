const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './demo/src/index',
  mode: 'production',

  output: {
    path: path.join(__dirname, 'demo', 'dist'),
    filename: 'index.js'
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true
      })
    ]
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
    modules: ['node_modules', 'components', 'src']
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
};
