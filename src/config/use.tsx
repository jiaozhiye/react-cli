/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 18:27:00
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification, message, ConfigProvider } from 'antd';
import '@/locale/setting';

import { createDictData } from '@/store/actions';
import { isIframe } from '@/router/index';

import zhCN from 'antd/lib/locale/zh_CN';
import enGB from 'antd/lib/locale/en_GB';

import 'antd/dist/antd.less';
// import 'antd/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件
// import 'antd/dist/antd.compact.less'; // 引入官方提供的紧凑 less 样式入口文件
import '@/assets/css/style.less';
import '@/assets/css/antd-ui.less';
import '@/assets/css/iconfont.less';

const messages = {
  [`zh-cn`]: zhCN,
  [`en`]: enGB,
};

notification.config({
  duration: 4.5,
});

message.config({
  duration: 2,
  maxCount: 3,
});

@withRouter
class UseConfig extends Component<any> {
  componentDidMount() {
    this.getDictData();
    window.addEventListener('message', this.messageEventHandle, false);
    if (isIframe(this.props.location.pathname)) {
      document.addEventListener('click', this.clickEventHandle, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageEventHandle);
    document.removeEventListener('click', this.clickEventHandle);
  }

  getDictData() {
    if (!isIframe(this.props.location.pathname)) return;
    this.props.createDictData();
  }

  createMouseEvent() {
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    document.body.click();
  }

  clickEventHandle = () => {
    window.parent.postMessage({ type: 'outside_click', data: '' }, '*');
  };

  messageEventHandle = ({ data }) => {
    if (typeof data !== 'object') return;
    if (data.type === 'outside_click') {
      this.createMouseEvent();
    }
  };

  render() {
    const { pathname } = this.props.location;
    return (
      <ConfigProvider locale={messages[this.props.lang]} componentSize={this.props.size}>
        {isIframe(pathname) ? (
          <section className="iframe">{this.props.children}</section>
        ) : (
          this.props.children
        )}
      </ConfigProvider>
    );
  }
}

export default connect(
  (state: any) => ({
    size: state.app.size,
    lang: state.app.lang,
  }),
  {
    createDictData,
  }
)(UseConfig);
