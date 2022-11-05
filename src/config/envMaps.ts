/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:03:36
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-24 14:52:35
 */
type IConfig = {
  prefix: string;
};

type IEnvCongig = Record<'dev' | 'tst' | 'uat' | 'pre' | 'prod' | 'gray', IConfig>;

const env = process.env.ENV_CONFIG || 'prod';

const config: IEnvCongig = {
  dev: {
    prefix: '/api-dev', // 网关请求前缀
  },
  tst: {
    prefix: '/api-dev',
  },
  uat: {
    prefix: '/api-dev',
  },
  pre: {
    prefix: '/api-dev',
  },
  prod: {
    prefix: '/api-dev',
  },
  gray: {
    prefix: '/api-dev',
  },
};

export default Object.assign({}, config[env]) as IConfig;
