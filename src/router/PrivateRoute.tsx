/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 10:12:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-12-11 21:43:40
 */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPathName } from '@/utils';

import type { AppState } from '@/store/reducers/app';

import Loading from '@/pages/loading';

class PrivateRoute extends React.Component<any> {
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
    const { route, whiteList, whiteAuth, flattenMenus } = this.props;

    if (this.isMatch([...whiteList, ...whiteAuth], route.path) || this.isAuth(route.path)) {
      return this.props[`render-props`]();
    }

    if (!flattenMenus.length) {
      return <Loading />;
    }

    return <Redirect to={'/404'} />;
  }
}

export default connect(
  (state: AppState) => ({
    flattenMenus: state.app.flattenMenus,
  }),
  {}
)(PrivateRoute);
