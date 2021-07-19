/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-19 16:37:33
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { t } from '@/locale';

import './index.less';

const { SubMenu } = Menu;

class StarNav extends Component<any> {
  render(): React.ReactElement {
    return (
      <div className={classNames('app-star-nav')}>
        <Menu mode="inline" theme="dark">
          <SubMenu key="star-nav" icon={<StarFilled />} title={t('app.sidebar.starNav')}>
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default StarNav;
