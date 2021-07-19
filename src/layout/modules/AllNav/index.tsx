/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-19 16:37:43
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu } from 'antd';
import { AppstoreFilled } from '@ant-design/icons';
import { t } from '@/locale';

import './index.less';

class AllNav extends Component<any> {
  render(): React.ReactElement {
    return (
      <div className={classNames('app-all-nav')}>
        <Menu mode="inline" theme="dark" selectedKeys={[]}>
          <Menu.Item key="all-nav" icon={<AppstoreFilled />}>
            {t('app.sidebar.allNavTitle')}
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default AllNav;
