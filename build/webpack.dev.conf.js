/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-06-24 21:41:04
 */
'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const baseWebpackConfig = require('./webpack.base.conf');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

process.env.NODE_ENV = 'development';

const HOST = process.env.HOST || config.dev.host;
const PORT = process.env.PORT || config.dev.port;

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: false }),
  },
  devtool: config.dev.devtool,
  devServer: {
    /* 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html */
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{ from: /.*/, to: config.dev.assetsPublicPath + 'index.html' }],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    static: [
      {
        directory: utils.resolve(config.dev.assetsSubDirectory),
        publicPath: [config.dev.assetsPublicPath],
        watch: true,
      },
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false,
      },
      progress: true,
    },
    compress: true,
    host: HOST,
    port: PORT,
    hot: true, // 热加载
    open: config.dev.autoOpenBrowser,
    proxy: config.dev.proxyTable,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new Dotenv({
      path: utils.resolve('.env.dev'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      favicon: 'public/favicon.ico',
      // inject: true,
      inject: 'body', // for qiankun
      templateParameters: {
        BASE_URL: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
        THEME_COLOR: config.primaryColor,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
        },
      ],
    }),
  ],
});

if (config.dev.useEslint) {
  devWebpackConfig.plugins.push(
    new ESLintPlugin({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      context: utils.resolve('src'),
      formatter: require.resolve('react-dev-utils/eslintFormatter'),
      eslintPath: require.resolve('eslint'),
      cache: true,
      cacheLocation: utils.resolve('node_modules/.cache/.eslintcache'),
    })
  );
}

module.exports = devWebpackConfig;
