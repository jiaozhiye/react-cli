/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-05-09 09:02:23
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification, message, QmConfigProvider } from '@jiaozhiye/qm-design-react';
import {
  createTheme,
  createLocaleLang,
  createComponentSize,
  createMicroMenu,
  createIframeMenu,
} from '@/store/actions';
import { isIframe } from '@/router';
import { changeLocale } from '@/locale';
import { getMicroEvent } from '@/utils/mitt';
import { application } from '@/hoc';
import * as types from '@/store/types';
import config from '@/config';

import type { AppState } from '@/store/reducers/app';
import type { ComponentSize, Language } from '@/utils/types';

import '@jiaozhiye/qm-design-react/lib/style/index.less';
import '@/assets/css/reset.less';
import '@/assets/css/style.less';
import '@/assets/css/antd-ui.less';
import '@/assets/css/iconfont.less';

notification.config({
  duration: 4.5,
  maxCount: 1,
});

message.config({
  duration: 2,
  maxCount: 3,
});

const COMPACT_MARK = 'small';

@application
@withRouter
class UseConfig extends Component<any> {
  private globalConfig = {
    autoInsertSpaceInButton: false,
    compactModeInSmallSize: true,
    tinymce: {
      scriptSrc: '/static/tinymce/tinymce.min.js',
    },
  };

  private $dynamicStyles: HTMLElement[] = [];

  componentDidMount() {
    const localTheme = localStorage.getItem('theme_color');
    if (localTheme && localTheme !== this.props.themeColor) {
      this.setThemeColor(localTheme);
    }
    if (this.props.size === COMPACT_MARK) {
      this.loadStyleNode();
    }
    if (config.powerByMicro) {
      const microEvent = getMicroEvent();
      microEvent?.$on(types.COMP_SIZE, this.setComponentSize);
      microEvent?.$on(types.LOCALE_LANG, this.setLocaleLang);
      microEvent?.$on(types.THEME_COLOR, this.setThemeColor);
    }
    if (isIframe(this.props.location.pathname)) {
      document.addEventListener('click', this.clickEventHandle, false);
    }
    window.addEventListener('message', this.messageEventHandle, false);
  }

  componentWillUnmount() {
    if (config.powerByMicro) {
      const microEvent = getMicroEvent();
      microEvent?.$off(types.COMP_SIZE, this.setComponentSize);
      microEvent?.$off(types.LOCALE_LANG, this.setLocaleLang);
      microEvent?.$off(types.THEME_COLOR, this.setThemeColor);
    }
    window.removeEventListener('message', this.messageEventHandle);
    document.removeEventListener('click', this.clickEventHandle);
  }

  componentDidUpdate(prevProps) {
    const { pathname: prevPathname } = prevProps.location;
    const { pathname: nextPathname } = this.props.location;
    if (prevPathname !== nextPathname) {
      this.props.addTabMenus(prevPathname);
    }
    if (prevProps.navLoaded !== this.props.navLoaded) {
      if (config.microType === 'qiankun') {
        this.registerQiankun();
      }
      if (config.microType === 'micro-app') {
        this.registerMicroApp();
      }
    }
    if (prevProps.size !== this.props.size) {
      if (this.props.size === COMPACT_MARK) {
        this.loadStyleNode();
      }
      if (prevProps.size === COMPACT_MARK) {
        this.removeStyleNode();
      }
    }
  }

  getMicroHead = () => {
    const microHeadTag = window.__MICRO_APP_ENVIRONMENT__ ? 'micro-app-head' : 'qiankun-head';
    return document.getElementsByTagName(config.powerByMicro ? microHeadTag : 'head')[0];
  };

