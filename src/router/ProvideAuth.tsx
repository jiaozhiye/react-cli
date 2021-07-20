/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 10:12:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 14:46:19
 */
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
import { matchRoutes } from '@/router';
import { nextTick, Message } from '@/utils';
import { t } from '@/locale';

import { connect } from 'react-redux';
import { createMenuList, createTabMenu, createIframeMenu, createSignOut } from '@/store/actions';

import routes from '@/router/config';
import config from '@/config';

@withRouter
class ProvideAuth extends Component<any> {
  state = {
    menuLoaded: !!this.props.flattenMenus.length,
  };

  async componentDidMount() {
    if (this.state.menuLoaded) return;
    const bool: boolean = await this.props.createMenuList();
    if (bool) {
      const tabMenus = this.getLocalTabMenus();
      tabMenus.forEach((x) => {
        if (this.props.flattenMenus.some((k) => k.key === x.path)) {
          this.props.createTabMenu({ path: x.path, title: x.title }, 'add');
        }
      });
      this.addTabMenus();
      this.setState({ menuLoaded: bool });
    } else {
      this.props.createSignOut();
    }
  }

  componentDidUpdate(prevProps) {
    const { pathname: prevPathname } = prevProps.location;
    const { pathname: nextPathname } = this.props.location;
    if (prevPathname !== nextPathname) {
      this.addTabMenus();
    }
  }

  getLocalTabMenus() {
    const localTabNav = localStorage.getItem('tab_menus');
    let result: any = [];
    if (localTabNav) {
      try {
        result = JSON.parse(localTabNav);
      } catch (e) {
        // ...
      }
    }
    return result.slice(1);
  }

  addTabMenus() {
    const { tabMenus } = this.props;
    const { pathname, search } = this.props.location;
    const { route } = matchRoutes(routes, pathname).pop();
    if (!route.meta?.title) return;
    // 最大数量判断
    if (tabMenus.length > config.maxCacheNum) {
      return Message(t('app.information.maxCache', { total: config.maxCacheNum }), 'warning');
    }
    // 选项卡菜单
    this.props.createTabMenu({ path: pathname, title: route.meta.title }, 'add');
    // iframe 模式
    if (route.iframePath) {
      this.props.createIframeMenu({ key: pathname, value: route.iframePath + search }, 'add');
    }
    // 本地存储
    nextTick(() => {
      localStorage.setItem('tab_menus', JSON.stringify(this.props.tabMenus));
    });
  }

  isMatch(arr, path) {
    return path === '/' || arr.some((x) => path.startsWith(x));
  }

  isAuth(path) {
    return this.props.flattenMenus.findIndex((x) => x.key === path) !== -1;
  }

  render() {
    const { route, whiteList, whiteAuth } = this.props;
    const { menuLoaded } = this.state;
    const { path } = this.props.route;

    document.title = `${config.systemName}-${route.meta?.title}` || config.systemName;

    if (!menuLoaded && !this.isMatch(whiteList, path)) {
      return <Spin />;
    }

    if (this.isMatch([...whiteList, ...whiteAuth], path) || this.isAuth(path)) {
      return this.props[`render-props`]();
    }

    return <Redirect to={'/404'} />;
  }
}

export default connect(
  (state: any) => ({
    tabMenus: state.app.tabMenus,
    flattenMenus: state.app.flattenMenus,
  }),
  {
    createMenuList,
    createTabMenu,
    createIframeMenu,
    createSignOut,
  }
)(ProvideAuth);
