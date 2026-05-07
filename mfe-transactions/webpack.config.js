const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  output: {
    publicPath: 'auto',
    uniqueName: 'mfeTransactions',
    module: false,
    scriptType: 'text/javascript',
    environment: {
      module: false,
      dynamicImport: false,
    },
  },

  optimization: {
    runtimeChunk: false,
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
  },

  experiments: {
    outputModule: false,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'mfeTransactions',
      filename: 'remoteEntry.js',
      exposes: {
        './TransactionsWeb': './src/bootstrap.ts',
      },
      shared: {
        tslib: { singleton: true, eager: true },
      },
    }),
  ],

  devServer: {
    hot: false,
    liveReload: false,
    webSocketServer: false,
    client: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};
