/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:03:36
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-24 14:52:35
 */
type IConfig = {
  domain: string;
};

type IEnvCongig = Record<'dev' | 'tst' | 'uat' | 'pre' | 'prod' | 'gray', IConfig>;

const env = process.env.ENV_CONFIG || 'prod';

const config: IEnvCongig = {
  dev: {
    domain: '', // 用例不跨域，无需设置
  },
  tst: {
    domain: '',
  },
  uat: {
    domain: '',
  },
  pre: {
    domain: '',
  },
  prod: {
    domain: '',
  },
  gray: {
    domain: '',
  },
};

export default Object.assign({}, config[env]) as IConfig;
