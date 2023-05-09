/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-11-27 13:45:36
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isEqual } from 'lodash-es';
import classNames from 'classnames';
import { application } from '@/hoc';
import { connect } from 'react-redux';
import type { AppState } from '@/store/reducers/app';

import { Menu } from '@jiaozhiye/qm-design-react';

import './index.less';

const getIcon = (icon: string) => {
  if (!icon) return null;
  return (
    <span className={classNames('anticon')}>
      <i className={classNames(`iconfont`, icon)} />
    </span>
  );
};

const isHttpLink = (path: string) => {
  return /^https?:\/\//.test(path);
};

const conversionPath = (path: string) => {
  if (path.startsWith('http')) {
    return path;
  }
  return `/${path}`.replace(/\/+/g, '/');
};

const deepGetPath = (arr, val, depth = '') => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].key == val) {
      return [depth + (i + 1)];
    }
    if (Array.isArray(arr[i].children)) {
      const temp = deepGetPath(arr[i].children, val, `${depth + (i + 1)}-`);
      if (temp) {
        return [depth + (i + 1), temp].flat();
      }
    }
  }
};

type IState = {
  openKeys: string[];
};

@application
@withRouter
class SideMenu extends Component<any> {
  state: IState = {
    openKeys: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.sideMenus !== this.props.sideMenus) {
      this.setOpenKeys(this.getOpenKeys());
    }
    if (prevProps.location.pathname + prevProps.location.search !== this.getFullPath()) {
      this.setOpenKeys(this.getOpenKeys());
    }
  }

  getFullPath = (): string => {
    const { location } = this.props;
    return location.pathname + location.search;
  };

  getOpenKeys = (): string[] => {
    const allOpenKeys = deepGetPath(this.props.sideMenus, this.getFullPath()) || [];
    return allOpenKeys.slice(0, -1);
  };

  setOpenKeys = (keys: string[]) => {
    if (isEqual(this.state.openKeys, keys)) return;
    this.setState({ openKeys: keys });
  };

  createMenuTree = (arr, depth = '') => {
    return arr
      .filter((x) => !x.hideInMenu)
      .map((item, index) => {
        const { title, icon, target } = item;
        const path: string = conversionPath(item.key || '');
        // 判断是否为 http 链接
        const menuItem = !isHttpLink(path) ? (
          title
        ) : (
          <a href={path} target={target || '_blank'}>
            {title}
          </a>
        );
        const uniqueKey = depth + (index + 1);
        if (Array.isArray(item.children) && !item.hideChildrenInMenu) {
          return {
            key: uniqueKey,
            popupClassName: 'ant-submenu-popup-dark',
            icon: getIcon(icon),
            label: title,
            children: this.createMenuTree(item.children, `${uniqueKey}-`),
          };
        }
        return {
          key: path,
          label: menuItem,
          onClick: () => {
            const {
              location: { pathname },
            } = this.props;
            if (!this.props.microAppReady) return;
            const p = path.split('?');
            this.props.openView(p.length > 1 && p[0] === pathname ? `/redirect${path}` : path);
          },
        };
      });
  };

  render() {
    const { sideMenus } = this.props;
    const { openKeys } = this.state;
    return (
      <div className={classNames('app-side-menu')}>
        <Menu
          key={sideMenus.length}
          mode="inline"
          theme="dark"
          inlineIndent={20}
          items={this.createMenuTree(sideMenus)}
          selectedKeys={[this.getFullPath()]}
          openKeys={openKeys}
          onOpenChange={(keys) => {
            this.setState({ openKeys: keys });
          }}
        />
      </div>
    );
  }
}

export default connect<unknown, unknown, any>(
  (state: AppState) => ({
    sideMenus: state.app.sideMenus,
    microAppReady: state.app.microAppReady,
  }),
  {}
)(SideMenu);