  getCompactStyles = () => {
    const styleTag =
      process.env.NODE_ENV === 'production' && !config.powerByMicro ? 'link' : 'style';
    const $links = Array.from(this.getMicroHead().getElementsByTagName(styleTag));
    return styleTag === 'style'
      ? $links.filter((x) => x.innerText.match(/#__compact__/) !== null)
      : [$links.pop()!];
  };

  removeStyleNode = () => {
    this.$dynamicStyles.forEach((x) => x.parentNode!.removeChild(x));
  };

  loadStyleNode = async () => {
    if (this.$dynamicStyles.length) {
      return this.$dynamicStyles.forEach((x) => this.getMicroHead().appendChild(x));
    }
    // 不能使用 require 方法
    await import('@jiaozhiye/qm-design-react/lib/style/compact.less');
    this.$dynamicStyles = this.getCompactStyles();
  };

  registerQiankun = () => {
    this.props.registerQiankun();
    this.props.startQiankun();
  };

  registerMicroApp = () => {
    this.props.startMicroApp();
  };

  clickEventHandle = () => {
    this.props.emitOutsideClick();
  };

  setComponentSize = (value: ComponentSize) => {
    this.props.createComponentSize(value);
    localStorage.setItem('size', value);
  };

  setLocaleLang = (value: Language) => {
    this.props.createLocaleLang(value);
    changeLocale(value);
  };

  setThemeColor = (value: string) => {
    this.props.createTheme(value);
  };

  messageEventHandle = ({ data }) => {
    if (typeof data !== 'object') return;
    if (data.type === types.OUTSIDE_CLICK) {
      this.props.dispatchMouseClick();
    }
    if (data.type === types.THEME_COLOR) {
      this.setThemeColor(data.data);
    }
    if (data.type === types.THEME_TYPE) {
      // ...
    }
    if (data.type === types.LOCALE_LANG) {
      this.setLocaleLang(data.data);
    }
    if (data.type === types.COMP_SIZE) {
      this.setComponentSize(data.data);
    }
    if (data.type === types.ACHIEVE_LOCAL) {
      this.props.sendLocalStore(data.data);
    }
    if (data.type === types.SEND_LOCAL) {
      this.props.setLocalStore(data.data);
    }
    // qiankun、micro-app 环境下，window 的 `message` 事件未被隔离，当主应用触发事件时，子应用也会被触发
    if (config.powerByMicro) return;
    if (data.type === types.OPEN_VIEW) {
      this.props.openView(data.data);
    }
    if (data.type === types.CLOSE_VIEW) {
      const [pathname, search = ''] = data.data.split('?');
      if (this.props.location.pathname === pathname) {
        return this.props.refreshView(pathname, `?${search}`);
      }
      if (!data.reload) {
        this.props.openView(data.data);
      } else {
        this.props.createMicroMenu(pathname, 'remove');
        this.props.createIframeMenu(pathname, 'remove');
        setTimeout(() => this.props.openView(data.data));
      }
    }
    if (data.type === types.REFRESH_VIEW) {
      this.props.refreshView(this.props.location.pathname);
    }
    if (data.type === types.PREVENT_TAB) {
      this.props.setControlTab(data.data);
    }
    if (data.type === types.SIGN_OUT) {
      const { pathname } = this.props.location;
      window.location.href = `${config.baseRoute}/login?redirect=` + pathname;
    }
  };

  render() {
    const { pathname } = this.props.location;
    return (
      <QmConfigProvider locale={this.props.lang} size={this.props.size} global={this.globalConfig}>
        {isIframe(pathname) ? (
          <section className={classNames('app-iframe')}>{this.props.children}</section>
        ) : (
          this.props.children
        )}
      </QmConfigProvider>
    );
  }
}

export default connect<unknown, unknown, any>(
  (state: AppState) => ({
    size: state.app.size,
    lang: state.app.lang,
    themeColor: state.app.themeColor,
    navLoaded: state.app.navLoaded,
  }),
  {
    createTheme,
    createLocaleLang,
    createComponentSize,
    createMicroMenu,
    createIframeMenu,
  }
)(UseConfig);
