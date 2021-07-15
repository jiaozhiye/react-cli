/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 08:25:15
 */
import React, { Component } from 'react';
import { notification, message, ConfigProvider } from 'antd';
import { connect } from 'react-redux';
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

class UseConfig extends Component<any> {
  render() {
    return (
      <ConfigProvider locale={messages[this.props.lang]} componentSize={this.props.size}>
        {this.props.children}
      </ConfigProvider>
    );
  }
}

export default connect(
  (state: any) => ({
    size: state.app.size,
    lang: state.app.lang,
  }),
  {}
)(UseConfig);
