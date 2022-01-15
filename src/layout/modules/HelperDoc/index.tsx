/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 14:05:46
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';

import { QuestionCircleOutlined } from '@/icons';

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
      <div className={classNames('app-helper-doc')}>
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <QuestionCircleOutlined className={`icon`} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default HelperDoc;
