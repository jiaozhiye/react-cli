/*
 * @Author: 焦质晔
 * @Date: 2021-07-15 18:03:03
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-17 09:00:39
 */
const ThemeColorReplacer = require('webpack-custom-theme');
const colors = require('@ant-design/colors');
const config = require('../config');
const utils = require('./utils');

const getAntdSerials = (color) => {
  const lightens = new Array(9).fill(null).map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10);
  });
  const darkens = new Array(6).fill(null).map((t, i) => {
    return ThemeColorReplacer.varyColor.darken(color, i / 10);
  });
  const colorPalettes = colors.generate(color);
  const rgb = ThemeColorReplacer.varyColor.toNum3(color.replace('#', '')).join(',');
  return lightens.concat(darkens).concat(colorPalettes).concat(rgb);
};

const changeSelector = (selector) => {
  switch (selector) {
    case '.ant-calendar-today .ant-calendar-date':
      return ':not(.ant-calendar-selected-date):not(.ant-calendar-selected-day)' + selector;
    case '.ant-btn:focus,.ant-btn:hover':
      return '.ant-btn:focus:not(.ant-btn-primary):not(.ant-btn-danger),.ant-btn:hover:not(.ant-btn-primary):not(.ant-btn-danger)';
    case '.ant-btn.active,.ant-btn:active':
      return '.ant-btn.active:not(.ant-btn-primary):not(.ant-btn-danger),.ant-btn:active:not(.ant-btn-primary):not(.ant-btn-danger)';
    case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
    case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
      return ':not(.ant-steps-item-process)' + selector;
    // fixed https://github.com/vueComponent/ant-design-vue-pro/issues/876
    case '.ant-steps-item-process .ant-steps-item-icon':
      return ':not(.ant-steps-item-custom)' + selector;
    case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
    case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
      return '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover';
    case '.ant-menu-horizontal > .ant-menu-item-selected > a':
    case '.ant-menu-horizontal > .ant-menu-item-selected > a':
      return '.ant-menu-horizontal:not(ant-menu-light):not(.ant-menu-dark) > .ant-menu-item-selected > a';
    case '.ant-menu-horizontal > .ant-menu-item > a:hover':
    case '.ant-menu-horizontal > .ant-menu-item > a:hover':
      return '.ant-menu-horizontal:not(ant-menu-light):not(.ant-menu-dark) > .ant-menu-item > a:hover';
    default:
      return selector;
  }
};

const createThemeColorPlugin = () =>
  new ThemeColorReplacer({
    fileName: utils.assetsPath('css/theme-colors.css'),
    matchColors: getAntdSerials(config.primaryColor),
    changeSelector,
    isJsUgly: process.env.NODE_ENV === 'production',
  });

module.exports = createThemeColorPlugin;
