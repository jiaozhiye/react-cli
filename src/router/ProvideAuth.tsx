/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 10:12:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 14:20:34
 */
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
import { matchRoutes } from '@/router';
import { debounce } from '@/utils';

import { connect } from 'react-redux';
import { createMenuList, createTabMenu, createIframeMenu } from '@/store/actions';

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
      this.setState({ menuLoaded: bool });
    } else {
      // 退出登录
    }
  }

  componentDidUpdate() {
    this.addTabMenusHandle();
  }

  addTabMenusHandle = debounce(this.addTabMenus);

  addTabMenus() {
    const { pathname } = this.props.location;
    const { whiteAuth } = this.props;
    const { route } = matchRoutes(routes, pathname).pop();
    if (whiteAuth.some((x) => pathname.startsWith(x))) return;
    this.props.createTabMenu({ path: pathname, title: route.meta.title }, 'add');
    // iframe 模式
    if (route.meta.iframe) {
      this.props.createIframeMenu({ value: route.meta.iframe, key: pathname }, 'add');
    }
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
    flattenMenus: state.app.flattenMenus,
  }),
  {
    createMenuList,
    createTabMenu,
    createIframeMenu,
  }
)(ProvideAuth);
