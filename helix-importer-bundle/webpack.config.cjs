const path = require('path');

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const { NormalModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
    port: 8080,
    open: true,
  },
  target: ['web', 'es2020'],
  entry: './src/importer.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:8080/',
    library: {
      // type: 'module',
      name: 'WebImporter',
      type: 'umd',
    },
  },
  // experiments: {
  //   outputModule: true,
  // },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      worker_threads: false,
      // url: false,
      'stream/web': false,
      url: false,
      // 'node:stream': false,
      // 'node:stream/web': false,
      // 'node:process': false,
    },
    alias: {
      'fs-extra': 'fs',
      'node-fetch': 'fetch',
      '@adobe/helix-fetch': 'fetch',
    }
  },
  externals: {
    '@adobe/helix-fetch': 'fetch',
    'node-fetch': 'fetch',
    'node:stream/web': 'commonjs2 node:stream/web',
  },
  plugins: [
    new NormalModuleReplacementPlugin(/node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
      if (resource.request === 'url') {
        // this is some hack, since mdast-util-to-markdown has a `import {URL} from 'node:url`
        // which is handled wrongly by webpack, as the usual `url` polyfill doesn't include URL.
        resource.request = path.resolve(__dirname, './test/url-constructor-polyfill.cjs');
      }
    }),
    new NodePolyfillPlugin(),
  ],
};
