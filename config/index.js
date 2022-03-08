/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-08 08:34:52
 */
'use strict';
const path = require('path');
const appConf = require('./app.conf');
const envConf = require('./env.conf');

function resolve(dir) {
  return path.resolve(__dirname, '..', dir);
}

// 配置常量
const HOST = 'localhost';
const PORT = 9020;

module.exports = {
  ...appConf,

  // 模块路径别名
  pathAlias: {
    '@': resolve('src'),
    '@test': resolve('src/modules/test'),
    '@framework': resolve('src/modules/framework'),
  },

  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath:
      process.env.ENV_CONFIG === 'gray' ? `//${HOST}:${PORT}/gray/` : `//${HOST}:${PORT}/`,

    // 请求代理配置 -> can be modified
    proxyTable: {
      '/api': {
        target: 'http://10.133.67.49:8093',
        changeOrigin: true, // 支持跨域
        // secure: false, // 支持 https
        pathRewrite: {
          '^/api': '/api', // 连接开发环境，走网关的那种
          // '^/api/[a-zA-Z_]+/': '/' // 本地开发，不走网关，直接调本地服务
        },
      },
    },
    // 请求代理配置 END

    // Various Dev Server settings
    host: HOST,
    port: PORT,
    autoOpenBrowser: true,

    // Use Eslint
    useEslint: true,

    // Source Maps
    devtool: 'eval-cheap-source-map',
    cssSourceMap: true,
  },

  build: {
    // Template for index.html
    index: resolve('dist/index.html'),

    // Paths
    assetsRoot: resolve('dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: `${envConf.host}/`,

    // Source Maps
    productionSourceMap: false,
    devtool: 'source-map',

    // Gzip
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
  },
};
