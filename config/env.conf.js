/*
 * @Author: 焦质晔
 * @Date: 2020-12-03 09:16:26
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-22 20:15:15
 */
const config = {
  dev: {
    // 主机应用
    host: '',
    // 子应用
    dms: '',
    tds: '',
  },
  tst: {
    host: '',
    dms: '',
    tds: '',
  },
  uat: {
    host: '',
    dms: '',
    tds: '',
  },
  pre: {
    host: '',
    dms: '',
    tds: '',
  },
  prod: {
    host: '',
    dms: 'https://dms.faw.cn',
    tds: 'https://tds.faw.cn',
  },
  gray: {
    host: '/gray',
    dms: 'https://dms.faw.cn/gray',
    tds: 'https://tds.faw.cn/gray',
  },
};

module.exports = config[process.env.ENV_CONFIG] || config[`prod`];
