const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: 'auto',
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          type: 'asset/source',
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: 'mfeAnalytics',
        filename: 'remoteEntry.js',
        exposes: {
          './AnalyticsWeb': './src/web-component.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: false,
          },
        },
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        title: 'MFE Analytics - CapitalFlow',
      }),
    ],

    devServer: {
      port: 4201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      hot: true,
      historyApiFallback: true,
    },

    devtool: isProduction ? false : 'eval-source-map',
  };
};
