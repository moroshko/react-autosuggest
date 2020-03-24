const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  {
    entry: './src/index.js',
    mode: 'production',

    output: {
      filename: './dist/standalone/autosuggest.js',
      libraryTarget: 'umd',
      library: 'Autosuggest'
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
            path.join(__dirname, 'src') // Must be an absolute path
          ]
        }
      ]
    },

    externals: {
      react: 'React'
    }
  },
  {
    entry: './src/index.js',
    mode: 'production',

    output: {
      filename: './dist/standalone/autosuggest.min.js',
      libraryTarget: 'umd',
      library: 'Autosuggest'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            path.join(__dirname, 'src') // Must be an absolute path
          ]
        }
      ]
    },

    externals: {
      react: 'React'
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]
  }
];
