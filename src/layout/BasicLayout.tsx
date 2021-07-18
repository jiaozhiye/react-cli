/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:31:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-17 07:41:46
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

  createIframeView(route) {
    const { iframeMenus } = this.props;
    return iframeMenus.map((x) => (
      <div
        key={x.path}
        className="iframe-wrapper"
        style={{ display: route.path === x.path ? 'block' : 'none' }}
      >
        <iframe id={x.path} src={x.value} width="100%" height="100%" frameBorder="0" />
      </div>
    ));
  }

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
            {this.createIframeView(route)}
            <Watermark />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  (state: any) => ({
    size: state.app.size,
    iframeMenus: state.app.iframeMenus,
  }),
  {}
)(BasicLayout);
