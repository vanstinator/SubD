const webpack = require('webpack');
const dotenv = require('dotenv');

const reactConfig = Object.entries(dotenv.config().parsed)
  .filter(([key, value]) => /^REACT_/.test(key))
  .reduce((config, [key, value]) => {
    return { ...config, [key]: value };
  }, {});

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: require('./rules.webpack')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(reactConfig) // it will automatically pick up key values from .env file
    })
  ]
};
