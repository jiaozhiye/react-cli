/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 14:11:36
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';

import { BellOutlined } from '@/icons';

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
      <div className={classNames('app-message-center')}>
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <BellOutlined className={`icon`} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default MessageCenter;
