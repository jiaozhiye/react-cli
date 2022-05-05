/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-16 18:20:00
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Menu } from '@jiaozhiye/qm-design-react';
import { AppstoreFilled } from '@/icons';
import { t } from '@/locale';

import NavList from './NavList';

import './index.less';

class AllNav extends Component<any> {
  static propTypes = {
    collapsed: PropTypes.bool,
  };

  private event;

  private navListRef = React.createRef();

  state = {
    visible: false,
  };

  // componentDidMount() {
  //   this.event = addEventListener(document.querySelector('.ant-layout-sider'), 'click', (ev) => {
  //     const $$allNavMenu = document.getElementById('all-nav');
  //     const $$allNavModal = this.navListRef.current;
  //     if (ev.nativeEvent.path.some((x) => x === $$allNavMenu || x === $$allNavModal)) return;
  //     this.closeHandle();
  //   });
  // }

  // componentWillUnmount() {
  //   this.event.remove();
  // }

  visibleChange = (ev) => {
    ev.domEvent.stopPropagation();
    this.setState({ visible: !this.state.visible });
  };

  closeHandle = () => {
    this.setState({ visible: false });
  };

  render(): React.ReactElement {
    const { collapsed } = this.props;
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
      <div className={classNames(cls)}>
        <Menu mode="inline" theme="dark" selectable={false} items={items} />
        <NavList
          ref={this.navListRef}
          visible={visible}
          collapsed={collapsed}
          onChange={this.closeHandle}
        />
      </div>
    );
  }
}

export default AllNav;
