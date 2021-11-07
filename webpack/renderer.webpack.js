module.exports = {
  resolve: {
    roots: ['./core', './src'],
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: require('./rules.webpack')
  }
};
