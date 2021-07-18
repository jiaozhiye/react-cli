/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 17:35:53
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { notification, message, ConfigProvider } from 'antd';
import { connect } from 'react-redux';
import { createDictData } from '@/store/actions';
import { isIframe } from '@/router/index';
import '@/locale/setting';

import zhCN from 'antd/lib/locale/zh_CN';
import enGB from 'antd/lib/locale/en_GB';

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
  }

  getDictData() {
    if (!isIframe(this.props.location.pathname)) return;
    this.props.createDictData();
  }

  clickEventHandle = () => {
    window.parent.postMessage({ type: 'outside_click', data: '' }, '*');
  };

  messageEventHandle = ({ data }) => {
    if (typeof data !== 'object') return;
    if (data.type === 'outside_click') {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      document.body.click();
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
