var path = require('path');

module.exports = {
  entry: ['./demo/standalone/app'],

  output: {
    filename: './demo/standalone/compiled.app.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.join(__dirname, 'demo', 'standalone') // Must be an absolute path
        ]
      }
    ]
  }
};
