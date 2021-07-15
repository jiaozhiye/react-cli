/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 08:04:38
 */
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';

import './index.less';

class HelperDoc extends Component<any> {
  renderMenus() {
    return (
      <Menu>
        <Menu.Item key="1">帮助文档</Menu.Item>
        <Menu.Item key="2">使用手册</Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    return (
      <div className="app-helper-doc">
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <i className="iconfont icon-question-circle" />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default HelperDoc;
