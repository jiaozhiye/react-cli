/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 14:22:31
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-06-15 09:11:53
 */
import React from 'react';
import { message, notification, Modal } from '@jiaozhiye/qm-design-react';
import { ExclamationCircleOutlined } from '@/icons';
import { debounce, throttle, round, cloneDeep, merge } from 'lodash-es';
import { getToken } from './cookies';
import { t } from '@/locale';
import type { AnyFunction, Nullable } from './types';

/**
 * @description 判断对象属性是否为自身属性
 * @param {object} 目标对象
 * @param {string} 属性名
 * @returns {boolean}
 */
export const hasOwn = (obj: unknown, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * @description 延迟方法，异步函数
 * @param {number} delay 延迟的时间，单位 毫秒
 * @returns
 */
export const sleep = async (delay: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * @description 延迟回调
 * @param {function} cb 回调函数
 * @returns
 */
export const nextTick = (cb: AnyFunction<void>): void => {
  Promise.resolve().then(cb);
};

/**
 * @description 捕获基于 Promise 操作的异常
 * @param {func} asyncFn 异步函数
 * @param {any} params 函数的参数
 * @returns {array} 错误前置
 */
export const errorCapture = async (asyncFn: AnyFunction<any>, ...params: any[]): Promise<any[]> => {
  try {
    const res = await asyncFn(...params);
    return [null, res];
  } catch (e) {
    return [e, null];
  }
};

// 函数的 防抖 和 节流，使用 lodash 工具函数
export { debounce, throttle, round, cloneDeep, merge };

/**
 * @description 判断表单控件的值是否为空
 * @param {string} val 表单项的值
 * @returns {boolean} 表单是否为空
 */
export const isFormEmpty = (input: unknown): boolean => {
  return typeof input === 'undefined' || input === '' || input === null;
};

/**
 * @description 生成 uuid
 * @param {string} prefix 前缀标识
 * @returns {boolean} 生成的 uuid 字符串
 */
export const createUidKey = (prefix = ''): string => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return prefix + uuid;
};

/**
 * @description 获取父窗口的本地存储
 * @param {string} key 本地存储的 key 值
 * @returns {object} 本地存储的 value 值
 */
export const getParentLocal = (key: string): Record<string, any> => {
  try {
    const val = localStorage.getItem(key) || window.parent.localStorage.getItem(key) || '{}';
    return JSON.parse(val);
  } catch (err) {
    console.error('iframe is cross-origin, please set document domain!');
  }
  return {};
};

/**
 * @description 获取 URL 的 pathname
 * @returns {string}
 */
export const getPathName = (fullpath: string) => {
  return fullpath ? fullpath.replace(/\?.*/, '') : '';
};

/**
 * @description 获取当前用例号
 * @returns {string} 用例号
 */
export const getCaseCode = (): string => {
  return window.location.pathname.split('/').pop() || '';
};

/**
 * @description 动态加载 js 文件
 * @param {string} url js 文件地址
 * @param {func} callback 回调函数
 * @returns
 */
export const loadScript = (url: string, callback: () => void): void => {
  const head: HTMLElement = document.getElementsByTagName('head')[0];
  const script: HTMLScriptElement = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onload = (script as any).onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      callback && callback();
      script.onload = (script as any).onreadystatechange = null;
      if (head && script.parentNode) {
        head.removeChild(script);
      }
    }
  };
  head.appendChild(script);
};

/**
 * @description 格式化 URL query 参数
 * @param {string} url 的 query 对象
 * @returns {string}
 */
export const queryParser = (query: Record<string, string | number>): string => {
  if (!Object.keys(query).length) {
    return '';
  }
  let str = '?';
  for (const key in query) {
    str += `${key}=${query[key] ?? ''}&`;
  }
  return str.replace(/&$/, '');
};

/**
 * @description 获取 URL 中的 query 参数
 * @param {string} url 的 query 参数
 * @returns {object}
 */
