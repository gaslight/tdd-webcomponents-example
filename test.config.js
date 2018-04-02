const path = require('path');

module.exports = {
  entry: './src/menu.spec.js',
  mode: 'development',
  output: {
    filename: 'tests.js',
    path: path.resolve(__dirname, 'dist')
  }
};
