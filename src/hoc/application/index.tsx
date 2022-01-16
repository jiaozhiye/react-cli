/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 12:40:49
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createIframeMenu } from '@/store/actions';
import store from '@/store';
import { AppState } from '@/store/reducers/app';
import { Nullable } from '@/utils/types';

export default (WrappedComponent: React.ComponentType<any>): any => {
  @withRouter
  class C extends Component<any> {
    static displayName = `AppTool(${WrappedComponent.displayName || WrappedComponent.name})`;

    refreshView = (pathname: string): void => {
      const { search } = this.props.location;
      this.props.history.replace(`/redirect${pathname}` + search);
      let $iframe: Nullable<HTMLIFrameElement> = document.getElementById(
        pathname
      ) as HTMLIFrameElement;
      if (!$iframe) return;
      // 未释放内存，待优化
      // $iframe.contentWindow.location.reload();
      // 释放 iframe 内存
      $iframe.src = 'about:blank';
      try {
        $iframe.contentWindow?.document.write('');
        $iframe.contentWindow?.document.clear();
      } catch (e) {
        // ...
      }
      $iframe.parentNode?.removeChild($iframe);
      $iframe = null;
      // 释放 iframe 内存 END
      const {
        app: { iframeMenus },
      } = store.getState();
      const target = iframeMenus.find((x) => x.key === pathname);
      this.props.createIframeMenu(pathname, 'remove');
      setTimeout(
        () => this.props.createIframeMenu({ key: pathname, value: target?.value }, 'add'),
        10
      );
    };

    openView = (fullpath: string): void => {
      this.props.history.push(fullpath);
    };

    closeView = (fullpath: string): void => {};

    render() {
      return (
        <WrappedComponent
          {...this.props}
          refreshView={this.refreshView}
          openView={this.openView}
          closeView={this.closeView}
        />
      );
    }
  }

  return connect(
    (state: AppState) => ({
      size: state.app.size,
      lang: state.app.lang,
    }),
    { createIframeMenu }
  )(hoistStatics(C, WrappedComponent));
};