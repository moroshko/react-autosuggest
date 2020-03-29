var path = require('path');

module.exports = {
  entry: ['./demo/standalone/app'],
  mode: 'production',

  output: {
    filename: './demo/standalone/compiled.app.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, 'demo', 'standalone') // Must be an absolute path
        ]
      }
    ]
  }
};
