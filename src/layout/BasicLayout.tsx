/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:31:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-14 20:48:08
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { renderRoutes } from '../router';
import { Layout } from 'antd';
import { matchRoutes } from '@/router';
import Watermark from './modules/Watermark';
import Logo from './modules/Logo';
import SideMenu from './modules/SideMenu';
import MultiTab from './modules/MultiTab';
import Actions from './modules/Actions';

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import './index.less';

const { Header, Sider, Content } = Layout;

class BasicLayout extends Component<any> {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render(): React.ReactElement {
    const { routes } = this.props.route;
    const { pathname } = this.props.location;
    const { route } = matchRoutes(routes, pathname).pop();
    const { collapsed } = this.state;
    const cls = {
      [`app-layout`]: !0,
      [`app-layout__sm`]: this.props.size === 'small',
      [`app-layout__lg`]: this.props.size === 'large',
    };
    return (
      <Layout className={classNames(cls)}>
        <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={60}>
          <Logo collapsed={collapsed} />
          <SideMenu collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
            <MultiTab />
            <Actions />
          </Header>
          <Content className={classNames(!route.meta?.bgColor ? 'no-bg-color' : '')}>
            {renderRoutes(routes)}
            <Watermark />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect((state: any) => ({ size: state.app.size }), {})(BasicLayout);
