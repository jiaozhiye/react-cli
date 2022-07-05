/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 07:30:32
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-07-04 19:20:54
 */
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare interface Window {
  __MAIM_APP_ENV__: boolean;
  __POWERED_BY_QIANKUN__: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
}
