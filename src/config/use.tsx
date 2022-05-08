/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-24 15:11:23
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification, message, QmConfigProvider } from '@jiaozhiye/qm-design-react';
import '@/locale/setting';
import { createThemeColor, createLocaleLang, createComponentSize } from '@/store/actions';
import { isIframe } from '@/router';
import { changeLocale } from '@/locale';
import { application } from '@/hoc';
import * as types from '@/store/types';
import config from '@/config';
import env from '@/config/envMaps';
import type { AppState } from '@/store/reducers/app';

import '@jiaozhiye/qm-design-react/lib/style/index.less';
// import 'antd/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件
// import 'antd/dist/antd.compact.less'; // 引入官方提供的紧凑 less 样式入口文件
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

@application
@withRouter
class UseConfig extends Component<any> {
  private globalConfig = {
    autoInsertSpaceInButton: false,
    tinymce: {
      scriptSrc: '/static/tinymce/tinymce.min.js',
    },
  };

  componentDidMount() {
    this.setDocumentDomain();
    const localTheme = localStorage.getItem('theme_color');
    if (localTheme && localTheme !== this.props.themeColor) {
      this.props.createThemeColor(localTheme);
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
      this.props.addTabMenus();
    }
  }

  clickEventHandle = () => {
    this.props.emitOutsideClick();
  };

  setDocumentDomain() {
    if (!env.domain) return;
    document.domain = env.domain;
  }

  messageEventHandle = ({ data }) => {
    if (typeof data !== 'object') return;
    if (data.type === types.OUTSIDE_CLICK) {
      this.props.dispatchMouseClick();
    }
    if (data.type === types.THEME_COLOR) {
      this.props.createThemeColor(data.data);
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
    if (data.type === types.OPEN_VIEW) {
      this.props.history.push(data.data);
    }
    if (data.type === types.REFRESH_VIEW) {
      this.props.refreshView(this.props.location.pathname);
    }
    if (data.type === types.SIGN_OUT) {
      const { pathname } = this.props.location;
      window.location.href = `${config.baseRoute}/login?redirect=` + pathname;
    }
  };

  render(): React.ReactElement {
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
  }),
  {
    createThemeColor,
    createLocaleLang,
    createComponentSize,
  }
)(UseConfig);
