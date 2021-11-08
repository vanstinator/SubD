module.exports = [
  {
    test: /\.node$/,
    use: 'node-loader'
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules'
      }
    }
  },
  {
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader'
    }
  },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    loader: 'json-loader'
  },
  {
    test: /\.(svg|png|jpe?g|gif|ico)$/i,
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]'
    }
  }
];
