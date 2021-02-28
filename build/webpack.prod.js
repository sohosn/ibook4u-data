/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: paths.build,
    filename: 'index.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'package.json', to: 'package.json' },
        { from: 'package-lock.json', to: 'package-lock.json' },
        { from: 'configs', to: 'configs' },
      ],
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: ['...'],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
