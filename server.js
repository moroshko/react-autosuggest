var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, 'localhost', function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log('Demo is ready at http://localhost:3000/demo/dist/index.html');
  }
});
