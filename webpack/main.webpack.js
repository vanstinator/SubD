module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: {
    deepspeech: 'commonjs2 deepspeech',
    'ffmpeg-static': 'commonjs2 ffmpeg-static'
  },
  entry: './core/main.ts',
  module: {
    rules: require('./rules.webpack')
  }
};
