/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-13 21:13:13
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { OPEN_VIEW, REFRESH_VIEW } from '@/store/types';

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

    openView = (fullpath: string) => {
      window.parent.postMessage({ type: OPEN_VIEW, data: fullpath }, '*');
    };

    closeView = (fullpath: string) => {};

    reloadView = () => {
      window.parent.postMessage({ type: REFRESH_VIEW, data: '' }, '*');
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
        />
      );
    }
  }

  return React.forwardRef((props: any, ref) => <C {...props} forwardedRef={ref} />);
};
