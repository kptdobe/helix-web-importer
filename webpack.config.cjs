const path = require('path');

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: 'development',
  devServer: {
    static: [{
      directory: path.join(__dirname, 'web'),
      publicPath: '/'
    }],
    
    hot: true,
    port: 8080
  },
  target: ['web', 'es2020'],
  entry: './src/importer.js',
  output: {
    filename: 'importer-bundle.js',
    path: path.resolve(__dirname, 'web/dist'),
    publicPath: '/dist',
    library: {
      name: 'WebImporter',
      type: 'umd',
    },
  },
  resolve: {
    fallback: {
      path: 'path-browserify',
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      worker_threads: false,
      'stream/web': false,
      url: false,
    },
    alias: {
      'fs-extra': 'fs',
      'node-fetch': 'fetch',
    }
  },
  externals: {
    'node-fetch': 'fetch',
    'node:stream/web': 'commonjs2 node:stream/web',
  },
  plugins: [
    new NormalModuleReplacementPlugin(/node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
      if (resource.request === 'url') {
        // this is some hack, since mdast-util-to-markdown has a `import {URL} from 'node:url`
        // which is handled wrongly by webpack, as the usual `url` polyfill doesn't include URL.
        resource.request = path.resolve(__dirname, './polyfills/url-constructor-polyfill.cjs');
      }
    }),
    new NodePolyfillPlugin(),
    new NormalModuleReplacementPlugin(/\@adobe\/helix\-fetch/, (resource) => {
      resource.request = path.resolve(__dirname, './polyfills/fetch-constructor-polyfill.cjs');
    }),
  ],
  module: {
    rules: [
      {
        test: /\.xml$/i,
        type: 'asset/source',
      },
    ],
  }
};
