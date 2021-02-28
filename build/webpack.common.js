// https://www.taniarascia.com/how-to-use-webpack/
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('./paths');

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [`${paths.src}/index.js`],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: 'server.js',
    publicPath: '/',
  },
  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: 'assets',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // ESLint configuration
    new ESLintPlugin({
      files: ['.', 'src', 'config'],
      formatter: 'table',
    }),

    // Prettier configuration
    new PrettierPlugin(),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: ['babel-loader'] },
    ],
  },
};
