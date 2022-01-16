/*
 * @Author: 焦质晔
 * @Date: 2020-12-03 09:16:26
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-12-09 15:01:46
 */
const config = {
  dev: {
    // 当前应用
    host: '//localhost:9020',
    // 格式：子模块: 域名+端口号
    dms: '//localhost:9021',
    tds: '//localhost:9022',
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
    dms: 'http://dms.faw.com',
    tds: 'http://tds.faw.com',
  },
  gray: {
    host: '/gray',
    dms: 'http://dms.faw.com/gray',
    tds: 'http://tds.faw.com/gray',
  },
};

module.exports = config[process.env.ENV_CONFIG] || config[`prod`];
