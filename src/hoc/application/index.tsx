/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-11-23 17:00:19
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
import { Message } from '@/utils';
import { t } from '@/locale';
import {
  createTabMenu,
  createIframeMenu,
  createMicroMenu,
  createThemeColor,
  createPreventTab,
} from '@/store/actions';
import { OUTSIDE_CLICK, SEND_LOCAL } from '@/store/types';
import store from '@/store';
import config from '@/config';
import routes from '@/router/config';

import type { AppState } from '@/store/reducers/app';
import type { Nullable } from '@/utils/types';

const EXCLUDE_URLS = ['http://localhost:8000', 'http://localhost:18000'];
const ASSET_URLS = ['/tinymce/'];

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
      createPreventTab,
    }
  )
  @withRouter
  class C extends Component<any> {
    static displayName = `App(${WrappedComponent.displayName || WrappedComponent.name})`;

    notDisplayTab = (pathname: string) => {
      return ['/login', '/subview'].some((x) => pathname.startsWith(x));
    };

    addTabMenus = (prevPathname: string) => {
      const { tabMenus, flattenMenus } = this.props;
      const { pathname, search } = this.props.location;
      const { route } = matchRoutes(routes, pathname).pop()!;
      // title 非空判断 - 重要
      if (!route.meta?.title || this.notDisplayTab(pathname)) return;
      // 最大数量判断
      if (tabMenus.length >= config.maxCacheNum && !tabMenus.find((x) => x.path === pathname)) {
        Message(t('app.information.maxCache', { total: config.maxCacheNum }), 'warning');
        return this.props.history.go(-1);
      }
      const title = !search
        ? route.meta.title
        : flattenMenus.find((x) => x.key === pathname + search)?.title || route.meta.title;
      // 选项卡菜单
      this.props.createTabMenu(
        Object.assign(
          {},
          { path: pathname, title },
          search ? { search } : null,
          !this.notDisplayTab(prevPathname) ? { from: prevPathname } : null
        ),
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
      if (!target?.microHost) return;
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
            entry: x.microHost!,
            container: `#qk${x.path.replace(/\/+/g, '-')}`,
            activeRule: x.microRule!,
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
        sandbox: {
          strictStyleIsolation: false,
          experimentalStyleIsolation: true, // 模态框的样式会丢失
        },
        // @ts-ignore
        async fetch(url, options) {
          if (EXCLUDE_URLS.some((x) => url.toString().startsWith(x))) {
            return {
              text() {
                return Promise.resolve('');
              },
            };
          }
          const config: Record<string, unknown> = {
            // credentials: 'include', // 请求时带上cookie
          };
          return window.fetch(url, Object.assign({}, options, config));
        },
        excludeAssetFilter: (assetUrl) => {
          if (ASSET_URLS.some((x) => assetUrl.includes(x))) {
            return true; // 不会劫持处理当前文件
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
          return window.fetch(url, Object.assign({}, options, config)).then((res) => res.text());
        },
        excludeAssetFilter(assetUrl) {
          if (ASSET_URLS.some((x) => assetUrl.includes(x))) {
            return true; // 不会劫持处理当前文件
          }
          return false;
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
      this.props.history.push(fullpath);
    };

    closeView = (fullpath: string) => {
      this.props.createTabMenu(fullpath, 'remove');
      this.props.createIframeMenu(fullpath, 'remove');
      this.props.createMicroMenu(fullpath, 'remove');
      this.props.createPreventTab(fullpath, 'remove');
    };

    setForbidenTab = (data: Record<string, string | undefined>) => {
      if (data.action === 'add') {
        this.props.createPreventTab({ path: data.path, message: data.message }, 'add');
      } else {
        this.props.createPreventTab(data.path, 'remove');
      }
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
          setForbidenTab={this.setForbidenTab}
        />
      );
    }
  }

  return React.forwardRef((props: any, ref) => <C {...props} forwardedRef={ref} />);
};
