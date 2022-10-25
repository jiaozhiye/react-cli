/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-10-25 20:11:03
 */
'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const envConf = require('../config/env.conf');
const createThemeColorPlugin = require('./theme.plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

// 创建子模块引用
const createModuleRemotes = () => {
  const result = {};
  // 规则：子模块: 子模块@域名:端口号/remoteEntry.js
  // dms: `dms@${envConf.dms}/remoteEntry.js`
  Object.keys(envConf).forEach((key) => {
    if (key === 'publicPath') return;
    result[key] = `${key}@${envConf[key]}/remoteEntry.js`;
  });
  return result;
};

module.exports = {
  target: ['browserslist'],
  entry: {
    app: utils.resolve('src/index.ts'),
  },
  output: {
    path: config.build.assetsRoot,
    filename: 'js/[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
    // for qiankun
    ...(config.name !== 'app'
      ? {
          library: `${config.name}-[name]`,
          libraryTarget: 'umd',
          chunkLoadingGlobal: `webpackJsonp_${config.name}`,
        }
      : null),
  },
  resolve: {
    // 配置解析规则
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: config.pathAlias,
  },
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      // js jsx
      {
        test: /\.js(x)?$/,
        use: utils.jsLoaders(),
        exclude: /node_modules/,
        include: [utils.resolve('src')],
      },
      // mjs
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
        include: [/node_modules/],
      },
      // ts tsx
      {
        test: /\.ts(x)?$/,
        use: utils.tsLoaders(),
        exclude: /node_modules/,
        include: [utils.resolve('src')],
      },
      // do not base64-inline SVG
      {
        test: /\.(svg)(\?.*)?$/i,
        type: 'asset/resource',
        generator: {
          filename: utils.assetsPath('img/[contenthash:8][ext][query]'),
        },
      },
      // images
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 1024, // 小于 1M 表现形式为 baser64；大于 1M 文件会被生成到输出到目标目录
          },
        },
        generator: {
          filename: utils.assetsPath('img/[contenthash:8][ext][query]'),
        },
      },
      // fonts
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 10, // 10K
          },
        },
        generator: {
          filename: utils.assetsPath('fonts/[contenthash:8][ext][query]'),
        },
      },
      // media
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
        type: 'asset/resource',
        generator: {
          filename: utils.assetsPath('media/[contenthash:8][ext][query]'),
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.ENV_CONFIG': JSON.stringify(process.env.ENV_CONFIG),
      'process.env.THEME_COLOR': JSON.stringify(config.primaryColor),
    }),
    createThemeColorPlugin(),
    // new ModuleFederationPlugin({
    //   name: config.name,
    //   remotes: createModuleRemotes(),
    //   shared: ['react', 'react-dom'],
    // }),
  ],
};
