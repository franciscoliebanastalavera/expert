// Configuracion de Webpack 5 con Module Federation para el micro-frontend de Analytics
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (env, argv) => {
  // Determinar si estamos en modo produccion
  const isProduction = argv.mode === 'production';

  return {
    // Punto de entrada principal de la aplicacion
    entry: './src/index.tsx',

    output: {
      // Directorio de salida para los archivos compilados
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      // URL publica necesaria para Module Federation
      publicPath: 'auto',
      clean: true,
    },

    resolve: {
      // Extensiones que Webpack resolvera automaticamente
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },

    module: {
      rules: [
        {
          // Regla para procesar archivos TypeScript y TSX
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },

    plugins: [
      // Plugin de Module Federation: expone este MFE como remoto
      new ModuleFederationPlugin({
        // Nombre unico del micro-frontend en la federacion
        name: 'mfeAnalytics',
        // Archivo de entrada remota que consumira el shell
        filename: 'remoteEntry.js',
        // Modulos expuestos al shell u otros micro-frontends
        exposes: {
          './AnalyticsWeb': './src/web-component.tsx',
        },
        // Dependencias compartidas para evitar duplicados en tiempo de ejecucion
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

      // Plugin para generar el HTML de desarrollo/standalone
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        title: 'MFE Analytics - CapitalFlow',
      }),
    ],

    devServer: {
      // Puerto en el que se sirve el micro-frontend
      port: 4201,
      // Permitir solicitudes desde cualquier origen (necesario para Module Federation)
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      hot: true,
      historyApiFallback: true,
    },

    // Generar sourcemaps solo en desarrollo
    devtool: isProduction ? false : 'eval-source-map',
  };
};
