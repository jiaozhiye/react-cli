/*
 * @Author: 焦质晔
 * @Date: 2021-02-05 09:13:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-07-04 19:21:14
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { COMP_SIZE, LOCALE_LANG, THEME_COLOR } from '@/store/types';
import { setDocumentDomain } from '@/utils';
import env from '@/config/envMaps';
import App from './App';

// const sub_routes = [
//   {
//     iframePath: 'http://www.faw.cn/react-dms/iframe/spa1001',
//     meta: { keepAlive: true },
//     path: '/dms/spa1001',
//   },
//   {
//     iframePath: 'http://www.faw.cn/react-dms/iframe/spa1002',
//     meta: { keepAlive: true },
//     path: '/dms/spa1002',
//   },
// ];

// localStorage.setItem('sub_routes', JSON.stringify(sub_routes));

declare let __webpack_public_path__: string;

function render(props) {
  const { container } = props;
  ReactDOM.render(
    React.createElement(App),
    container ? container.querySelector('#app') : document.querySelector('#app')
  );
}

setDocumentDomain(env.domain);

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
} else {
  render({});
}

export async function bootstrap() {}

export async function mount(props) {
  const { microEvent, isMainEnv } = props;
  microEvent?.$on(COMP_SIZE, (data) => window.postMessage({ type: COMP_SIZE, data }, '*'));
  microEvent?.$on(LOCALE_LANG, (data) => window.postMessage({ type: LOCALE_LANG, data }, '*'));
  microEvent?.$on(THEME_COLOR, (data) => window.postMessage({ type: THEME_COLOR, data }, '*'));
  window.__MAIM_APP_ENV__ = isMainEnv;
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#app') : document.querySelector('#app')
  );
}
