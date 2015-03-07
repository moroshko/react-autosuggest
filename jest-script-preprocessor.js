var babelJest = require("babel-jest");

module.exports = {
  process: function(src, filename) {
    return babelJest.process(src, filename)
      .replace(/^require.*\.less.*;$/gm, ''); // Hack. See: http://stackoverflow.com/q/28870296/247243
  }
};
