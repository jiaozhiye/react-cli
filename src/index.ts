/*
 * @Author: 焦质晔
 * @Date: 2021-02-05 09:13:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-07-23 10:11:26
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { setMicroEvent } from '@/utils/mitt';
import { ACHIEVE_LOCAL, COMP_SIZE, LOCALE_LANG, THEME_COLOR } from '@/store/types';
import config from '@/config';
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

// const sub_routes = [
//   {
//     path: '/home/fcw', // 特殊的
//     exact: true,
//     meta: { title: '工作台首页', noAuth: true, keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9021/', // 结尾的 / 重要，/react-dms -> 子应用二级目录部署
//     microRule: '/home/fcw',
//   },
//   {
//     path: '/dms/dashboard', // 特殊的
//     exact: true,
//     meta: { title: '业务中心概览', noAuth: true, keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9021/', // 结尾的 / 重要，/react-dms -> 子应用二级目录部署
//     microRule: '/dms/dashboard',
//   },
//   {
//     path: '/dms/spa1001', // 子应用 => /spa1001
//     exact: true,
//     meta: { keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9021/',
//     microRule: '/dms/spa1001',
//   },
//   {
//     path: '/dms/spa1002',
//     exact: true,
//     meta: { keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9021/',
//     microRule: '/dms/spa1002',
//   },
//   {
//     path: '/dms/spa1003',
//     exact: true,
//     meta: { keepAlive: true },
//     iframePath: 'http://localhost:9021/iframe/spa1003',
//     microHost: 'http://localhost:9021/',
//     microRule: '',
//   },
//   {
//     path: '/home/ipds', // 特殊的
//     exact: true,
//     meta: { title: '工作台首页', noAuth: true, keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9022/', // 结尾的 / 重要，/react-tds -> 子应用二级目录部署
//     microRule: '/home/ipds',
//   },
//   {
//     path: '/tds/dashboard', // 特殊的
//     exact: true,
//     meta: { title: '标准中心概览', noAuth: true, keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9022/',
//     microRule: '/tds/dashboard',
//   },
//   {
//     path: '/tds/car1001', // 子应用 => /car1001
//     exact: true,
//     meta: { keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9022/',
//     microRule: '/tds/car1001',
//   },
//   {
//     path: '/tds/car1002',
//     exact: true,
//     meta: { keepAlive: true },
//     iframePath: '',
//     microHost: 'http://localhost:9022/',
//     microRule: '/tds/car1002',
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

function initial() {
  if (env.domain) {
    document.domain = env.domain;
  } else if (!config.isMainApp) {
    try {
      window.parent.localStorage;
    } catch (err) {
      window.parent.postMessage({ type: ACHIEVE_LOCAL, data: window.name }, '*');
    }
  }
}

function initialMicro(props) {
  const { microEvent, isMainEnv } = props;
  setMicroEvent(microEvent);
  microEvent?.$on(COMP_SIZE, (data) => window.postMessage({ type: COMP_SIZE, data }, '*'));
  microEvent?.$on(LOCALE_LANG, (data) => window.postMessage({ type: LOCALE_LANG, data }, '*'));
  microEvent?.$on(THEME_COLOR, (data) => window.postMessage({ type: THEME_COLOR, data }, '*'));
  window.__MAIM_APP_ENV__ = isMainEnv;
}

initial();

if (window.__MICRO_APP_ENVIRONMENT__) {
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
  initialMicro(window.microApp.getData());
  window.addEventListener('unmount', () => {
    ReactDOM.unmountComponentAtNode(document.querySelector('#app')!);
  });
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
} else {
  render({});
}

export async function bootstrap() {}

export async function mount(props) {
  initialMicro(props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#app') : document.querySelector('#app')
  );
}
