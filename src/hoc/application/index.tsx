/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-07-18 13:13:06
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { withRouter } from 'react-router-dom';
import microApp from '@micro-zoe/micro-app';
import { registerMicroApps, loadMicroApp, start } from 'qiankun';
import { getLocalRoutes } from '@/router/config';
import { emitter as microEvent } from '@/utils/mitt';
import { connect } from 'react-redux';
import { matchRoutes } from '@/router';
import { nextTick, Message } from '@/utils';
import { t } from '@/locale';
import {
  createTabMenu,
  createIframeMenu,
  createMicroMenu,
  createThemeColor,
} from '@/store/actions';
import { OUTSIDE_CLICK, SEND_LOCAL } from '@/store/types';
import client from 'webpack-custom-theme/client';
import { getAntdSerials } from '@/layout/modules/ThemeSetting/color';
import store from '@/store';
import config from '@/config';
import routes from '@/router/config';

import type { AppState } from '@/store/reducers/app';
import type { Nullable } from '@/utils/types';

const EXCLUDE_URLS = ['http://localhost:8000', 'http://localhost:18000'];

const reduxConnect: any = connect;

export default (WrappedComponent: React.ComponentType<any>): any => {
  @reduxConnect(
    (state: AppState) => ({
      size: state.app.size,
      lang: state.app.lang,
      tabMenus: state.app.tabMenus,
      microMenus: state.app.microMenus,
      flattenMenus: state.app.flattenMenus,
    }),
    {
      createTabMenu,
      createIframeMenu,
      createMicroMenu,
      createThemeColor,
    }
  )
  @withRouter
  class C extends Component<any> {
    static displayName = `App(${WrappedComponent.displayName || WrappedComponent.name})`;

    setLocalTabs = () => {
      nextTick(() => localStorage.setItem('tab_menus', JSON.stringify(this.props.tabMenus)));
    };

    notDisplayTab = (pathname: string) => {
      return ['/login'].some((x) => pathname.startsWith(x));
    };

    addTabMenus = () => {
      const { tabMenus, flattenMenus } = this.props;
      const { pathname, search } = this.props.location;
      const { route } = matchRoutes(routes, pathname).pop();
      // title 非空判断 - 重要
      if (!route.meta?.title || this.notDisplayTab(pathname)) return;
      // 最大数量判断
      if (tabMenus.length > config.maxCacheNum && !tabMenus.find((x) => x.path === pathname)) {
        Message(t('app.information.maxCache', { total: config.maxCacheNum }), 'warning');
        return this.props.history.go(-1);
      }
      const title = !search
        ? route.meta.title
        : flattenMenus.find((x) => x.key === pathname + search)?.title || route.meta.title;
      // 选项卡菜单
      this.props.createTabMenu(
        Object.assign({}, { path: pathname, title }, search ? { search } : null),
        'add'
      );
      // iframe 模式
      if (route.iframePath) {
        this.props.createIframeMenu({ key: pathname, value: route.iframePath + search }, 'add');
      }
      // micro 模式
      if (route.microHost && route.microRule) {
        this.props.createMicroMenu({ key: pathname, value: route.microHost, search }, 'add');
      }
      // 本地存储
      this.setLocalTabs();
    };

    getIframeNode = (id: string) => {
      return document.getElementById(id) as Nullable<HTMLIFrameElement>;
    };

    refreshView = (pathname: string) => {
      const { search } = this.props.location;
      this.props.history.replace(`/redirect${pathname}` + search);
      // micro-app
      if (config.microType === 'micro-app') {
        const microItem = this.props.microMenus.find((x) => x.key === pathname);
        if (microItem) {
          this.props.createMicroMenu(pathname, 'remove');
          setTimeout(() => this.props.createMicroMenu(microItem, 'add'));
        }
      }
      // iframe
      let $iframe = this.getIframeNode(pathname);
      if (!$iframe) return;
      // 释放 iframe 内存
      $iframe.src = 'about:blank';
      try {
        $iframe.contentWindow?.document.write('');
        $iframe.contentWindow?.document.clear();
      } catch (e) {
        // ...
      }
      $iframe.parentNode?.removeChild($iframe);
      $iframe = null;
      // 释放 iframe 内存 END
      const {
        app: { iframeMenus },
      } = store.getState();
      const target = iframeMenus.find((x) => x.key === pathname);
      this.props.createIframeMenu(pathname, 'remove');
      setTimeout(() => {
        this.props.createIframeMenu({ key: pathname, value: target!.value }, 'add');
      }, 10);
    };

    createMicroApp = (path: string) => {
      const target = getLocalRoutes().find((x) => x.path === path);
      if (!target) return;
      loadMicroApp(
        {
          name: path,
          entry: target.microHost,
          container: `#qk${target.path.replace(/\/+/g, '-')}`,
          // activeRule: target.microRule,
          props: {
            microEvent,
            isMainEnv: config.isMainApp,
          },
        },
        { singular: false }
      );
    };

    registerQiankun = () => {
      const subRoutes = getLocalRoutes();
      registerMicroApps(
        subRoutes
          .filter((x) => x.microHost && x.microRule)
          .map((x) => ({
            name: x.path,
            entry: x.microHost,
            container: `#qk${x.path.replace(/\/+/g, '-')}`,
            activeRule: x.microRule,
            props: {
              microEvent,
              isMainEnv: config.isMainApp,
            },
          }))
      );
    };

    startQiankun = () => {
      if (!config.isMainApp) return;
      start({
        prefetch: false,
        excludeAssetFilter: (assetUrl) => {
          if (EXCLUDE_URLS.some((x) => assetUrl.startsWith(x))) {
            return true;
          }
          return false;
        },
      });
    };

    startMicroApp = () => {
      if (!config.isMainApp) return;
      microApp.start({
        fetch(url, options) {
          if (EXCLUDE_URLS.some((x) => url.startsWith(x))) {
            return Promise.resolve('');
          }
          const config: Record<string, unknown> = {
            // credentials: 'include', // 请求时带上cookie
          };
          return window.fetch(url, Object.assign(options, config)).then((res) => res.text());
        },
      });
    };

    sendLocalStore = (name: string) => {
      this.getIframeNode(name)?.contentWindow!.postMessage(
        {
          type: SEND_LOCAL,
          data: {
            jwt: localStorage.getItem('jwt'),
            userinfo: localStorage.getItem('userinfo'),
            dict: localStorage.getItem('dict'),
            auth: localStorage.getItem('auth'),
          },
        },
        '*'
      );
    };

    setLocalStore = (data: Record<string, string>) => {
      for (const key in data) {
        if (!data[key]) continue;
        localStorage.setItem(key, data[key]);
      }
    };

    openView = (fullpath: string) => {
      if (window.__MAIM_APP_ENV__) return;
      this.props.history.push(fullpath);
    };

    closeView = (fullpath: string) => {
      this.props.createTabMenu(fullpath, 'remove');
      this.props.createIframeMenu(fullpath, 'remove');
      this.props.createMicroMenu(fullpath, 'remove');
      this.setLocalTabs();
    };

    emitOutsideClick = () => {
      if (window.parent === window) return;
      window.parent.postMessage({ type: OUTSIDE_CLICK, data: '' }, '*');
    };

    dispatchMouseClick = () => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      document.body.click();
    };

    setThemeColor = (color: string) => {
      const options = {
        newColors: getAntdSerials(color),
        changeUrl: (cssUrl) =>
          `${process.env.NODE_ENV === 'development' ? '' : config.baseRoute}/${cssUrl}`,
        openLocalStorage: false,
      };
      client.changer.changeColor(options, Promise).then(() => {
        this.props.createThemeColor(color);
        localStorage.setItem('theme_color', color);
      });
    };

    render() {
      const { forwardedRef } = this.props;
      return (
        <WrappedComponent
          ref={forwardedRef}
          {...this.props}
          addTabMenus={this.addTabMenus}
          refreshView={this.refreshView}
          registerQiankun={this.registerQiankun}
          startQiankun={this.startQiankun}
          startMicroApp={this.startMicroApp}
          sendLocalStore={this.sendLocalStore}
          setLocalStore={this.setLocalStore}
          openView={this.openView}
          closeView={this.closeView}
          emitOutsideClick={this.emitOutsideClick}
          dispatchMouseClick={this.dispatchMouseClick}
          setThemeColor={this.setThemeColor}
        />
      );
    }
  }

  return React.forwardRef((props: any, ref) => <C {...props} forwardedRef={ref} />);
};
