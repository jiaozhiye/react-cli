/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-14 19:04:21
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';

import DarkTheme from './DarkTheme';
import ThemeColor from './ThemeColor';

import './index.less';

class ThemeSetting extends Component<any> {
  renderMenus() {
    return (
      <Menu>
        <Menu.Item key="1">
          <DarkTheme />
          <div style={{ height: '20px' }} />
          <ThemeColor />
        </Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    return (
      <div className={classNames('app-theme-setting')}>
        <Dropdown
          overlay={this.renderMenus()}
          overlayClassName="theme-setting-popper"
          placement="bottomRight"
          trigger={['click']}
        >
          <span>
            <i className={classNames('iconfont', 'icon-skin')} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default ThemeSetting;