export const queryFormat = (query: string) => {
  const str = query.replace(/^\?/, '');
  const res: Record<string, string> = {};
  if (str === '') {
    return res;
  }
  const arr = str.split('&');
  arr.forEach((x) => {
    const [key, val] = x.split('=');
    if (key) {
      res[key] = val ?? '';
    }
  });
  return res;
};

/**
 * @description 获取 URL 中的 jwt 参数
 * @returns {string}
 */
export const getUrlToken = () => {
  return queryFormat(window.location.search)[`token`] || '';
};

/**
 * @description 给 URL 添加 jwt 参数
 * @param {string} url url 地址
 * @returns {string} url?token=xxx
 */
export const addUrlToken = (url: string) => {
  const $jwt = getToken();
  return addSearchToURL(url, `?token=${$jwt}`);
};

export const addSearchToURL = (url: string, search: string) => {
  const hasQueryMark = url.replace(/[?&]$/, '').includes('?');
  return url + (!hasQueryMark ? search : search.replace(/^\?/, '&'));
};

/**
 * @description 通过 URL 获取 Domain
 * @param {string} url url 地址
 * @returns {string} domain
 */
export const getDomain = (url: string) => {
  let str = '';
  if (isURL(url)) {
    str = url
      .slice(url.indexOf('.') + 1)
      .split('/')[0]
      .replace(/:\d+$/, '');
  }
  return str;
};

/**
 * @description 判断是否是 URL 格式
 * @param {string} str url 地址
 * @returns {boolean}
 */
export const isURL = (str: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|)' + // domain name
      // '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!pattern.test(str);
};

/**
 * @description 判断是否是外链
 * @returns {boolean}
 */
export const isHttpLink = (path: string) => {
  return /^https?:\/\//.test(path);
};

/**
 * @description 销毁提示消息
 * @returns
 */
export const destroyAlert = () => {
  message.destroy();
  notification.destroy();
};

/**
 * @description Message 消息提示
 * @param {string} msg 提示的文本
 * @param {string} type 提示类型
 * @param {number} delay 延迟的时间，单位 秒
 * @returns
 */
export const Message = (
  msg = '',
  type: 'success' | 'warning' | 'info' | 'error' = 'info',
  delay = 2
): void => {
  message[type](msg, delay);
};

/**
 * @description Notification 通知提示
 * @param {string} msg 提示的文本
 * @param {string} type 提示类型
 * @param {number} delay 延迟的时间，单位 秒，如果值是 0，为手动关闭模式
 * @returns
 */
export const Notification = (
  msg = '',
  type: 'success' | 'warning' | 'info' | 'error' = 'success',
  delay = 4.5
): void => {
  notification[type]({
    message: t('app.information.title'),
    description: msg,
    duration: delay,
  });
};

/**
 * @description 需要确认的操作提示
 * @param {string} msg 提示的文本
 * @param {string} type 提示类型
 * @returns
 */
export const Confirm = async (msg = ''): Promise<void> => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: t('app.information.title'),
      icon: React.createElement(ExclamationCircleOutlined),
      content: msg || t('app.information.confirm'),
      className: 'confirm-info',
      onOk() {
        resolve();
      },
      onCancel() {
        reject();
      },
    });
  });
};

/**
 * @description 操作面板关闭前的提示
 * @param {boolean} allowClose 是否允许关闭
 * @returns Promise
 */
export const confirmBeforeClose = async (allowClose: boolean): Promise<void> => {
  if (!allowClose) {
    try {
      await Confirm(t('app.global.leaveText'));
      return Promise.resolve();
    } catch (err) {
      return Promise.reject();
    }
  }
  return Promise.resolve();
};

/**
 * @description 文件流下载
 * @param {Blob} blob 对象
 * @param {string} fileName 文件名
 * @returns
 */
export const download = (blob: Blob, fileName: string): void => {
  // ie10+
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, decodeURI(fileName));
  } else {
    const downloadUrl: string = window.URL.createObjectURL(blob);
    let a: Nullable<HTMLAnchorElement> = document.createElement('a');
    a.href = downloadUrl;
    a.download = decodeURI(fileName);
    a.click();
    a = null;
  }
};
