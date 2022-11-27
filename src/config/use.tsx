/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-11-27 11:50:34
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification, message, QmConfigProvider } from '@jiaozhiye/qm-design-react';
import '@/locale/setting';
import { createLocaleLang, createComponentSize } from '@/store/actions';
import { isIframe } from '@/router';
import { changeLocale } from '@/locale';
import { application } from '@/hoc';
import * as types from '@/store/types';
import config from '@/config';

import type { Nullable } from '@/utils/types';
import type { AppState } from '@/store/reducers/app';

import '@jiaozhiye/qm-design-react/lib/style/index.less';
import '@/assets/css/reset.less';
import '@/assets/css/style.less';
import '@/assets/css/antd-ui.less';
import '@/assets/css/iconfont.less';

notification.config({
  duration: 4.5,
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
    tinymce: {
      scriptSrc: '/static/tinymce/tinymce.min.js',
    },
  };

  private $styleNode: Nullable<HTMLLinkElement | HTMLStyleElement> = null;

  componentDidMount() {
    const localTheme = localStorage.getItem('theme_color');
    if (localTheme && localTheme !== this.props.themeColor) {
      this.props.setThemeColor(localTheme);
    }
    if (this.props.size === COMPACT_MARK) {
      this.loadStyleNode();
    }
    if (isIframe(this.props.location.pathname)) {
      document.addEventListener('click', this.clickEventHandle, false);
    }
    window.addEventListener('message', this.messageEventHandle, false);
  }

  componentWillUnmount() {
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

  findStyleNode = () => {
    const $links = document.head.getElementsByTagName(
      process.env.NODE_ENV === 'production' ? 'link' : 'style'
    );
    return Array.from($links).pop() || null;
  };

  removeStyleNode = () => {
    try {
      this.$styleNode && document.head.removeChild(this.$styleNode);
    } catch (err) {
      // ...
    }
  };

  loadStyleNode = async () => {
    if (this.$styleNode) {
      return document.head.appendChild(this.$styleNode);
    }
    // 不能使用 require 方法
    await import('@jiaozhiye/qm-design-react/lib/style/compact.less');
    this.$styleNode = this.findStyleNode();
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

  messageEventHandle = ({ data }) => {
    if (typeof data !== 'object') return;
    if (data.type === types.OUTSIDE_CLICK) {
      this.props.dispatchMouseClick();
    }
    if (data.type === types.THEME_COLOR) {
      this.props.setThemeColor(data.data);
    }
    if (data.type === types.THEME_TYPE) {
      // ...
    }
    if (data.type === types.LOCALE_LANG) {
      this.props.createLocaleLang(data.data);
      changeLocale(data.data);
    }
    if (data.type === types.COMP_SIZE) {
      this.props.createComponentSize(data.data);
      localStorage.setItem('size', data.data);
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
      this.props.closeView(data.data);
    }
    if (data.type === types.REFRESH_VIEW) {
      this.props.refreshView(this.props.location.pathname);
    }
    if (data.type === types.PREVENT_TAB) {
      this.props.setForbidenTab(data.data);
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

export default connect(
  (state: AppState) => ({
    size: state.app.size,
    lang: state.app.lang,
    themeColor: state.app.themeColor,
    isReady: state.app.navLoaded,
  }),
  {
    createLocaleLang,
    createComponentSize,
  }
)(UseConfig);
