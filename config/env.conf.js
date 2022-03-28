/*
 * @Author: 焦质晔
 * @Date: 2020-12-03 09:16:26
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-28 18:38:57
 */
const config = {
  dev: {
    // 主机应用
    publicPath: '/',
    // 子应用
    dms: '',
    tds: '',
  },
  tst: {
    publicPath: '/',
    dms: '',
    tds: '',
  },
  uat: {
    publicPath: '/',
    dms: '',
    tds: '',
  },
  pre: {
    publicPath: '/',
    dms: '',
    tds: '',
  },
  prod: {
    publicPath: '/',
    dms: 'https://dms.faw.cn',
    tds: 'https://tds.faw.cn',
  },
  gray: {
    publicPath: '/gray/',
    dms: 'https://dms.faw.cn/gray',
    tds: 'https://tds.faw.cn/gray',
  },
};

module.exports = config[process.env.ENV_CONFIG] || config[`prod`];
