/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-14 16:58:22
 */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';

import './index.less';

class MessageCenter extends Component<any> {
  renderMenus() {
    return (
      <Menu>
        <Menu.Item key="1">测试消息1</Menu.Item>
        <Menu.Item key="2">测试消息2</Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    return (
      <div className="app-theme-setting">
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <i className="iconfont icon-bell" />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default MessageCenter;
