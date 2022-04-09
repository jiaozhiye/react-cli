/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-24 13:24:43
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
import { getParentLocal } from '@/utils';

import type { AppState } from '@/store/reducers/app';

const reduxConnect: any = connect;

export default (WrappedComponent: React.ComponentType<any>): any => {
  @reduxConnect(
    (state: AppState) => ({
      auth: state.app.auth,
    }),
    {}
  )
  class C extends Component<any> {
    static displayName = `Auth(${WrappedComponent.displayName || WrappedComponent.name})`;

    getLocalAuth = (): Record<string, string[]> => {
      return Object.keys(this.props.auth).length ? this.props.auth : getParentLocal('auth');
    };

    /**
     * @description 对按钮进行权限控制
     * @param {string} appCode 用例号
     * @param {string} code 权限按钮的 code 码
     * @returns {boolean}
     */
    getButtonAuth = (appCode: string, code: string): boolean => {
      const auth = this.getLocalAuth();
      const list: string[] = auth[appCode] ?? [];
      if (Array.isArray(list)) {
        return list.findIndex((x) => x == code) > -1;
      }
      return false;
    };

    render() {
      const { forwardedRef } = this.props;
      return (
        <WrappedComponent ref={forwardedRef} {...this.props} getButtonAuth={this.getButtonAuth} />
      );
    }
  }

  return React.forwardRef((props: any, ref) => <C {...props} forwardedRef={ref} />);
};
