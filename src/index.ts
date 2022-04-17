/*
 * @Author: 焦质晔
 * @Date: 2021-02-05 09:13:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-17 09:41:52
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { COMP_SIZE, LOCALE_LANG, THEME_COLOR } from '@/store/types';
import App from './App';

declare const window: Window & {
  __POWERED_BY_QIANKUN__: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
};
declare let __webpack_public_path__: string;

function render(props) {
  const { container } = props;
  ReactDOM.render(
    React.createElement(App),
    container ? container.querySelector('#app') : document.querySelector('#app')
  );
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
} else {
  render({});
}

export async function bootstrap() {}

export async function mount(props) {
  const { microEvent } = props;
  microEvent?.$on(COMP_SIZE, (data) => window.postMessage({ type: COMP_SIZE, data }, '*'));
  microEvent?.$on(LOCALE_LANG, (data) => window.postMessage({ type: LOCALE_LANG, data }, '*'));
  microEvent?.$on(THEME_COLOR, (data) => window.postMessage({ type: THEME_COLOR, data }, '*'));
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#app') : document.querySelector('#app')
  );
}
