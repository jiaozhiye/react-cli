/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 14:22:31
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 12:40:26
 */
import React from 'react';
import { message, notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { debounce, throttle, round } from 'lodash-es';
import { t } from '@/locale';
import { AnyFunction } from './types';

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
export { debounce, throttle, round };

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
 * @param {string} key uuid 的前缀标识
 * @returns {boolean} 生成的 uuid 字符串
 */
export const createUidKey = (key = ''): string => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return key + uuid;
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
