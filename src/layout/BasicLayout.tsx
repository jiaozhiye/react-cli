/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:31:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-17 09:43:44
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { registerMicroApps, start } from 'qiankun';
import { connect } from 'react-redux';
import { renderRoutes } from '../router';
import { Layout } from '@jiaozhiye/qm-design-react';
import { matchRoutes } from '@/router';
import { getLocalRoutes } from '@/router/config';
import { createDictData, createAuthData, createDeviceType } from '@/store/actions';
import { emitter as microEvent } from '@/utils/mitt';
import config from '@/config';
import type { AppState } from '@/store/reducers/app';

import Watermark from './modules/Watermark';
import ContentMasker from './modules/ContentMasker';
import Logo from './modules/Logo';
import AllNav from './modules/AllNav';
import StarNav from './modules/StarNav';
import SideMenu from './modules/SideMenu';
import MultiTab from './modules/MultiTab';
import Actions from './modules/Actions';

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@/icons';

import './index.less';

const { Header, Sider, Content } = Layout;

const MOBILE_WIDTH = 992;
const EXCLUDE_URLS = ['http://localhost:8000', 'http://localhost:18000'];

type IState = {
  collapsed: boolean;
};

class BasicLayout extends Component<any> {
  public state: IState;

  constructor(props) {
    super(props);
    const isMobile = this.checkDevice();
    this.state = { collapsed: isMobile };
    props.createDeviceType(isMobile ? 'mobile' : 'desktop');
    this.registerMicroRoutes();
  }

  get isMobile() {
    return this.props.device === 'mobile';
  }

  get asideWidth() {
    if (this.isMobile) {
      return config.sideWidth[0];
    }
    return !this.state.collapsed ? config.sideWidth[0] : config.sideWidth[1];
  }

  registerMicroRoutes = () => {
    const subRoutes = getLocalRoutes();
    registerMicroApps(
      subRoutes
        .filter((x) => x.microRule)
        .map((x) => ({
          name: x.path,
          entry: x.microHost,
          container: `#qk${x.path.replace(/\/+/g, '-')}`,
          activeRule: x.microRule,
          props: {
            microEvent,
          },
        }))
    );
  };

  startMicroApp = () => {
    if (!config.isMainApp) return;
    start({
      singular: false,
      excludeAssetFilter: (assetUrl) => {
        if (EXCLUDE_URLS.some((x) => assetUrl.startsWith(x))) {
          return true;
        }
        return false;
      },
    });
  };

  componentDidMount() {
    this.startMicroApp();
    this.props.createDictData();
    this.props.createAuthData();
    window.addEventListener('resize', this.resizeHandler, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  toggle = (value?: boolean) => {
    this.setState({ collapsed: value ?? !this.state.collapsed });
  };

  checkDevice = () => {
    const rect = document.body.getBoundingClientRect();
    return rect.width - 1 < MOBILE_WIDTH;
  };

  resizeHandler = () => {
    const isMobile = this.checkDevice();
    this.toggle(isMobile); // 重置 collapsed
    this.props.createDeviceType(isMobile ? 'mobile' : 'desktop');
  };

  createIframeView(route) {
    const { iframeMenus } = this.props;
    return iframeMenus.map((x) => (
      <div
        key={x.key}
        className={classNames('app-iframe-container')}
        style={{ display: route.path === x.key ? 'block' : 'none' }}
      >
        <iframe
          id={x.key}
          src={x.value}
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={(ev) => (ev.target as HTMLIFrameElement).focus()}
        />
      </div>
    ));
  }

  createMicroView(route) {
    const { microMenus } = this.props;
    return microMenus.map((x) => (
      <div
        key={x.key}
        id={`qk${x.key.replace(/\/+/g, '-')}`}
        style={{ display: route.path === x.key ? 'block' : 'none' }}
      />
    ));
  }

  render(): React.ReactElement {
    const { routes } = this.props.route;
    const { pathname } = this.props.location;
    const { route } = matchRoutes(routes, pathname).pop();
    const { collapsed } = this.state;
    const cls = {
      [`app-layout`]: !0,
      [`is-mobile`]: this.isMobile,
      [`show-sidebar`]: this.isMobile && !collapsed,
      [`hide-sidebar`]: this.isMobile && collapsed,
      [`app-layout__sm`]: this.props.size === 'small',
      [`app-layout__lg`]: this.props.size === 'large',
    };
    const _collapsed = !this.isMobile ? collapsed : false;
    return (
      <Layout className={classNames(cls)}>
        {this.isMobile && !collapsed && <ContentMasker onClick={() => this.toggle(true)} />}
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={_collapsed}
          width={config.sideWidth[0]}
          collapsedWidth={config.sideWidth[1]}
        >
          <Logo collapsed={_collapsed} />
          <AllNav collapsed={_collapsed} />
          {config.showStarNav && <StarNav />}
          <SideMenu />
        </Sider>
        <Layout>
          <Header>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: classNames('trigger'),
              onClick: () => this.toggle(),
            })}
            <MultiTab />
            <Actions />
          </Header>
          <Content className={classNames(!route.meta?.bgColor ? 'no-bg-color' : '')}>
            {renderRoutes(routes)}
            {this.createIframeView(route)}
            {this.createMicroView(route)}
          </Content>
          {config.openWatermark && <Watermark />}
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  (state: AppState) => ({
    size: state.app.size,
    device: state.app.device,
    iframeMenus: state.app.iframeMenus,
    microMenus: state.app.microMenus,
  }),
  {
    createDictData,
    createAuthData,
    createDeviceType,
  }
)(BasicLayout);
