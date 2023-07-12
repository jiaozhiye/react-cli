/*
 * @Author: 焦质晔
 * @Date: 2021-02-05 09:13:33
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-06-15 09:24:38
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { getDomain, getUrlToken, queryFormat, destroyAlert } from '@/utils';
import { getToken, setToken } from './utils/cookies';
import { setMicroEvent } from '@/utils/mitt';
import { ACHIEVE_LOCAL } from '@/store/types';
import config from '@/config';
import App from './App';

function render(props) {
  const { container } = props || {};
  ReactDOM.render(
    React.createElement(App),
    container ? container.querySelector('#app') : document.querySelector('#app')
  );
}

function initial() {
  const domain = getDomain(config.baseUrl);
  if (domain) {
    document.domain = domain;
  } else if (!config.isMainApp) {
    try {
      window.parent.localStorage;
    } catch (err) {
      const token = getUrlToken();
      if (token && token !== getToken()) {
        setToken(token);
        window.parent.postMessage({ type: ACHIEVE_LOCAL, data: window.name }, config.postOrigin);
      }
    }
  }
  if (queryFormat(window.location.search).microEnv) {
    window.__MAIM_APP_ENV__ = true;
  }
}

function initialMicro(props) {
  const { microEvent, isMainEnv, isWidget, pathRoute, extraProps } = props || {};
  // Widget 挂件
  if (isWidget) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const routes = require('@/router/config').default;
    const route = routes.find((x) => x.path === pathRoute);
    if (route) {
      route.path = '/';
      extraProps && (route.props = Object.assign({}, route.props, extraProps));
    }
  }
  setMicroEvent(microEvent);
  window.__MAIM_APP_ENV__ = isMainEnv;
}

function doMount() {
  if (config.powerByMicro) {
    // micro-app
    if (window.__MICRO_APP_ENVIRONMENT__) {
      __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
      const __MICRO_APP_UMD__ = true; // 开启 umd 模式 - 内存优化
      if (__MICRO_APP_UMD__) {
        Object.assign(window, { mount, unmount });
      } else {
        mount({});
        window.addEventListener('unmount', () => {
          ReactDOM.unmountComponentAtNode(document.querySelector('#app')!);
        });
      }
    }
    // qiankun
    if (window.__POWERED_BY_QIANKUN__) {
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
  } else {
    render({});
  }
}

initial();

doMount();

export async function bootstrap() {}

export async function mount(props) {
  window.__POWERED_BY_QIANKUN__ && initialMicro(props);
  window.__MICRO_APP_ENVIRONMENT__ && initialMicro(window.microApp.getData());
  render(props);
}

export async function unmount(props) {
  const { container } = props || {};
  destroyAlert();
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#app') : document.querySelector('#app')
  );
}
