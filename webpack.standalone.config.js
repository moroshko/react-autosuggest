var path = require('path');
var webpack = require('webpack');

module.exports = [
  {
    entry: './src/index.js',

    output: {
      filename: './dist/standalone/autosuggest.js',
      libraryTarget: 'umd',
      library: 'Autosuggest'
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
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

    output: {
      filename: './dist/standalone/autosuggest.min.js',
      libraryTarget: 'umd',
      library: 'Autosuggest'
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
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
      }),
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      })
    ]
  }
];
