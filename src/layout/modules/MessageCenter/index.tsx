/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 14:11:36
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown, Badge } from '@jiaozhiye/qm-design-react';

import { BellOutlined } from '@/icons';

import './index.less';

class MessageCenter extends Component<any> {
  renderMenus() {
    const items = [
      {
        key: 1,
        label: '测试消息1',
      },
      {
        key: 2,
        label: '测试消息2',
      },
    ];
    return <Menu items={items} />;
  }

  render() {
    return (
      <div className={classNames('app-message-center')}>
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <Badge dot>
              <BellOutlined className={`icon`} />
            </Badge>
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default MessageCenter;
