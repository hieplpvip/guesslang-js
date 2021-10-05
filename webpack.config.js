'use strict';

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { version } = require('./package.json');

const banner = `/*! guesslang.min.js v${version} */`;

module.exports = function (env, argv) {
  const mode = argv.mode || 'none';
  return {
    entry: './lib/index.ts',
    mode: mode,
    target: 'web',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist', 'lib'),
      filename: 'guesslang.min.js',
      libraryTarget: 'umd',
      globalObject: 'this',
      umdNamedDefine: true,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
            compress: mode === 'production',
            mangle: mode === 'production',
            output: {
              beautify: mode !== 'production',
              preamble: banner,
              comments: false,
              ecma: 6,
            },
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              experimentalWatchApi: true,
            },
          },
          exclude: /\.d\.ts$/,
        },
        {
          test: /group1-shard1of1.bin$/,
          type: 'asset/inline',
        },
        {
          test: /model.json$/,
          type: 'asset/source',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@tensorflow/tfjs': path.resolve(__dirname, 'node_modules', '@tensorflow', 'tfjs', 'dist', 'tf.es2017.js'),
      },
    },
    stats: {
      preset: 'errors-warnings',
      assets: true,
      colors: true,
      env: true,
      errorsCount: true,
      warningsCount: true,
      timings: true,
    },
  };
};
