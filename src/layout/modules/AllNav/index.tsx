/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-21 16:55:29
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Menu } from 'antd';
import { AppstoreFilled } from '@ant-design/icons';
import { t } from '@/locale';

import NavList from './NavList';

import './index.less';

class AllNav extends Component<any> {
  static propTypes = {
    collapsed: PropTypes.bool,
  };

  state = {
    visible: false,
  };

  visibleChange = () => {
    this.setState({ visible: !this.state.visible });
  };

  closeHandle = () => {
    this.setState({ visible: false });
  };

  render(): React.ReactElement {
    const { collapsed } = this.props;
    const { visible } = this.state;
    return (
      <div className={classNames('app-all-nav')}>
        <Menu mode="inline" theme="dark" selectable={false}>
          <Menu.Item key="all-nav" icon={<AppstoreFilled />} onClick={this.visibleChange}>
            {t('app.sidebar.allNavTitle')}
          </Menu.Item>
        </Menu>
        <NavList visible={visible} collapsed={collapsed} onChange={this.closeHandle} />
      </div>
    );
  }
}

export default AllNav;
