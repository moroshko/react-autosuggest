var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');
var host = process.env.NODE_HOST || 'localhost';
var port = process.env.NODE_PORT || 3000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath
}).listen(port, host, function(error) {
  if (error) {
    console.error(error); // eslint-disable-line no-console
  } else {
    console.log(`Demo is ready at http://${host}:${port}/demo/dist/index.html`); // eslint-disable-line no-console
  }
});
