/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-29 12:02:05
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu } from '@jiaozhiye/qm-design-react';
import { AppstoreFilled } from '@/icons';
import { t } from '@/locale';

import NavList from './NavList';

import './index.less';

class AllNav extends Component<any> {
  private wrapRef = React.createRef<HTMLDivElement>();

  private navListRef = React.createRef();

  state = {
    visible: false,
  };

  visibleChange = (ev) => {
    ev.domEvent.stopPropagation();
    this.setState({ visible: !this.state.visible });
  };

  closeHandle = () => {
    this.setState({ visible: false });
  };

  getOuterWidth = () => {
    return this.wrapRef.current?.offsetWidth;
  };

  render() {
    const { visible } = this.state;
    const cls = {
      [`app-all-nav`]: true,
      selected: visible,
    };
    const items = [
      {
        key: 'all-nav',
        icon: <AppstoreFilled />,
        label: t('app.sidebar.allNavTitle'),
        onClick: (ev) => this.visibleChange(ev),
      },
    ];
    return (
      <div ref={this.wrapRef} className={classNames(cls)}>
        <Menu mode="inline" theme="dark" selectable={false} items={items} />
        <NavList
          ref={this.navListRef}
          visible={visible}
          getWidth={this.getOuterWidth}
          onChange={this.closeHandle}
        />
      </div>
    );
  }
}

export default AllNav;
