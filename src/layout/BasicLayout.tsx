/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:31:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-29 12:00:10
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { registerMicroApps, start } from 'qiankun';
import { connect } from 'react-redux';
import { matchRoutes } from '@/router';
import { Layout } from '@jiaozhiye/qm-design-react';
import { getLocalRoutes } from '@/router/config';
import { createDictData, createAuthData, createDeviceType } from '@/store/actions';
import { emitter as microEvent } from '@/utils/mitt';
import config from '@/config';
import type { AppState } from '@/store/reducers/app';

import RouteView from './RouteView';
import SplitView from './modules/SplitView';
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
  locked: boolean;
  left: number;
};

class BasicLayout extends Component<any, IState> {
  public state: IState;

  constructor(props) {
    super(props);
    const isMobile = this.checkDevice();
    this.state = {
      collapsed: isMobile,
      locked: false,
      left: config.sideWidth[0],
    };
    props.createDeviceType(isMobile ? 'mobile' : 'desktop');
    this.registerMicroRoutes();
  }

  get isMobile() {
    return this.props.device === 'mobile';
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
      prefetch: false,
      excludeAssetFilter: (assetUrl) => {
        if (EXCLUDE_URLS.some((x) => assetUrl.startsWith(x))) {
          return true;
        }
        return false;
      },
    });
  };

  componentDidMount() {
    this.props.createDictData();
    this.props.createAuthData();
    window.addEventListener('resize', this.resizeHandler, false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.flattenMenus.length !== this.props.flattenMenus.length) {
      this.startMicroApp();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  toggle = (value?: boolean) => {
    this.setState((prev) => {
      const val = value ?? !prev.collapsed;
      return { collapsed: val, left: val ? config.sideWidth[1] : config.sideWidth[0] };
    });
  };

  checkDevice = () => {
    const rect = document.body.getBoundingClientRect();
    return rect.width - 1 < MOBILE_WIDTH;
  };

  resizeHandler = () => {
    const value = this.checkDevice();
    if (this.isMobile !== value) {
      this.toggle(value); // 重置 collapsed
      this.props.createDeviceType(value ? 'mobile' : 'desktop');
    }
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
    const { collapsed, locked, left } = this.state;
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
        <SplitView
          offset={left}
          min={config.sideWidth[1]}
          max={500}
          threshold={config.sideWidth[0]}
          onDrag={(val) => this.setState({ left: val, collapsed: val === config.sideWidth[1] })}
          onDragChange={(active) => this.setState({ locked: active })}
        />
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={_collapsed}
          width={left}
          collapsedWidth={config.sideWidth[1]}
          style={{ pointerEvents: locked ? 'none' : 'auto' }}
        >
          <Logo collapsed={_collapsed} />
          <AllNav />
          {config.showStarNav && <StarNav />}
          <SideMenu />
        </Sider>
        <Layout style={{ pointerEvents: locked ? 'none' : 'auto' }}>
          <Header>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: classNames('trigger'),
              onClick: () => this.toggle(),
            })}
            <MultiTab />
            <Actions />
          </Header>
          <Content className={classNames(!route.meta?.bgColor ? 'no-bg-color' : '')}>
            <RouteView routes={routes} />
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
    flattenMenus: state.app.flattenMenus,
  }),
  {
    createDictData,
    createAuthData,
    createDeviceType,
  }
)(BasicLayout);
