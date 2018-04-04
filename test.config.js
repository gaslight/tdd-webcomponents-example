const path = require('path');

module.exports = {
  entry: './src/hello-world.spec.js',
  mode: 'development',
  output: {
    filename: 'tests.js',
    path: path.resolve(__dirname, 'dist')
  }
};
