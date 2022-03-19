/*
 * @Author: 焦质晔
 * @Date: 2021-07-18 19:57:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-19 15:13:36
 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createIframeMenu } from '@/store/actions';
import { OUTSIDE_CLICK } from '@/store/types';
import client from 'webpack-custom-theme/client';
import { getAntdSerials } from '@/layout/modules/ThemeSetting/ThemeColor';
import store from '@/store';
import config from '@/config';

import type { AppState } from '@/store/reducers/app';
import type { Nullable } from '@/utils/types';

const reduxConnect: any = connect;

export default (WrappedComponent: React.ComponentType<any>): any => {
  @reduxConnect(
    (state: AppState) => ({
      size: state.app.size,
      lang: state.app.lang,
    }),
    { createIframeMenu }
  )
  @withRouter
  class C extends Component<any> {
    static displayName = `App(${WrappedComponent.displayName || WrappedComponent.name})`;

    refreshView = (pathname: string) => {
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
      setTimeout(() => {
        this.props.createIframeMenu({ key: pathname, value: target?.value }, 'add');
      }, 10);
    };

    openView = (fullpath: string) => {
      this.props.history.push(fullpath);
    };

    emitOutsideClick = () => {
      window.parent.postMessage({ type: OUTSIDE_CLICK, data: '' }, '*');
    };

    dispatchMouseClick = () => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      document.body.click();
    };

    createThemeColor = (color: string) => {
      const options = {
        newColors: getAntdSerials(color),
        changeUrl: (cssUrl) => `${config.baseRoute}/${cssUrl}`,
        openLocalStorage: false,
      };
      client.changer.changeColor(options, Promise).then(() => {
        this.props.createThemeColor(color);
        localStorage.setItem('theme_color', color);
      });
    };

    render() {
      const { forwardedRef } = this.props;
      return (
        <WrappedComponent
          ref={forwardedRef}
          {...this.props}
          refreshView={this.refreshView}
          openView={this.openView}
          emitOutsideClick={this.emitOutsideClick}
          dispatchMouseClick={this.dispatchMouseClick}
          createThemeColor={this.createThemeColor}
        />
      );
    }
  }

  return React.forwardRef((props: any, ref) => <C {...props} forwardedRef={ref} />);
};
