/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-24 19:16:33
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { OPEN_VIEW, CLOSE_VIEW, REFRESH_VIEW, PREVENT_TAB } from '@/store/types';
import config from '@/config';

import type { AppState } from '@/store/reducers/app';

const reduxConnect: any = connect;

export default (WrappedComponent: React.ComponentType<any>): any => {
  @reduxConnect(
    (state: AppState) => ({
      size: state.app.size,
      lang: state.app.lang,
    }),
    {}
  )
  @withRouter
  class C extends Component<any> {
    static displayName = `Tool(${WrappedComponent.displayName || WrappedComponent.name})`;

    // 打开新页签
    openView = (fullpath: string, reload?: boolean) => {
      window.parent.postMessage({ type: OPEN_VIEW, data: fullpath, reload }, config.postOrigin);
    };

    // 关闭页签
    closeView = (fullpath: string) => {
      window.parent.postMessage({ type: CLOSE_VIEW, data: fullpath }, config.postOrigin);
    };

    // 刷新页签
    reloadView = () => {
      window.parent.postMessage({ type: REFRESH_VIEW, data: '' }, config.postOrigin);
    };

    addControlTab = (path: string, message?: string) => {
      window.parent.postMessage(
        { type: PREVENT_TAB, data: { action: 'add', path, message } },
        config.postOrigin
      );
    };

    removeControlTab = (path: string) => {
      window.parent.postMessage(
        { type: PREVENT_TAB, data: { action: 'remove', path } },
        config.postOrigin
      );
    };

    render() {
      const { forwardedRef } = this.props;
      return (
        <WrappedComponent
          ref={forwardedRef}
          {...this.props}
          openView={this.openView}
          closeView={this.closeView}
          reloadView={this.reloadView}
          addControlTab={this.addControlTab}
          removeControlTab={this.removeControlTab}
        />
      );
    }
  }

  return React.forwardRef((props: any, ref) => <C {...props} forwardedRef={ref} />);
};
