/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:03:36
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-24 14:52:35
 */
type IConfig = {
  baseUrl: string;
};

type IEnvCongig = Record<'dev' | 'tst' | 'uat' | 'pre' | 'prod' | 'gray', IConfig>;

const env = process.env.ENV_CONFIG || 'prod';

const config: IEnvCongig = {
  dev: {
    baseUrl: '/', // 本地开发环境不走这里，配置请求代理即可
  },
  tst: {
    baseUrl: 'https://sit-apps-fc-base.faw.cn',
  },
  uat: {
    baseUrl: 'https://uat-apps-fc-base.faw.cn',
  },
  pre: {
    baseUrl: 'https://pre-apps-fc-base.faw.cn',
  },
  prod: {
    baseUrl: 'https://apps-fc-base.faw.cn',
  },
  gray: {
    baseUrl: '/',
  },
};

export default Object.assign({}, config[env]) as IConfig;
