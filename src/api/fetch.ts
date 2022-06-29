/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 15:39:35
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-19 15:10:02
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  Canceler,
} from 'axios';
import qs from 'qs';
import store from '@/store';
import { createSignOut } from '@/store/actions';
import { getToken } from '@/utils/cookies';
import { Notification } from '@/utils';
import { t } from '@/locale';

type IRequestConfig = AxiosRequestConfig & {
  cancelable?: boolean;
  lockable?: boolean;
};

type IAxiosInstance = AxiosInstance & {
  get<T = any, R = AxiosResponse<T>>(url: string, config?: IRequestConfig): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: IRequestConfig): Promise<R>;
};

type IRequestHeader = {
  jwt: string;
  lang: string;
  userAgent: string;
  gray?: string;
};

// 灰度判断
const isGray = (): boolean => {
  return process.env.ENV_CONFIG === 'gray';
};

// 自定义扩展 header 请求头
const getConfigHeaders = (): IRequestHeader => {
  return {
    jwt: getToken(), // token
    lang: localStorage.getItem('lang') || 'zh-cn', // 多语言
    userAgent: 'pc', // 设备
    gray: isGray() ? '1' : '0', // 灰度
  };
};

const pendingRequest: Map<string, Canceler> = new Map();
const lockingRequest: Map<string, boolean> = new Map();

const generateReqKey = (config: IRequestConfig): string => {
  const { method, url } = config;
  return [method, url].join('&');
};

const addPendingRequest = (config: IRequestConfig): void => {
  if (!config.cancelable) return;
  const requestKey: string = generateReqKey(config);
  config.cancelToken = new axios.CancelToken((cancel) => {
    if (!pendingRequest.has(requestKey)) {
      pendingRequest.set(requestKey, cancel);
    }
  });
};

const removePendingRequest = (config: IRequestConfig): void => {
  const requestKey: string = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey) as Canceler;
    cancelToken(t('app.fetch.cancelText'));
    pendingRequest.delete(requestKey);
  }
};

const addLockingRequest = (config: IRequestConfig): void => {
  if (!config.lockable) return;
  const requestKey: string = generateReqKey(config);
  if (!lockingRequest.has(requestKey)) {
    lockingRequest.set(requestKey, true);
  }
};

const removeLockingRequest = (config: IRequestConfig): void => {
  const requestKey: string = generateReqKey(config);
  if (lockingRequest.has(requestKey)) {
    lockingRequest.delete(requestKey);
  }
};

const getErrorText = (code?: number): string => {
  const statusCode = [
    200, 201, 202, 204, 400, 401, 403, 404, 406, 410, 412, 422, 500, 502, 503, 504,
  ];
  if (!statusCode.includes(code as number)) {
    return '';
  }
  return t(`app.fetch.errorCode.${code}`);
};

// 创建 axios 实例
const instance: IAxiosInstance = axios.create({
  baseURL: '/',
  timeout: 1000 * 20,
  withCredentials: false, // 跨域请求是否携带 cookie
  paramsSerializer: (params): string => {
    // 序列化 GET 请求参数 -> a: [1, 2] => a[0]=1&a[1]=2
    return qs.stringify(params, { arrayFormat: 'indices' });
  },
});

// 异常处理程序
const errorHandler = (error: AxiosError): Promise<AxiosError> => {
  const { isAxiosError, config = {}, response = {} } = error;
  const { status, statusText = '' } = response as AxiosResponse;
  const errortext = getErrorText(status) || statusText || t('app.fetch.errorText');
  removePendingRequest(config);
  removeLockingRequest(config);
  isAxiosError && Notification(errortext, 'error', 10);
  return Promise.reject(error);
};

// 请求拦截
instance.interceptors.request.use((config: IRequestConfig) => {
  // 锁定当次请求
  if (lockingRequest.has(generateReqKey(config))) {
    return Promise.reject({ message: t('app.fetch.lockText') });
  }
  // 取消已发请求
  removePendingRequest(config);
  // 请求头信息，token 验证
  config.headers = {
    ...config.headers,
    ...getConfigHeaders(),
  };
  // 处理 GET 请求缓存
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: +new Date().getTime(),
    };
  }
  addPendingRequest(config);
  addLockingRequest(config);
  return config;
}, errorHandler);

// 响应拦截
instance.interceptors.response.use((response: AxiosResponse) => {
  const { config, data } = response;
  removePendingRequest(config);
  removeLockingRequest(config);
  // 文件流，直接过
  if (config.responseType === 'blob') {
    return response;
  }
  // 请求异常提示信息
  if (data.code !== 200) {
    // token 过期/错误，需要重新登录
    if (data.code === 40105 || data.code === 40108) {
      store.dispatch(createSignOut() as any);
    }
    data.message && Notification(getErrorText(data.code) || data.message, 'error', 10);
  }
  return data;
}, errorHandler);

export { getConfigHeaders };
export default instance;
