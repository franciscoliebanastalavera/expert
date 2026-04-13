// Webpack 5 configuration with Module Federation for the Analytics micro-frontend.
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
      // `publicPath: 'auto'` is required so Module Federation resolves chunks
      // relative to the remoteEntry URL at runtime.
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
          use: 'ts-loader',
          exclude: /node_modules/,
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
        // Share react/react-dom as singletons so the shell and the MFE use
        // the same runtime instance and hooks keep working across boundaries.
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
      // CORS wide open in dev so the shell running on a different port can
      // fetch remoteEntry.js without preflight issues.
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
