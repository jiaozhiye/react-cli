/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:31:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2023-07-23 19:09:38
 */
/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event';
import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { matchRoutes } from '@/router';
import { application } from '@/hoc';
import { Layout } from '@jiaozhiye/qm-design-react';
import {
  createDictData,
  createAuthData,
  createMicroState,
  createDeviceType,
} from '@/store/actions';
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

type IState = {
  collapsed: boolean;
  locked: boolean;
  left: number;
};

@application
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
  }

  get isMobile() {
    return this.props.device === 'mobile';
  }

  componentDidMount() {
    this.props.fetchNavMenus();
    if (!window.__MAIM_APP_ENV__) {
      this.props.createDictData();
      this.props.createAuthData();
      window.addEventListener('resize', this.resizeHandler, false);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang !== this.props.lang) {
      this.props.fetchNavMenus(true);
      if (!window.__MAIM_APP_ENV__) {
        this.props.createDictData(true);
        this.props.createAuthData(true);
      }
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
    return iframeMenus.map((x) => {
      if (!x.keep && route.path !== x.key) {
        return null;
      }
      return (
        <div
          key={x.key}
          className={classNames('app-iframe-container')}
          style={{ display: route.path === x.key ? 'block' : 'none' }}
        >
          <iframe
            name={x.key}
            src={x.value}
            width="100%"
            height="100%"
            frameBorder="0"
            onLoad={(ev) => {
              const $iframe = ev.target as HTMLIFrameElement;
              try {
                $iframe.contentWindow!.__MAIM_APP_ENV__ = config.isMainApp;
              } catch (err) {
                // ...
              }
              $iframe.focus();
            }}
          />
        </div>
      );
    });
  }

  createMicroView(route) {
    const { microMenus, createMicroState } = this.props;
    return microMenus.map((x) => {
      const { key, value, keep } = x;
      if (!keep && route.path !== key) {
        return null;
      }
      return config.microType === 'qiankun' ? (
        <div
          key={key}
          id={`qk${key.replace(/\/+/g, '-')}`}
          style={{ display: route.path === key ? 'block' : 'none', height: '100%' }}
        />
      ) : (
        <micro-app
          key={key}
          name={key.replace(/\/+/g, '-').slice(1)}
          baseroute={key}
          url={value}
          data={{
            microEvent,
            isMainEnv: config.isMainApp,
            isWidget: true,
            pathRoute: key,
          }}
          style={{ display: route.path === key ? 'block' : 'none', height: '100%' }}
          // onCreated={() => createMicroState(false)}
          // onMounted={() => createMicroState(true)}
          // onError={() => createMicroState(true)}
        />
      );
    });
  }

  render() {
    const { routes } = this.props.route;
    const { pathname } = this.props.location;
    const { route } = matchRoutes(routes, pathname).pop()!;
    const { collapsed, locked, left } = this.state;
    const cls = {
      [`app-layout`]: !0,
      [`is-mobile`]: this.isMobile,
      [`show-sidebar`]: this.isMobile && !collapsed,
      [`hide-sidebar`]: this.isMobile && collapsed,
      [`app-layout__sm`]: this.props.size === 'small',
      [`app-layout__lg`]: this.props.size === 'large',
    };
    const _style: React.CSSProperties = { pointerEvents: locked ? 'none' : undefined };
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
          collapsed={collapsed}
          width={left}
          collapsedWidth={config.sideWidth[1]}
          style={_style}
        >
          <Logo collapsed={collapsed} />
          <AllNav />
          {config.showStarNav && <StarNav />}
          <SideMenu collapsed={collapsed} />
        </Sider>
        <Layout style={_style}>
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

export default connect<unknown, unknown, any>(
  (state: AppState) => ({
    device: state.app.device,
    iframeMenus: state.app.iframeMenus,
    microMenus: state.app.microMenus,
  }),
  {
    createDictData,
    createAuthData,
    createMicroState,
    createDeviceType,
  }
)(BasicLayout);
