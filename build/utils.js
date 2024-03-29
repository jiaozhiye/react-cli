/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-02-04 22:24:11
 */
'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mapDir = (d, reg) => {
  const result = [];

  // 获得当前文件夹下的所有的文件夹和文件
  // const [dirs, files] = _(fs.readdirSync(d)).partition((p) =>
  //   fs.statSync(path.join(d, p)).isDirectory()
  // );
  const all = fs.readdirSync(d) || [];
  const dirs = all.filter((p) => fs.statSync(path.join(d, p)).isDirectory());
  const files = all.filter((p) => !dirs.includes(p));

  dirs.forEach((dir) => {
    result.push.apply(result, mapDir(path.join(d, dir), reg));
  });

  files.forEach((file) => {
    if (reg.test(file)) {
      result.push(require(path.join(d, file)));
    }
  });

  return result;
};

exports.resolve = function (dir) {
  return path.resolve(__dirname, '..', dir);
};

exports.assetsPath = function (dir) {
  const assetsSubDirectory =
    process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, dir);
};

exports.deepRequire = mapDir;

exports.cssLoaders = function (options) {
  options = options || {};

  // 设置 css 加载器
  const cssLoader = {
    loader: 'css-loader',
    options: {
      importLoaders: 1 + 1,
      modules: {
        auto: /\.module\.\w+$/,
        localIdentName: '[local]--[hash:base64:5]',
      },
      sourceMap: options.sourceMap,
    },
  };

  // 设置 postcss 加载器
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap,
    },
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions = {}) {
    // 加载器的数组
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
      return ['style-loader'].concat(loaders);
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', {
      lessOptions: {
        modifyVars: {
          // 修改 antd 主题色
          '@primary-color': config.primaryColor,
          '@--primary-color': config.primaryColor,
        },
        javascriptEnabled: true,
      },
      additionalData: `@import "@/assets/css/variables.less";`,
    }),
    sass: generateLoaders('sass'),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
    });
  }

  return output;
};

exports.jsLoaders = function () {
  const loaders = [{ loader: 'babel-loader' }];
  return process.env.NODE_ENV === 'production'
    ? [{ loader: 'thread-loader' }, ...loaders]
    : loaders;
};

exports.tsLoaders = function () {
  return [
    ...exports.jsLoaders(),
    {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        happyPackMode: true,
      },
    },
  ];
};
