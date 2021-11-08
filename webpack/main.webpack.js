module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './core/main.ts',
  module: {
    rules: require('./rules.webpack')
  }
};
