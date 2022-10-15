/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 10:12:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-14 10:22:29
 */
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { application } from '@/hoc';
import { getPathName } from '@/utils';
import { isIframe } from './index';
import { createMenuList, createTabMenu } from '@/store/actions';

import type { AppState, ITabNav } from '@/store/reducers/app';

import Loading from '@/pages/loading';

let _fetching: boolean;

@application
@withRouter
class PrivateRoute extends Component<any> {
  get loading() {
    return !this.props.flattenMenus.length;
  }

  async componentDidMount() {
    const { pathname } = this.props.location;
    if (_fetching || !this.loading || window.__MAIM_APP_ENV__ || isIframe(pathname)) return;
    _fetching = true;
    const isLoaded: boolean = await this.props.createMenuList();
    _fetching = false;
    if (!isLoaded) {
      return console.error('应用菜单加载失败，请检查菜单接口！');
    }
    this.getLocalTabMenus().forEach((x) => {
      if (this.props.flattenMenus.some((k) => getPathName(k.key) === x.path)) {
        this.props.createTabMenu(x, 'add');
      }
    });
    // 重要
    this.props.addTabMenus('');
  }

  getLocalTabMenus() {
    const localTabNav = localStorage.getItem('tab_menus');
    let result: ITabNav[] = [];
    if (localTabNav) {
      try {
        result = JSON.parse(localTabNav);
      } catch (err) {
        // ...
      }
    }
    return result.slice(1);
  }

  isMatch(arr, path) {
    return path === '/' || arr.some((x) => path.startsWith(x));
  }

  isAuth(path) {
    return (
      this.props.route.meta?.noAuth ||
      this.props.flattenMenus.findIndex((x) => getPathName(x.key) === path) !== -1
    );
  }

  render() {
    const { whiteList, whiteAuth } = this.props;
    const { path } = this.props.route;

    if (this.isMatch([...whiteList, ...whiteAuth], path) || this.isAuth(path)) {
      return this.props[`render-props`]();
    }

    if (this.loading) {
      return <Loading />;
    }

    return <Redirect to={'/404'} />;
  }
}

export default connect(
  (state: AppState) => ({
    tabMenus: state.app.tabMenus,
    flattenMenus: state.app.flattenMenus,
  }),
  {
    createMenuList,
    createTabMenu,
  }
)(PrivateRoute);
