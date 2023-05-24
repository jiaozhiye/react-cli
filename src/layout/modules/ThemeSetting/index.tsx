/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-07 12:54:52
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Dropdown } from '@jiaozhiye/qm-design-react';

import DarkTheme from './DarkTheme';
import ThemeColor from './ThemeColor';

import { SkinOutlined } from '@/icons';

import './index.less';

class ThemeSetting extends Component<any> {
  renderMenus() {
    return (
      <div className={`ant-dropdown-menu`}>
        <DarkTheme />
        <div style={{ height: '20px' }} />
        <ThemeColor />
      </div>
    );
  }

  render() {
    return (
      <div className={classNames('app-theme-setting')}>
        <Dropdown
          dropdownRender={() => this.renderMenus()}
          overlayClassName="theme-setting__popper"
          placement="bottomRight"
          trigger={['click']}
        >
          <span>
            <SkinOutlined className={`icon`} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default ThemeSetting;
