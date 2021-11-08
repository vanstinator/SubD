const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: require('./rules.webpack')
  }
};
